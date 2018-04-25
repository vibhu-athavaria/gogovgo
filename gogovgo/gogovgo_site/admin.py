# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from gogovgo.gogovgo_site import models



class ReviewAdmin(admin.ModelAdmin):
    fields = ('politician', 'sentiment', 'city', 'state', 'country', 'body', 'up_vote', 'status')
    list_display = ('id', 'user', 'politician', 'sentiment', 'city', 'country', 'up_vote',
                    'status', 'created')

    def get_queryset(self, request):
        return self.model.all.get_queryset().prefetch_related('tags').order_by('id')


class PoliticianAdmin(admin.ModelAdmin):
    save_as = True
    list_display = ('id', 'first_name', 'last_name', 'page_url', 'leader_name')

    def page_url(self, obj):
        return obj.profile_url

    def leader_name(self, obj):
        return obj.leader.first().leader.full_name if obj.leader.first() else ""


class FlaggedReviewAdmin(admin.ModelAdmin):
    list_display = ('review', 'counter', 'is_safe')
    fields = ('review', 'counter', 'is_safe', 'links')
    readonly_fields = ('links',)

    def links(self, obj):
        if obj.is_safe:
            return
        base_url = '/admin/gogovgo_site/review/{}/'.format(obj.review_id)
        link = '<a href="{}" target="_blank">See review</a>'.format(base_url)
        return link

    links.allow_tags = True


admin.site.register(models.Cabinet)
admin.site.register(models.GovernmentDepartment)
admin.site.register(models.Poll)
admin.site.register(models.Politician, PoliticianAdmin)
admin.site.register(models.PublicOfficeTitle)
admin.site.register(models.Tag)
admin.site.register(models.Review, ReviewAdmin)
admin.site.register(models.FlaggedReview, FlaggedReviewAdmin)
admin.site.register(models.UserProfile)
