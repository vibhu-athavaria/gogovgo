# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2018-05-17 09:00
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gogovgo_site', '0012_flaggedreview'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='flaggedreview',
            options={'ordering': ['is_safe', '-counter']},
        ),
        migrations.AddField(
            model_name='review',
            name='county',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='review',
            name='postal_code',
            field=models.CharField(max_length=8, null=True),
        ),
    ]
