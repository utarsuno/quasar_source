# coding=utf-8

"""This module, views.py, defines server HTTP request responses."""

# Needed to send back a rendered HTML page.
from django.shortcuts import render
# Needed for sending a simple HttpResponse such as a string response.
from django.http import HttpResponse
# Needed for allowing POST requests without requiring a CSRF token.
from django.views.decorators.csrf import csrf_exempt
# Needed to perform HttpRequests to run Locust.
import requests
# Needed for making JsonResponses.
from django.http import JsonResponse


#from quasar_source_code.entities import entity_local_testing
# Ignore the IDE error message.
#from entities import entity_local_testing


# Define all the pages.
_TEMPLATES_BASE         = 'templates/quasar_web_server/'
TEMPLATE_HELLO_WORLD    = _TEMPLATES_BASE + 'hello_world.html'
TEMPLATE_LOG_FORMULAS   = _TEMPLATES_BASE + 'log_formulas.html'
TEMPLATE_QUICK_INFO     = _TEMPLATES_BASE + 'quick_info.html'
TEMPLATE_MATH_220       = _TEMPLATES_BASE + 'math220.html'
TEMPLATE_MATH_310       = _TEMPLATES_BASE + 'math310.html'
TEMPLATE_CS_361         = _TEMPLATES_BASE + 'cs361.html'
TEMPLATE_CS_425         = _TEMPLATES_BASE + 'cs425.html'
TEMPLATE_WEB_SOCKET     = _TEMPLATES_BASE + '/web_socket_server/web_sockets.html'



from quasar_source_code.entities.database import entity_database


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def GET_hello_world(request):
	"""Temporary main page."""
	return render(request, TEMPLATE_HELLO_WORLD)


def GET_log_formulas(request):
	"""Returns the HTML page for log formulas."""
	return render(request, TEMPLATE_LOG_FORMULAS)

'''
def GET_quick_info(request):
	"""Returns a temporary page."""

	entity_manager = entity_local_testing.entity_manager

	return render(request, TEMPLATE_QUICK_INFO, {'time_blocks': entity_manager.print_todays_relevant_information()})
'''


def GET_math_220(request):
	"""Returns notes for diff eq."""
	return render(request, TEMPLATE_MATH_220)


def GET_math_310(request):
	"""Returns notes for math 310."""
	return render(request, TEMPLATE_MATH_310)


def GET_cs_361(request):
	"""Returns notes for cs 361."""
	return render(request, TEMPLATE_CS_361)


def GET_cs_425(request):
	"""Returns notes for cs 425."""
	return render(request, TEMPLATE_CS_425)


def GET_web_socket(request):
	"""TEMP test page."""
	return render(request, TEMPLATE_WEB_SOCKET)
