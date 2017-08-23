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


# Define all the pages.
_TEMPLATES_BASE      = 'templates/quasar_web_server/'
TEMPLATE_HELLO_WORLD = _TEMPLATES_BASE + 'hello_world.html'


from .models import Message


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


@csrf_exempt
def message_POST(request):
	"""This handles the POST request to send a recovery email.
	:param request: Contains information regarding the request sent in.
	:return: The HttpResponse. Just a server_reply_response_string.
	"""
	print(request.POST['message'])
	received_message = request.POST['message']
	print('Got the message : ' + str(received_message))
	received_ip    = get_client_ip(request)
	message        = Message(message=received_message, ip=received_ip)
	message.save()


@csrf_exempt
def get_all_messages(request):
	messages = Message.objects.all()
	m = {}
	for rm in messages:
		m[rm.ip] = rm.message
	return JsonResponse(m)

