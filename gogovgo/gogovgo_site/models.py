# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models
from django_extensions.db.models import TimeStampedModel
from cloudinary.models import CloudinaryField

from django_countries.fields import CountryField
from phonenumber_field.modelfields import PhoneNumberField
from gogovgo.gogovgo_site.managers import ReviewManager
from gogovgo.gogovgo_site.constants import (
    GENDER_FEMALE,
    GENDER_MALE,
    GENDER_UNKNOWN,
    OFFICE_TYPE_FEDERAL,
    OFFICE_TYPE_STATE,
    REVIEW_APPROVED,
    REVIEW_PENDING,
    SENTIMENT_POSITIVE,
    SENTIMENT_NEGATIVE,
    SENTIMENT_NEUTRAL,
    US_STATES
)

SENTIMENT_CHOICES = (
    (SENTIMENT_POSITIVE, SENTIMENT_POSITIVE),
    (SENTIMENT_NEGATIVE, SENTIMENT_NEGATIVE),
    (SENTIMENT_NEUTRAL, SENTIMENT_NEUTRAL)
)


class UserProfile(TimeStampedModel):
    GENDER_CHOICES = (
        (GENDER_MALE, GENDER_MALE),
        (GENDER_FEMALE, GENDER_FEMALE),
        (GENDER_UNKNOWN, GENDER_UNKNOWN)
    )
    user = models.OneToOneField(User, unique=True, db_constraint=False)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    gender = models.CharField(choices=GENDER_CHOICES, default=GENDER_UNKNOWN, max_length=16)

    def __str__(self):
        return '%s %s' % (self.first_name, self.last_name)

    class Meta:
        app_label = 'gogovgo_site'


class GovernmentDepartment(TimeStampedModel):
    name = models.CharField(max_length=255)

    def __str__(self):
        return '%s' % self.name


class PublicOfficeTitle(TimeStampedModel):
    OFFICE_TYPE_CHOICES = (
        (OFFICE_TYPE_FEDERAL, OFFICE_TYPE_FEDERAL),
        (OFFICE_TYPE_STATE, OFFICE_TYPE_STATE)
    )

    url = models.SlugField(max_length=100)
    display_name = models.CharField(max_length=255)
    office_type = models.CharField(choices=OFFICE_TYPE_CHOICES,
                                   default=OFFICE_TYPE_FEDERAL, max_length=64)
    department = models.ForeignKey(GovernmentDepartment, on_delete=models.DO_NOTHING)
    city = models.CharField(null=True, blank=True, max_length=255)
    country = CountryField(default='US')

    def __str__(self):
        return '%s' % self.display_name


class Politician(TimeStampedModel):
    country = CountryField(default='US')
    public_office_title = models.ForeignKey(PublicOfficeTitle, on_delete=models.DO_NOTHING)
    first_name = models.CharField(blank=True, max_length=255)
    last_name = models.CharField(blank=True, max_length=255)
    political_party = models.CharField(blank=True, max_length=255)
    approval_rating = models.IntegerField(default=50)
    bio = models.TextField(blank=True)
    job_description = models.TextField(blank=True)
    hero_banner = CloudinaryField("hero_banner", default="")
    avatar = CloudinaryField("avatar")
    website = models.CharField(blank=True, max_length=255)
    phone_number = PhoneNumberField(blank=True)
    mailing_address = models.TextField(blank=True)

    def __str__(self):
        return '%s %s' % (self.first_name, self.last_name)

    @property
    def profile_url(self):
        return self.public_office_title.url

    @property
    def full_name(self):
        return self.first_name + " " + self.last_name


class Cabinet(TimeStampedModel):
    member = models.ForeignKey(Politician, related_name='leader')
    leader = models.ForeignKey(Politician, related_name='staff')

    def __str__(self):
        return '%s - %s' % (
            self.member.first_name + self.member.last_name,
            self.leader.first_name + self.leader.last_name
        )

    class Meta:
        app_label = 'gogovgo_site'


class Poll(TimeStampedModel):
    ACTION_CHOICES = (
        ('approve', 'Approve'),
        ('disapprove', 'Disapprove'),
        ('not_specified', 'Not Specified')
    )
    question = models.TextField()
    action = models.CharField(choices=ACTION_CHOICES, default='not_specified', max_length=128)

    def __str__(self):
        return '%s' % self.question

    class Meta:
        app_label = 'gogovgo_site'


class Tag(TimeStampedModel):
    politician = models.ForeignKey(Politician)
    value = models.CharField(max_length=100)
    weight = models.IntegerField(default=1)
    active = models.BooleanField(default=True)
    sentiment = models.CharField(choices=SENTIMENT_CHOICES,
                                 default=SENTIMENT_NEUTRAL, max_length=64)

    def __str__(self):
        return '%s' % self.value

    class Meta:
        app_label = 'gogovgo_site'
        verbose_name = 'Tag'


class HashTagsMixin(object):
    """
    Functionality to extract hash tags and approved them as review is approved
    """

    def __init__(self, *args, **kwargs):
        super(HashTagsMixin, self).__init__(*args, **kwargs)
        self._is_approved = self.status == REVIEW_APPROVED
        self._body = self.body

    def save(self, *args, **kwargs):
        disable_auto_approve = kwargs.pop('disable_auto_approve', False)

        if not self._is_approved and self.status == REVIEW_APPROVED:
            self.tags.all().update(active=True)
        response = super(HashTagsMixin, self).save(*args, **kwargs)

        approve = not disable_auto_approve and self.status == REVIEW_APPROVED
        self.process_tags(approve=approve)

        return response

    def process_tags(self, approve):
        old_tags = self.get_tags(self._body)
        new_tags = self.get_tags(self.body)
        if old_tags == new_tags:
            return

        tags_added = [tag for tag in new_tags if tag not in old_tags]
        tags_removed = [tag for tag in old_tags if tag not in new_tags]

        if tags_added:
            self.add_tags(tags_added, approve)

        if tags_removed:
            self.remove_tags(tags_removed)

    @staticmethod
    def get_tags(text):
        if not text:
            return []
        text = text.replace('\r\n', ' ').replace('\n', ' ')
        tags = []
        for word in text.split(' '):
            if word.startswith('#'):
                tags.append(word[1:])
        return set(sorted(tags))

    def add_tags(self, tags, approve=False):
        db_tags = Tag.objects.filter(politician=self.politician,
                                     sentiment=self.sentiment,
                                     value__in=tags)
        db_tags = {tag.value: tag for tag in db_tags}

        #   logic to add new tag or increment weight if tag already exists
        for tag in tags:
            t = None
            try:
                t = db_tags[tag]
            except KeyError:
                query = {'politician': self.politician, 'value': tag,
                          'sentiment': self.sentiment, 'active': approve}
                t = Tag.objects.create(**query)
            else:
                t.weight += 1
                t.save()

            self.tags.add(t)

    def remove_tags(self, tags):
        query = {'politician': self.politician, 'sentiment': self.sentiment, 'value__in': tags}
        db_tags = Tag.objects.filter(**query)
        for tag in db_tags:
            tag.weight -= 1
            if tag.weight < 1:
                tag.delete()
            else:
                tag.save()


class Review(HashTagsMixin, TimeStampedModel):
    REVIEW_STATUS_CHOICES = (
        (REVIEW_PENDING, REVIEW_PENDING),
        (REVIEW_APPROVED, REVIEW_APPROVED)
    )

    user = models.ForeignKey(
        User, models.SET_NULL,
        blank=True,
        null=True,
        db_constraint=False
    )
    politician = models.ForeignKey(Politician, db_constraint=False, related_name='reviews')
    sentiment = models.CharField(choices=SENTIMENT_CHOICES,
                                 default=SENTIMENT_NEUTRAL, max_length=64)
    city = models.CharField(null=True, blank=True, max_length=255)
    state = models.CharField(choices=US_STATES, default='CA', max_length=120, null=True)
    country = CountryField(default='US')
    body = models.TextField(null=True)
    tags = models.ManyToManyField(Tag)
    status = models.CharField(choices=REVIEW_STATUS_CHOICES, default=REVIEW_PENDING, max_length=32)
    nlp_sentiment = models.CharField(choices=SENTIMENT_CHOICES,
                                     default=SENTIMENT_NEUTRAL, max_length=64)
    up_vote = models.IntegerField(default=0)
    down_vote = models.IntegerField(default=0)

    objects = ReviewManager()
    all = models.Manager()

    class Meta:
        ordering = ['-created']
        unique_together = ('user', 'politician')
        app_label = 'gogovgo_site'
