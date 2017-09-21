from django.db import models


class ReviewManager(models.Manager):
    def get_queryset(self):
        return super(ReviewManager, self).get_queryset().prefetch_related('tags')

