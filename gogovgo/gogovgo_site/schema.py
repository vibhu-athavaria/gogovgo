import graphene
from cloudinary.models import CloudinaryField
from cloudinary import CloudinaryImage
from django.contrib.auth.models import User
from graphene_django.converter import convert_django_field
from graphene_django.types import DjangoObjectType

from gogovgo.gogovgo_site import models
from gogovgo.gogovgo_site.constants import SENTIMENT_NEGATIVE, SENTIMENT_POSITIVE


class TagHelper:
    """Helper method to get, set or update tags"""

    @staticmethod
    def get_tags(politician, sentiment):
        """
        Get  tags for a politician

        Args:
            politician: Politician to get tags for
            sentiment: Type of tags to selected i.e. positive or negative

        Returns: list of tags

        """
        tags = models.Tag.objects.filter(politician=politician, sentiment=sentiment)
        tags = tags.order_by('-weight').values_list('value', flat=True)
        return tags

    @staticmethod
    def clean_tags(tags):
        """Validate tags before inserting"""
        if not isinstance(tags, list):
            return
        tags = [str(tag).strip().lower() for tag in tags if tag ]
        return tags

    @staticmethod
    def add_tags(review, tags):
        """Add tags to politician and review"""
        tags = TagHelper.clean_tags(tags)
        if not tags:
            return

        #   get existing & matching tags
        db_tags = models.Tag.objects.filter(politician=review.politician,
                                            sentiment=review.sentiment,
                                            value__in=tags)
        db_tags = {tag.value: tag for tag in db_tags}

        #   logic to add new tag or increment weight if tag already exists
        for tag in tags:
            t = None
            try:
                t = db_tags[tag]
            except KeyError:
                t = models.Tag.objects.create(politician=review.politician,
                                         value=tag, sentiment=review.sentiment)
            else:
                t.weight += 1
                t.save()

            review.tags.add(t)



@convert_django_field.register(CloudinaryField)
def my_convert_function(field, registry=None):
    return graphene.String()


class GovernmentDepartmentType(DjangoObjectType):
    class Meta:
        model = models.GovernmentDepartment


class PublicOfficeTitleType(DjangoObjectType):
    class Meta:
        model = models.PublicOfficeTitle


def connection_for_type(_type):
    class Connection(graphene.Connection):
        total_count = graphene.Int()

        class Meta:
            name = _type._meta.name + 'Connection'
            node = _type

        def resolve_total_count(self, args, context, info):
            return self.length

    return Connection


class UserType(DjangoObjectType):
    class Meta:
        model = User


UserType.Connection = connection_for_type(UserType)


class UserProfileType(DjangoObjectType):
    class Meta:
        model = models.UserProfile


UserProfileType.Connection = connection_for_type(UserProfileType)


class PollType(DjangoObjectType):
    class Meta:
        model = models.Poll


PollType.Connection = connection_for_type(PollType)


class PoliticianType(DjangoObjectType):
    positive_tags = graphene.List(graphene.String)
    negative_tags = graphene.List(graphene.String)
    hero_url = graphene.String()
    avatar_url = graphene.String()
    thumbnail_tag = graphene.String()

    class Meta:
        model = models.Politician

    def resolve_thumbnail_tag(self, *args):
        if self.avatar:
            src = CloudinaryImage(str(self.avatar)).build_url(width=263, height=225)
            return src
        else:
            return ""

    def resolve_hero_url(self, *args):
        if self.hero_banner:
            src = CloudinaryImage(str(self.hero_banner)).build_url()
            return src
        else:
            return ""

    def resolve_avatar_url(self, *args):
        if self.avatar:
            src = CloudinaryImage(str(self.avatar)).build_url()
            return src
        else:
            return ""

    def resolve_positive_tags(self, *args):
        return TagHelper.get_tags(politician=self, sentiment=SENTIMENT_POSITIVE)

    def resolve_negative_tags(self, *args):
        return TagHelper.get_tags(politician=self, sentiment=SENTIMENT_NEGATIVE)


PoliticianType.Connection = connection_for_type(PoliticianType)


class ReviewType(DjangoObjectType):
    tags = graphene.List(graphene.String)

    class Meta:
        model = models.Review

    def resolve_tags(self, *args):
        return [tag.value for tag in self.tags.all()]

ReviewType.Connection = connection_for_type(ReviewType)


class CabinetType(DjangoObjectType):
    class Meta:
        model = models.Cabinet


class Tag(graphene.InputObjectType):
    id = graphene.Int()
    name = graphene.String()


class CreateReview(graphene.Mutation):
    class Input:
        politician_id = graphene.ID()
        sentiment = graphene.String()
        full_name = graphene.String()
        email_address = graphene.String()
        body = graphene.String()
        location = graphene.String()
        tags = graphene.List(Tag)

    ok = graphene.Boolean()
    review = graphene.Field(lambda: ReviewType)

    @staticmethod
    def mutate(root, args, context, info):
        user = None

        if all(key in args for key in ['full_name', 'email_address']):
            fullname = args.get('full_name', '')
            email_address = args.get('email_address', '')
            split_name = fullname.split(' ')
            first_name = split_name[0]
            last_name = ' '.join(split_name[1:]) if len(split_name) > 1 else ''

            try:
                user = User.objects.get(email=email_address)
            except models.User.DoesNotExist:
                user, _ = models.User.objects.create(
                    username=email_address,
                    email=email_address,
                    first_name=first_name,
                    last_name=last_name,
                    is_active=False
                )

            del args['full_name']
            del args['email_address']

        location = args['location']
        state, country = location.split(',')

        review = models.Review.objects.create(
            politician_id=args['politician_id'],
            user=user,
            state=state.strip() or None,
            country=country.strip(),
            sentiment=args['sentiment'],
            body=args['body']
        )

        tags = [tag['name'] for tag in args['tags']]
        TagHelper.add_tags(review, tags)

        ok = True
        return CreateReview(review=review, ok=ok)


class UpdateReview(graphene.Mutation):
    class Input:
        review_id = graphene.ID()
        up_vote = graphene.Boolean()

    ok = graphene.Boolean()
    review = graphene.Field(lambda: ReviewType)

    @staticmethod
    def mutate(root, args, context, info):
        review = models.Review.objects.get(pk=args['review_id'])
        if args['up_vote']:
            review.up_vote += 1
        else:
            review.down_vote += 1

        review.save()

        ok = True
        return CreateReview(review=review, ok=ok)


class Mutations(graphene.ObjectType):
    create_review = CreateReview.Field()
    update_review = UpdateReview.Field()


class Query(graphene.AbstractType):
    users = graphene.List(UserType)
    userprofiles = graphene.List(UserProfileType)
    politician = graphene.Field(
        PoliticianType,
        id=graphene.ID(),
        url=graphene.String()
    )
    all_politicians = graphene.List(PoliticianType)
    cabinet_members = graphene.List(CabinetType)
    polls = graphene.List(PollType)
    public_office_title_types = graphene.List(
        PublicOfficeTitleType,
        country=graphene.String()
    )
    review = graphene.Field(ReviewType, id=graphene.ID())
    reviews = graphene.List(ReviewType)

    @graphene.resolve_only_args
    def resolve_users(self):
        return User.objects.all()

    @graphene.resolve_only_args
    def resolve_userprofiles(self):
        # We can easily optimize query count in the resolve method
        return models.UserProfile.objects.select_related('user').all()

    @graphene.resolve_only_args
    def resolve_polls(self):
        return models.Poll.objects.all()

    @graphene.resolve_only_args
    def resolve_all_politicians(self):
        return models.Politician.objects.all()

    def resolve_politician(self, args, context, info):
        title_url = args.get('url')
        return models.Politician.objects.get(public_office_title__url=title_url)

    @graphene.resolve_only_args
    def resolve_public_office_title_types(self, **kwargs):
        country = kwargs.get('country')
        return models.PublicOfficeTitle.objects.filter(country=country).all()

    def resolve_reviews(self, args, context, info):
        sentiment = args.get('sentiment')
        reviews = models.Review.objects.all().order_by('-created')
        if sentiment:
            reviews = reviews.filter(sentiment=sentiment)
        return reviews

    def resolve_review(self, args, context, info):
        id = args.get('id')
        return models.Review.objects.get(pk=id)


    @graphene.resolve_only_args
    def resolve_cabinet_members(self):
        return models.Cabinet.objects.all()
