"""
Django settings for gogovgo project.

Generated by 'django-admin startproject' using Django 1.11.2.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.11/ref/settings/
"""

import os
from gogovgo.settings.base import *

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_DIR = os.path.abspath(os.path.join(BASE_DIR, os.pardir))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '8x$)j$z*&p%+ud8j!h5vg!uwjhv^ly@lk3s9!)_lwe=&3-r%c%'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

<<<<<<< HEAD
ALLOWED_HOSTS = ["35.185.91.223", "gogovgo.com", "www.gogovgo.com"]
=======
ALLOWED_HOSTS = ["35.197.47.146", "rateyourpolitician.com", "www.rateyourpolitician.com", "rateyourpolitician.org", "www.rateyourpolitician.org"]
>>>>>>> Fixing CSS and adding authentication


# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'gogovgo_v1',
        'USER': 'root',
        'PASSWORD': os.environ['DB_PASS'],
        'HOST': 'localhost',
        'PORT': '3306',
    }
}


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.abspath(os.path.join(PROJECT_DIR, os.pardir))
STATIC_ROOT = os.path.join(PROJECT_DIR, 'static/')
STATIC_URL = '/static/'


REACT_APP_DIR = os.path.join(BASE_DIR, 'frontend')

STATICFILES_DIRS = [
    os.path.join(REACT_APP_DIR, 'build', 'static'),
]

CORS_ORIGIN_WHITELIST = (
    'rateyourpolitician.com',
    '127.0.0.1:3000',
    'localhost:3000',
)
