import graphene
from graphene_django.converter import convert_django_field
from phonenumber_field.modelfields import PhoneNumberField


@convert_django_field.register(PhoneNumberField)
def convert_phone_number_to_string(field, registry=None):
    return graphene.String(description=field.help_text, required=not field.null)

import gogovgo_site.schema


class Query(gogovgo_site.schema.Query, graphene.ObjectType):
    # This class will inherit from multiple Queries
    # as we begin to add more apps to our project
    pass


class Mutations(gogovgo_site.schema.Mutations, graphene.ObjectType):
     pass

schema = graphene.Schema(query=Query, mutation=gogovgo_site.schema.Mutations)


