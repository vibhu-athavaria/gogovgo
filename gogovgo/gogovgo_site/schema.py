from __future__ import division
import math

import graphene
from cloudinary.models import CloudinaryField
from cloudinary import CloudinaryImage
from graphene_django.converter import convert_django_field
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError
from django_countries import countries

from django.contrib.auth.models import User
from django.db import IntegrityError

from gogovgo.gogovgo_site import models
from gogovgo.gogovgo_site.constants import SENTIMENT_NEGATIVE, SENTIMENT_POSITIVE
from gogovgo.gogovgo_site.constants import REVIEW_APPROVED, US_STATES


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
        tags = models.Tag.objects.filter(politician=politician, sentiment=sentiment, active=True)
        tags = tags.order_by('-weight').values_list('value', 'weight')[:10]
        return tags


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
    positive_tags = graphene.List(graphene.List(graphene.String))
    negative_tags = graphene.List(graphene.List(graphene.String))
    hero_url = graphene.String()
    avatar_url = graphene.String()
    thumbnail_tag = graphene.String()
    approval_count = graphene.Int()
    disapproval_count = graphene.Int()

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

    def resolve_approval_count(self, *args):
        query = {
            'politician': self,
            'sentiment': SENTIMENT_POSITIVE,
            'status': REVIEW_APPROVED
        }
        return models.Review.objects.filter(**query).count()

    def resolve_disapproval_count(self, *args):
        query = {
            'politician': self,
            'sentiment': SENTIMENT_NEGATIVE,
            'status': REVIEW_APPROVED
        }
        return models.Review.objects.filter(**query).count()

    def resolve_positive_tags(self, *args):
        return TagHelper.get_tags(politician=self, sentiment=SENTIMENT_POSITIVE)

    def resolve_negative_tags(self, *args):
        return TagHelper.get_tags(politician=self, sentiment=SENTIMENT_NEGATIVE)


PoliticianType.Connection = connection_for_type(PoliticianType)


class LocationHelper(object):

    @staticmethod
    def get_country(review):
        countries_dict = {short_name: long_name for short_name, long_name in countries}
        return countries_dict[review.country]

    @staticmethod
    def get_state(review):
        states = {short_name: long_name for short_name, long_name in US_STATES}
        return states[review.state]



class ReviewType(DjangoObjectType):
    tags = graphene.List(graphene.String)
    location = graphene.String()

    class Meta:
        model = models.Review

    def resolve_tags(self, *args):
        return [tag.value for tag in self.tags.all()]

    def resolve_location(self, *args):
        location = LocationHelper.get_country(review=self).replace(' of America', '')
        if self.country == 'US' and self.state:
            location += ', ' + LocationHelper.get_state(review=self)
        return location


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
                user = models.User.objects.create(
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

        try:
            review = models.Review(
                politician_id=args['politician_id'],
                user=user,
                state=state.strip() or None,
                country=country.strip(),
                sentiment=args['sentiment'],
            )
            review.body = args['body']
            review.save(disable_auto_approve=True)
        except IntegrityError:
            raise GraphQLError('You have already submitted a review for this politician')

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


class ReviewPaginationHelper(object):
    """Helper class to get reviews for a politician as paginated Query"""

    #   show 20 reviews per page
    per_page = 20

    def __init__(self, pid, page):
        self._id = pid
        self.page = page or 1

    def get_reviews(self):
        positive_reviews = self._get(sentiment=SENTIMENT_POSITIVE)
        negative_reviews = self._get(sentiment=SENTIMENT_NEGATIVE)
        total_pages = max(positive_reviews['totalPages'], negative_reviews['totalPages'])
        return {
            'page': self.page,
            'pages': total_pages,
            'hasMore': total_pages > self.page,
            'positive': positive_reviews['data'],
            'negative': negative_reviews['data'],
        }

    def _get(self, sentiment):
        start = (self.page - 1) * self.per_page
        end = self.page * self.per_page
        reviews = models.Review.objects.filter(politician_id=self._id, sentiment=sentiment)
        reviews = reviews.filter(status=REVIEW_APPROVED)
        total_reviews = reviews.count()
        total_pages = math.ceil(total_reviews / self.per_page)
        reviews = reviews.order_by('-up_vote').select_related('user')[start:end]
        return {'data': reviews, 'totalPages': total_pages}


class ReviewsPaginatedType(graphene.ObjectType):
    page = graphene.Int()
    pages = graphene.Int()
    hasMore = graphene.Boolean()
    positive = graphene.List(ReviewType)
    negative = graphene.List(ReviewType)



class MapEntryData(graphene.ObjectType):
    code = graphene.String()
    name = graphene.String()
    value = graphene.Int()


class MapDataType(graphene.ObjectType):
    maxScale = graphene.Int()
    data = graphene.List(MapEntryData)


class MapHelper:

    @staticmethod
    def get_world_data(politician_id):
        reviews = models.Review.objects.filter(politician_id=politician_id, status=REVIEW_APPROVED)
        reviews = tuple(reviews.values_list('country', flat=True))

        total_reviews = len(reviews)
        count = {}
        for country in reviews:
            try:
                count[country] += 1
            except KeyError:
                count[country] = 1

        countries_dict = {short_name: long_name for short_name, long_name in countries}
        data, max_value = [], 0
        for country in count:
            value = round(count[country] / total_reviews * 100, 2)
            entry = MapEntryData(code=country, name=countries_dict[country], value=value)
            data.append(entry)
            if entry.value > max_value:
                max_value = entry.value
        return data, max_value


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
    reviews = graphene.Field(ReviewsPaginatedType, id=graphene.Int(), page=graphene.Int())
    mapdata = graphene.Field(MapDataType, id=graphene.Int(), maptype=graphene.String())

    def resolve_mapdata(self, args, context, info):
        map_type = args['maptype']
        if map_type == 'world':
            map_data, max_value = MapHelper.get_world_data(args['id'])
            return MapDataType(maxScale=max_value, data=map_data)

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
        helper = ReviewPaginationHelper(pid=args['id'], page=args['page'])
        reviews = helper.get_reviews()
        return ReviewsPaginatedType(**reviews)

    def resolve_review(self, args, context, info):
        id = args.get('id')
        return models.Review.objects.get(pk=id)

    @graphene.resolve_only_args
    def resolve_cabinet_members(self):
        return models.Cabinet.objects.all()
