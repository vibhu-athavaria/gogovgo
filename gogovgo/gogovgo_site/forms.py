from django.forms import ModelForm
from cloudinary.forms import CloudinaryJsFileField
from .models import Politician


class PoliticianForm(ModelForm):
    class Meta:
        model = Politician
        fields = ["country", "public_office_title", "first_name", "last_name", "political_party",
        "approval_rating", "bio", "avatar", "website", "phone_number", "mailing_address"]
    avatar = CloudinaryJsFileField()
