import logging
import os

from django.views.generic import View
from django.http import HttpResponse, JsonResponse
from django.conf import settings

from django_countries import countries
from gogovgo.gogovgo_site.constants import US_STATES


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


class LocationData(View):
    """Returns list of all countries and list of all states in U.S"""

    def get(self, request):
        context = {
            'countries': self._jsonify(countries),
            'states': self._jsonify(US_STATES)
        }
        return JsonResponse(context)

    @staticmethod
    def _jsonify(data):
        _data = []
        for short_name, long_name in data:
            _data.append({'short': short_name, 'long': long_name})
        return _data
