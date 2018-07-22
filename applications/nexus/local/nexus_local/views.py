# coding=utf-8

"""This module, views.py, defines server HTTP request responses."""

from django.shortcuts import render

TEMPLATE_NEXUS_LOCAL = '/assets/nl.min.html'


def GET_nexus_local(request):
    """Returns the a HTTP response for the nexus local web page."""
    return render(request, TEMPLATE_NEXUS_LOCAL)






