# coding=utf-8

"""This module, views.py, defines server HTTP request responses."""

# Needed to send back a rendered HTML page.
import json

from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from servers.quasar import quasar_server as qs
from django.http import JsonResponse
from entities import base_entity as be
from servers import utility_servers as us
from universal_code import debugging as dbg
import urllib.request

# Define all the pages.
_TEMPLATES_BASE         = 'templates/quasar_web_server/'
TEMPLATE_QUASAR_DEV     = _TEMPLATES_BASE + 'quasar_dev.html'
TEMPLATE_QUASAR_QA      = _TEMPLATES_BASE + 'quasar_qa.html'
TEMPLATE_QUASAR_PROD    = _TEMPLATES_BASE + 'quasar_prod.html'
TEMPLATE_WEB_SOCKET     = _TEMPLATES_BASE + 'web_sockets.html'


# Global server.
quasar_server = qs.QuasarServer()
quasar_server.connect()


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def GET_quasar_dev(request):
    """Returns the Development environment version of Quasar (full debugging enabled, none/less minified files."""
    return render(request, TEMPLATE_QUASAR_DEV)


def GET_quasar_qa(request):
    """Returns the Quality Assurance environment version of Quasar (development on this not start yet)."""
    return render(request, TEMPLATE_QUASAR_QA)


def GET_quasar_prod(request):
    """Returns the Production environment version of Quasar (minified files), future code work features to be added."""
    return render(request, TEMPLATE_QUASAR_PROD)


def GET_web_socket(request):
    """TEMP test page."""
    return render(request, TEMPLATE_WEB_SOCKET)


# everything above is being organized.

'''__        __           ___       __
  |__)  /\  /  ` |__/    |__  |\ | |  \
  |__) /~~\ \__, |  \    |___ | \| |__/ '''

# Server response messages.
SERVER_REPLY_INVALID_POST_DATA_ERROR                = HttpResponse('Invalid POST data!')
SERVER_REPLY_INVALID_NUMBER_OF_POST_ARGUMENTS_ERROR = HttpResponse('Invalid number of POST arguments!')
SERVER_REPLY_GENERIC_NO                             = HttpResponse('n')
SERVER_REPLY_GENERIC_YES                            = HttpResponse('y')
SERVER_REPLY_GENERIC_SERVER_ERROR                   = HttpResponse('Server Error!')

# UNIVERSAL_CONSTANTS_START: Entity POST keys.
ENTITY_POST_SAVE_DATA = 'save_data'
# UNIVERSAL_CONSTANTS_END


def return_based_on_result(result):
    """Returns a HTTPResponse based off the result."""
    if us.is_success_message(result):
        return SERVER_REPLY_GENERIC_YES
    return HttpResponse(result[2:])


def check_POST_arguments(arguments, dictionary):
    """Just a utility function to raise an exception if there is an in-correct match on POST arguments.
    :param arguments: The arguments to check for.
    :param dictionary: Contains information regarding the request sent in.
    :return: Boolean indicating if this threw an exception or not.
    """
    if len(dictionary) != len(arguments):
        print('Got ' + str(len(dictionary)) + ' number of arguments instead of ' + str(len(arguments)))
        for arg in dictionary:
            print(arg)
        print('Arguments excepted were : ' + str(arguments))
        return HttpResponse(SERVER_REPLY_INVALID_NUMBER_OF_POST_ARGUMENTS_ERROR)
    for arg in arguments:
        if arg not in dictionary:
            print('Argument not passed in : ' + str(arg) + '.')
            return HttpResponse(SERVER_REPLY_INVALID_POST_DATA_ERROR)
    return None


# From : https://stackoverflow.com/questions/13349573/how-to-change-a-django-querydict-to-python-dict
def qdict_to_dict(qdict):
    """Convert a Django QueryDict to a Python dict.
    Single-value fields are put in directly, and for multi-value fields, a list
    of all values is stored at the field's key.
    """
    return {k: v[0] if len(v) == 1 else v for k, v in qdict.lists()}

'''___      ___   ___         __             ___  __           __                   __   __   ___  __       ___    __        __
  |__  |\ |  |  |  |  \ /    /  \ |  | |\ | |__  |__)     /\  |  \  |\/| | |\ |    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
  |___ | \|  |  |  |   |     \__/ |/\| | \| |___ |  \    /~~\ |__/  |  | | | \|    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ '''


@csrf_exempt
def POST_sudo_command(request):
    """Handles the POST request for entity owner admin commands."""
    print('POST sudo command')
    json_str = (request.body.decode('utf-8'))
    json_obj = json.loads(json_str)

    post_errors = check_POST_arguments([be.ENTITY_PROPERTY_USERNAME, be.ENTITY_PROPERTY_PASSWORD, us.SERVER_COMMAND_ENTITY_OWNER_SUDO_OPERATION, us.POST_KEY_GENERIC_DATA], json_obj)
    if post_errors is not None:
        return post_errors

    received_username  = json_obj[be.ENTITY_PROPERTY_USERNAME]
    received_password  = json_obj[be.ENTITY_PROPERTY_PASSWORD]
    received_operation = json_obj[us.SERVER_COMMAND_ENTITY_OWNER_SUDO_OPERATION]
    received_data      = json_obj[us.POST_KEY_GENERIC_DATA]

    global quasar_server
    message = quasar_server.is_valid_login(received_username, received_password)
    reply = us.is_success_message(message)
    if reply:
        if received_operation == us.SERVER_COMMAND_SET_ENTITY_OWNER_ACCOUNT_TYPE:
            return return_based_on_result(quasar_server.set_entity_owner_account_type(received_username, received_data))
        elif received_operation == us.SERVER_COMMAND_GET_ALL_ACCOUNTS_INFORMATION:
            return HttpResponse(quasar_server.get_all_accounts_information())
        else:
            dbg.raise_exception('Invalid command received!')
    else:
        return return_based_on_result(message)


'''___      ___   ___         __             ___  __      __   __   ___  __       ___    __        __
  |__  |\ |  |  |  |  \ /    /  \ |  | |\ | |__  |__)    /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`
  |___ | \|  |  |  |   |     \__/ |/\| | \| |___ |  \    \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/ '''


@csrf_exempt
def POST_server_load_image(request):
    """Handles the POST request for having the server load an image."""
    print('POST_server_load_image')
    json_str = (request.body.decode('utf-8'))
    json_obj = json.loads(json_str)

    post_errors = check_POST_arguments(['image_url'], json_obj)
    if post_errors is not None:
        return post_errors

    received_image_url = json_obj['image_url']

    # TODO : Add safety checks against the URL sent in!!

    urllib.request.urlretrieve(received_image_url, 'dynamically_loaded_images' 'test_image.png')


@csrf_exempt
def POST_login(request):
    """Handles the POST request for logging in."""
    print('POST_login')
    json_str = (request.body.decode('utf-8'))
    json_obj = json.loads(json_str)

    post_errors = check_POST_arguments([be.ENTITY_PROPERTY_USERNAME, be.ENTITY_PROPERTY_PASSWORD], json_obj)
    if post_errors is not None:
        return post_errors

    received_username = json_obj[be.ENTITY_PROPERTY_USERNAME]
    received_password = json_obj[be.ENTITY_PROPERTY_PASSWORD]

    global quasar_server
    result = quasar_server.is_valid_login(received_username, received_password)
    if us.is_success_message(result):
        request.session[be.ENTITY_PROPERTY_USERNAME] = received_username
        return SERVER_REPLY_GENERIC_YES
    else:
        return HttpResponse(result[2:])
    return return_based_on_result(quasar_server.is_valid_login(received_username, received_password))


@csrf_exempt
def POST_create_owner(request):
    """Handles the POST request for creating a owner."""
    print('POST_create_owner')
    json_str = (request.body.decode('utf-8'))
    json_obj = json.loads(json_str)

    post_errors = check_POST_arguments([be.ENTITY_PROPERTY_USERNAME, be.ENTITY_PROPERTY_PASSWORD, be.ENTITY_PROPERTY_EMAIL], json_obj)
    if post_errors is not None:
        return post_errors

    received_owner_name = json_obj[be.ENTITY_PROPERTY_USERNAME]
    received_owner_email = json_obj[be.ENTITY_PROPERTY_EMAIL]
    received_owner_password = json_obj[be.ENTITY_PROPERTY_PASSWORD]

    global quasar_server
    owner_data = {be.ENTITY_PROPERTY_USERNAME: received_owner_name,
                  be.ENTITY_PROPERTY_EMAIL: received_owner_email,
                  be.ENTITY_PROPERTY_PASSWORD: received_owner_password}

    return return_based_on_result(quasar_server.create_entity_owner(owner_data))


@csrf_exempt
def POST_delete_entity(request):
    """Handles the POST request to delete an entity."""
    print('POST_delete_entity')
    json_str = (request.body.decode('utf-8'))
    json_obj = json.loads(json_str)

    post_errors = check_POST_arguments([be.ENTITY_PROPERTY_USERNAME, be.ENTITY_PROPERTY_PASSWORD, be.ENTITY_DEFAULT_PROPERTY_RELATIVE_ID], json_obj)
    if post_errors is not None:
        return post_errors

    received_username  = json_obj[be.ENTITY_PROPERTY_USERNAME]
    received_password  = json_obj[be.ENTITY_PROPERTY_PASSWORD]
    received_entity_id = json_obj[be.ENTITY_DEFAULT_PROPERTY_RELATIVE_ID]

    global quasar_server
    message = quasar_server.is_valid_login(received_username, received_password)
    reply = us.is_success_message(message)
    if reply:
        return return_based_on_result(quasar_server.delete_entity(received_username, received_entity_id))
    else:
        return return_based_on_result(message)


@csrf_exempt
def POST_save_entity(request):
    """Handles the POST request to save changed entities."""
    print('POST_save_entity')
    json_str = (request.body.decode('utf-8'))
    json_obj = json.loads(json_str)

    post_errors = check_POST_arguments([be.ENTITY_PROPERTY_USERNAME, be.ENTITY_PROPERTY_PASSWORD, ENTITY_POST_SAVE_DATA], json_obj)
    if post_errors is not None:
        return post_errors

    received_username = json_obj[be.ENTITY_PROPERTY_USERNAME]
    received_password = json_obj[be.ENTITY_PROPERTY_PASSWORD]
    received_data     = json_obj[ENTITY_POST_SAVE_DATA]

    #print('Need to save the following data:')
    #print(received_data)

    data_dictionary = eval(received_data)

    global quasar_server
    message = quasar_server.is_valid_login(received_username, received_password)
    reply = us.is_success_message(message)
    if reply:
        return return_based_on_result(quasar_server.update_entity(received_username, data_dictionary))
    else:
        return return_based_on_result(message)


# TODO : DELETE THIS!
@csrf_exempt
def POST_get_user_entities(request):
    """Handles the POST request to load all entities."""
    print('POST_get_user_entities')
    json_str = (request.body.decode('utf-8'))
    json_obj = json.loads(json_str)

    post_errors = check_POST_arguments([be.ENTITY_PROPERTY_USERNAME, be.ENTITY_PROPERTY_PASSWORD], json_obj)
    if post_errors is not None:
        return post_errors

    global quasar_server

    message = quasar_server.is_valid_login(json_obj[be.ENTITY_PROPERTY_USERNAME], json_obj[be.ENTITY_PROPERTY_PASSWORD])
    reply = us.is_success_message(message)
    if reply:
        data_to_return = quasar_server.get_owner_entities(json_obj[be.ENTITY_PROPERTY_USERNAME])
        return JsonResponse(data_to_return, safe=False)
    return HttpResponse(message)
