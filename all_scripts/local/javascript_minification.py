# coding=utf-8

"""This module, javascript_minification.py, is used for minifying Javascript files."""

# Currently 3rd party used to handle minification.
from jsmin import jsmin

# TODO : All javascript code needs to be changed to utilize semicolons

test_file = '/Users/utarsuno/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/js/custom/quasar_dev.js'

test_file_2 = '/Users/utarsuno/git_repos/quasar_source/quasar_source_code/quasar_site_django/static/js/custom/models/entity_wall.js'

with open(test_file_2) as js_file:
    minified = jsmin(js_file.read())

print(minified)
