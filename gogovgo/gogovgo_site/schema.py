import graphene
from cloudinary.models import CloudinaryField
from cloudinary import CloudinaryImage
from django.contrib.auth.models import User
from graphene_django.converter import convert_django_field
from graphene_django.types import DjangoObjectType

from gogovgo.gogovgo_site import models
from gogovgo.gogovgo_site.constants import SENTIMENT_NEGATIVE, SENTIMENT_POSITIVE


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
        tags = self.reviews.filter(
            sentiment=SENTIMENT_POSITIVE
        ).prefetch_related('tags').order_by('-tags__weight').values_list('tags__id', 'tags__value').distinct().all()
        return [{'id': int(tag[0]), 'name': str(tag[1])} for tag in tags if tag[0]]

    def resolve_negative_tags(self, *args):
        tags = self.reviews.filter(
            sentiment=SENTIMENT_NEGATIVE
        ).prefetch_related('tags').order_by('-tags__weight').values_list('tags__id', 'tags__value').distinct().all()
        return [{'id': int(tag[0]), 'name': str(tag[1])} for tag in tags if tag[0]]


PoliticianType.Connection = connection_for_type(PoliticianType)


class ReviewType(DjangoObjectType):
    class Meta:
        model = models.Review


ReviewType.Connection = connection_for_type(ReviewType)


class ReasonTagType(DjangoObjectType):
    class Meta:
        model = models.ReasonTag


ReasonTagType.Connection = connection_for_type(ReasonTagType)


class ReviewHasReasonType(DjangoObjectType):
    class Meta:
        model = models.ReviewHasReasonTag


class CabinetType(DjangoObjectType):
    class Meta:
        model = models.Cabinet


class Tag(graphene.InputObjectType):
    id = graphene.Int()
    name = graphene.String()


class CreateReview(graphene.Mutation):
    class Input:
        user_id = graphene.ID()
        politician_id = graphene.ID()
        sentiment = graphene.String()
        body = graphene.String()
        location = graphene.String()
        tags = graphene.List(Tag)

    ok = graphene.Boolean()
    review = graphene.Field(lambda: ReviewType)

    @staticmethod
    def mutate(root, args, context, info):
        user = None

        if all(key in args for key in ['fullname', 'emailAddress']):
            fullname = args.get('fullname')
            email_address = args.get('emailAddress')
            split_name = fullname.split(' ')
            first_name = split_name[0]
            last_name = ' '.join(split_name[1:]) if len(split_name) > 1 else ''

            user, _ = models.User.objects.get_or_create(
                username=email_address,
                email_address=email_address,
                first_name=first_name,
                last_name=last_name
            )
            del args['fullname']
            del args['emailAddress']

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

        tags = args['tags']
        for tag in tags:
            id = tag.get('id')
            if id is not None:
                reason_tag = models.ReasonTag.objects.get(pk=id)
                reason_tag.weight += 1
                reason_tag.save()
            else:
                reason_tag, _ = models.ReasonTag.objects.get_or_create(
                    value=tag['name'],
                    sentiment=args['sentiment']
                )

            models.ReviewHasReasonTag.objects.create(
                review=review,
                reason_tag=reason_tag
            )

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


class CreateReasonTag(graphene.Mutation):
    class Input:
        value = graphene.String()
        weight = graphene.Float()
        sentiment = graphene.String()

    ok = graphene.Boolean()
    reason_tag = graphene.Field(lambda: ReasonTagType)

    @staticmethod
    def mutate(root, args, context, info):
        reason_tag = models.ReasonTag(
            value=args.get('value'),
            weight=args.get('weight'),
            sentiment=args.get('sentiment')
        )
        reason_tag.save()
        ok = True
        return CreateReasonTag(reason_tag=reason_tag, ok=ok)


class Mutations(graphene.ObjectType):
    create_review = CreateReview.Field()
    update_review = UpdateReview.Field()
    create_reason_tag = CreateReasonTag.Field()


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
    reasontags = graphene.List(ReasonTagType)
    reviewhasreasontype = graphene.List(ReviewHasReasonType)

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
    def resolve_reasontags(self):
        return models.ReasonTag.objects.all()

    @graphene.resolve_only_args
    def resolve_reviewhasreasontype(self):
        return models.ReviewHasReasonTag.objects.all()

    @graphene.resolve_only_args
    def resolve_cabinet_members(self):
        return models.Cabinet.objects.all()
