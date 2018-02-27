# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from gogovgo.gogovgo_site import models



class ReviewAdmin(admin.ModelAdmin):
    fields = ('politician', 'sentiment', 'city', 'state', 'country', 'body', 'status')
    list_display = ('id', 'user', 'politician', 'sentiment', 'city', 'country', 'status', 'created')

    def get_queryset(self, request):
        return self.model.all.get_queryset().prefetch_related('tags').order_by('id')


class PoliticianAdmin(admin.ModelAdmin):
    save_as = True
    list_display = ('id', 'first_name', 'last_name', 'page_url', 'leader_name')

    def page_url(self, obj):
        return obj.profile_url

    def leader_name(self, obj):
        return obj.leader.first().leader.full_name if obj.leader.first() else ""


admin.site.register(models.Cabinet)
admin.site.register(models.GovernmentDepartment)
admin.site.register(models.Poll)
admin.site.register(models.Politician, PoliticianAdmin)
admin.site.register(models.PublicOfficeTitle)
admin.site.register(models.Tag)
admin.site.register(models.Review, ReviewAdmin)
admin.site.register(models.UserProfile)
