# coding=utf-8

"""This module, views.py, defines server HTTP request responses."""

from django.shortcuts import render

#TEMPLATE_NEXUS_LOCAL = 'templates/nexus_local_front_end/index.html'
TEMPLATE_NEXUS_LOCAL = 'nexus_local_front_end/index.html'

# /source/


def GET_nexus_local(request):
    """Returns the a HTTP response for the nexus local web page."""
    return render(request, TEMPLATE_NEXUS_LOCAL)
