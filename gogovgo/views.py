import logging
import os

from django.views.generic import View
from django.http import HttpResponse
from django.conf import settings

class FrontendAppView(View):
    """
    Serves the compiled frontend entry point (only works if you have run `yarn
    run build`).
    """

    def get(self, request):
        try:
            with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as f:
                return HttpResponse(f.read())
        except EnvironmentError:
            logging.exception('Production build of app not found')
            with open(os.path.join(settings.REACT_APP_DIR, 'build', '500_error.html')) as f:
                return HttpResponse(f.read(), status=501)
