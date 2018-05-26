from django.core.management.base import BaseCommand
from gogovgo.gogovgo_site.models import Review, Tag, TagWeight


class Command(BaseCommand):
    help = 'One time command to add re-extract tags from reviews'

    def handle(self, *args, **options):
        Tag.objects.all().delete()
        TagWeight.objects.all().delete()
        reviews = Review.objects.all()
        for review in reviews:
            review._body = ''
            review.save()
