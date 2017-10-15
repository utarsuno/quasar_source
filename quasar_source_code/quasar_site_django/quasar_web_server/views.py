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
from quasar_source_code.entities.server_side import entity_server as es


# Define all the pages.
_TEMPLATES_BASE         = 'templates/quasar_web_server/'
TEMPLATE_QUASAR_DEV     = _TEMPLATES_BASE + 'quasar_dev.html'
TEMPLATE_LOG_FORMULAS   = _TEMPLATES_BASE + 'log_formulas.html'
TEMPLATE_MATH_220       = _TEMPLATES_BASE + 'math220.html'
TEMPLATE_MATH_310       = _TEMPLATES_BASE + 'math310.html'
TEMPLATE_CS_425         = _TEMPLATES_BASE + 'cs425.html'
TEMPLATE_WEB_SOCKET     = _TEMPLATES_BASE + '/web_socket_server/web_sockets.html'


# Global server.
entity_server = es.EntityServer()


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def GET_quasar_dev(request):
    """Temporary main page."""
    return render(request, TEMPLATE_QUASAR_DEV)


def GET_log_formulas(request):
	"""Returns the HTML page for log formulas."""
	return render(request, TEMPLATE_LOG_FORMULAS)


def GET_web_socket(request):
	"""TEMP test page."""
	return render(request, TEMPLATE_WEB_SOCKET)


# everything above is being organized.

'''  __        __           ___       __
	|__)  /\  /  ` |__/    |__  |\ | |  \
	|__) /~~\ \__, |  \    |___ | \| |__/
'''

# Server response messages.
SERVER_REPLY_INVALID_POST_DATA_ERROR                = HttpResponse('Invalid POST data!')
SERVER_REPLY_INVALID_NUMBER_OF_POST_ARGUMENTS_ERROR = HttpResponse('Invalid number of POST arguments!')
SERVER_REPLY_GENERIC_NO                             = HttpResponse('n')
SERVER_REPLY_GENERIC_YES                            = HttpResponse('y')
SERVER_REPLY_GENERIC_SERVER_ERROR                   = HttpResponse('Server Error!')

# Server utility variables.
USERNAME = 'username'
SAVE_DATA = 'save_data'


def check_POST_arguments(arguments, request):
	"""Just a utility function to raise an exception if there is an in-correct match on POST arguments.
	:param arguments: The arguments to check for.
	:param request: Contains information regarding the request sent in.
	:return: Boolean indicating if this threw an exception or not.
	"""
	if len(request.POST) != len(arguments):
		print('Got ' + str(len(request.POST)) + ' number of arguments instead of ' + str(len(arguments)))
		print('They were :')
		for arg in request.POST:
			print(arg)
		return HttpResponse(SERVER_REPLY_INVALID_NUMBER_OF_POST_ARGUMENTS_ERROR)
	for arg in arguments:
		if arg not in request.POST:
			print('Argument not passed in : ' + str(arg) + '.')
			return HttpResponse(SERVER_REPLY_INVALID_POST_DATA_ERROR)
	return None


# Create owner fields.
OWNER_NAME       = 'owner'
OWNER_PASSWORD   = 'password'
OWNER_EMAIL      = 'email'
OWNER_ID         = 'owner_id'
OWNER_MANAGER_ID = 'manager_id'


@csrf_exempt
def POST_login(request):
	"""Handles the POST request for logging in."""
	print('GOT THE DATA ' + str(request))

	if check_POST_arguments([USERNAME, OWNER_PASSWORD], request) is not None:
		return check_POST_arguments([USERNAME, OWNER_PASSWORD], request)

	received_username = request.POST[USERNAME]
	received_password = request.POST[OWNER_PASSWORD]

	# TODO : ADD SERVER SIDE CHECK SO THESE PARAMETERS!!!! (currently its only client side)

	print('USERNAME LOGIN : ' + received_username)

	global entity_server
	result = entity_server.is_valid_login_info(received_username, received_password)
	if result == SERVER_REPLY_GENERIC_YES:
		request.session[USERNAME] = received_username
		return SERVER_REPLY_GENERIC_YES
	return HttpResponse(result)


@csrf_exempt
def POST_create_owner(request):
	"""Handles the POST request for creating a owner."""
	if check_POST_arguments([OWNER_NAME, OWNER_PASSWORD, OWNER_EMAIL], request) is not None:
		return check_POST_arguments([OWNER_NAME, OWNER_ID, OWNER_MANAGER_ID], request)

	received_owner_name = request.POST[OWNER_NAME]
	received_owner_email = request.POST[OWNER_EMAIL]
	received_owner_password = request.POST[OWNER_PASSWORD]

	# TODO : ADD SERVER SIDE CHECKS TO THESE PARAMETERS!!! (currently its only client side)

	print('Creating account : ' + received_owner_name)
	global entity_server
	return entity_server.create_owner(received_owner_name, received_owner_email, received_owner_password)


@csrf_exempt
def POST_save_entities(request):
	"""Handles the POST request to save changed entities."""
	print('GOT THE DATA ' + str(request.POST))

	if check_POST_arguments([USERNAME, OWNER_PASSWORD, SAVE_DATA], request) is not None:
		return check_POST_arguments([USERNAME, OWNER_PASSWORD, SAVE_DATA], request)

	received_username = request.POST[USERNAME]
	received_password = request.POST[OWNER_PASSWORD]
	received_data     = request.POST[SAVE_DATA]

	print('GOT THE DATA ' + str(request.POST))

	global entity_server
	result = entity_server.is_valid_login_info(received_username, received_password)
	if result == SERVER_REPLY_GENERIC_YES:
		# Now save the entities since the username and password is verified.
		y = 2
		print('NEED TO SAVE ENTITIES FOR : ' + str(received_username) + ' THE DATA IS : ' + str(received_data))



		return SERVER_REPLY_GENERIC_YES
	return HttpResponse(result)


@csrf_exempt
def POST_load_entity_manager(request):
	"""Handles the POST request to server memory load an entity manager."""
	if check_POST_arguments([USERNAME], request) is not None:
		return check_POST_arguments([USERNAME], request)
	print('Trying to load entity manager for : ' + request.POST[USERNAME])
	global entity_server
	return entity_server.load_entity_manager(request.POST[USERNAME])


@csrf_exempt
def POST_load_all_entities(request):
	"""Handles the POST request to load all entities."""
	if check_POST_arguments([USERNAME, OWNER_PASSWORD], request) is not None:
		return check_POST_arguments([USERNAME, OWNER_PASSWORD], request)
	print('Loading all entities for : ' + request.POST[USERNAME])
	global entity_server
	return entity_server.load_all_entities(request.POST[USERNAME], request.POST[OWNER_PASSWORD])


@csrf_exempt
def POST_get_entities_for_day(request):
	"""Handles the POST request to get entities for a given day of a given owner."""
	if check_POST_arguments(['day', USERNAME], request) is not None:
		return check_POST_arguments(['day', USERNAME], request)
	global entity_server
	return entity_server.get_entities_for_day(request.POST['day'], request.POST[USERNAME])
