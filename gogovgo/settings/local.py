from gogovgo.settings.base import *


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'gogovgo_v1',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

CORS_ORIGIN_WHITELIST = (
    '127.0.0.1:3000',
    'localhost:3000',
)

IMAGEFIT_CACHE_ENABLED = True