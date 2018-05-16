import logging
import os

from django.views.generic import View
from django.http import HttpResponse, JsonResponse
from django.conf import settings

from django_countries import countries

from gogovgo.gogovgo_site.constants import US_STATES, REVIEW_APPROVED
from gogovgo.gogovgo_site.models import Review
from gogovgo.scripts.map import get_map


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
        restrict = request.GET.get('restrict') == 'reviews'
        context = {
            'countries': self._jsonify(countries) if not restrict else self.get_countries(),
            'states': self._jsonify(US_STATES)
        }
        return JsonResponse(context)

    @staticmethod
    def _jsonify(data):
        _data = []
        for short_name, long_name in data:
            _data.append({'short': short_name, 'long': long_name})
        return _data

    @staticmethod
    def get_countries():
        data = [{'short': 'US', 'long': 'United States of America'}]
        countries_dict = {short: long for short, long in countries}
        reviews = Review.objects.filter(status=REVIEW_APPROVED).values_list('country', flat=True)
        reviews = reviews.order_by('country').distinct()
        for country in reviews:
            if country != 'US':
                data.append({'short': country, 'long': countries_dict[country]})
        return data


class MapData(View):

    def get(self, request):
        map_type = str(request.GET.get('q', '').lower())
        mapdata = get_map(map_type)
        return JsonResponse(mapdata)