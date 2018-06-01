"""
GraphQL mutation to contact site owner
"""

import graphene
from graphql import GraphQLError

from django.core.exceptions import ValidationError
from django.core.validators import validate_email

from gogovgo.scripts.email import send_email


ADMIN_EMAIL = 'adam@adamtreister.com'


class Validator:
    """Form validation"""

    def validate(self):
        self.validate_name()
        self.validate_email()
        self.validate_message()

    def validate_name(self):
        name = self.data.get('name', '').strip()
        if not name:
            self.errors.append('The name field is required.')
        else:
            self.cleaned_data['name'] = name

    def validate_email(self):
        email = self.data.get('email', '').strip().lower()
        if not email:
            return self.errors.append('The email field is required.')

        try:
            validate_email(email)
        except ValidationError:
            self.errors.append('The email field is invalid.')
        else:
            self.cleaned_data['email'] = email

    def validate_message(self):
        message = self.data.get('message', '').strip()
        if not message:
            self.errors.append('The message field is required.')
        elif len(message) < 10:
            self.errors.append('The message shall be at least 10 characters long.')
        else:
            self.cleaned_data['message'] = message


class Form(Validator):
    """Form to send contact email"""

    def __init__(self, data):
        self.data = data
        self.cleaned_data = {}
        self.errors = []

    def is_valid(self):
        self.validate()
        return not self.errors

    def send_email(self):
        data = self.cleaned_data
        message = '{} ({}) says: \n {}'.format(data['name'], data['email'], data['message'])
        send_email(send_from=data['email'], send_to=ADMIN_EMAIL,
                   subject='DonaldTrumpReviews.com contact message', message=message)


class Contact(graphene.Mutation):
    """GraphQL mutation to contact admin"""

    class Input:
        name = graphene.String()
        email = graphene.String()
        message = graphene.String()

    sent = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @staticmethod
    def mutate(root, args, context, info):
        form = Form(data=args)
        if not form.is_valid():
            return Contact(sent=False, errors=form.errors)
        form.send_email()
        return Contact(sent=True, errors=[])
