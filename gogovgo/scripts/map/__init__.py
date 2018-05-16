import os
import json
from django.conf import settings

def get_map(country, state=None):
    if not state:
        file_name = '{}.json'.format(country)
    base_path = __file__.replace('__init__.py', '')
    file_path = os.path.join(base_path, 'data', file_name)
    with open(file_path, 'r') as file:
        data = file.read()
    data = json.loads(data)
    return data
