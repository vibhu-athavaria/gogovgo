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


class TagApproveMixin(object):
    """Logic to approved (or activate) related tags when a review is approved"""

    def __init__(self, *args, **kwargs):
        super(TagApproveMixin, self).__init__(*args, **kwargs)
        self._is_approved = self.status == REVIEW_APPROVED

    def save(self, *args, **kwargs):
        if not self._is_approved and self.status == REVIEW_APPROVED:
            self.tags.all().update(active=True)
        return super(TagApproveMixin, self).save(*args, **kwargs)


class Review(TagApproveMixin, TimeStampedModel):
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

