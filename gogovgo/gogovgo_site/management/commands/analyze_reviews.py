from collections import Counter
from django.core.management.base import BaseCommand

from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
from google.cloud.proto.language.v1.language_service_pb2 import AnnotateTextRequest

from gogovgo.gogovgo_site.constants import (
    REVIEW_APPROVED,
    REVIEW_PENDING,
    SENTIMENT_POSITIVE,
    SENTIMENT_NEGATIVE,
    SENTIMENT_NEUTRAL
)
from gogovgo.gogovgo_site.models import Review, ReviewHasReasonTag, ReasonTag


class Command(BaseCommand):
    help = 'Parses user input reviews using google natural language APIs'

    def handle(self, *args, **options):
        pending_reviews = Review.all.filter(status=REVIEW_PENDING)
        for review in pending_reviews:
            sentiment_score, keywords = self.analyze(review.body)

            if sentiment_score > 0:
                review.nlp_sentiment = SENTIMENT_POSITIVE
            elif sentiment_score < 0:
                review.nlp_sentiment = SENTIMENT_NEGATIVE
            else:
                review.nlp_sentiment = SENTIMENT_NEUTRAL

            review.status = REVIEW_APPROVED
            review.save(update_fields=['nlp_sentiment', 'status'])

            # Now add tags
            for keyword in keywords:
                tag, created = ReasonTag.objects.get_or_create(value=keyword)
                if not created:
                    tag.weight += 0.5
                    tag.save()
                ReviewHasReasonTag.objects.create(review=review, reason_tag=tag)

    def get_tags(self, token_iter):
        # print("--Keywords---")
        keywords = []
        tags = []
        store_next = False

        for token in token_iter:
            # print("----------------###########----------------")
            # print("Token: {}".format(token))
            if token.dependency_edge.label == enums.DependencyEdge.Label.AMOD:
                keywords.append(token.lemma)
                store_next = True
            elif store_next:
                keywords.append(token.lemma)
                store_next = False
                tags.append(' '.join(keywords))
                keywords = []

        return tags

    def analyze(self, text):
        """Run a sentiment analysis request on text within a passed filename."""
        client = language.LanguageServiceClient()

        features = AnnotateTextRequest.Features(
            extract_syntax=True,
            extract_entities=True,
            extract_document_sentiment=True,
        )

        document = types.Document(
            content=text,
            type=enums.Document.Type.PLAIN_TEXT)
        annotations = client.annotate_text(document=document, features=features)

        # print("---Analyzing---")
        # print(text)

        # print("----Annotations-----")
        # print(annotations)

        # print("--Sentiment Score---")
        # print(annotations.document_sentiment.score)

        tags = self.get_tags(annotations.tokens)
        print("Chosen Tags: {}".format(tags))
        # print("Most common tags: {}".format(tags))

        return (
            annotations.document_sentiment.score,
            tags
        )
