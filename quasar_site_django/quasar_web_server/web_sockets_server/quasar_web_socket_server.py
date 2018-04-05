# coding=utf-8

"""This module, quasar_web_socket_server.py, provides an abstraction to handling server-side web-socket requests."""

import json
from servers.quasar.quasar_server import quasar_server as qs
from servers import utility_servers as us


# Client request keys.
_WEB_SOCKET_REQUEST_KEY_REQUEST_TYPE = 'r'
_WEB_SOCKET_REQUEST_KEY_MESSAGE_ID   = 'm'
_WEB_SOCKET_REQUEST_KEY_USERNAME     = 'u'
_WEB_SOCKET_REQUEST_KEY_PASSWORD     = 'p'
_WEB_SOCKET_REQUEST_KEY_EMAIL        = 'e'

# Server response keys.
_WEB_SOCKET_RESPONSE_KEY_MESSAGE_ID  = 'm'
_WEB_SOCKET_RESPONSE_KEY_SUCCESS     = 's'

# Client request values.
_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOGIN          = 1
_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_CREATE_ACCOUNT = 2

# Server response values.
_WEB_SOCKET_RESPONSE_VALUE_SUCCESS_TRUE  = 0
_WEB_SOCKET_RESPONSE_VALUE_SUCCESS_FALSE = 1

'''
from servers.quasar import quasar_server as qs
quasar_server = qs.QuasarServer()
quasar_server.connect()
v.set_quasar_server_instance(quasar_server)
'''



class QuasarConnectedClient(object):
	"""Represents a single connected Quasar client."""

	def __init__(self):
		self.logged_in = False

	def handle_request(self, request):
		"""Handles a request."""
		y = 2
		# TODO : !!!


class QuasarWebSocketsServerSide(object):
	"""Handles web socket server side requests."""

	def __init__(self):
		self._quasar_server = qs.QuasarServer()
		self._quasar_server.connect()

		self.players = {}

	def add_connection(self, channel_name):
		"""Adds a new connection."""
		self.players[channel_name] = QuasarConnectedClient()

	def remove_connection(self, channel_name):
		"""Removes a connection."""
		del self.players[channel_name]

	def get_reply(self, channel_name, request):
		"""Handles a client request."""
		r = json.loads(request)
		request_type = r[_WEB_SOCKET_REQUEST_KEY_REQUEST_TYPE]

		if request_type == _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOGIN:
			return self._reply_to_login_request(r)
		else:
			return self._fail_reply(r)

	def _success_reply(self, request):
		"""Returns a success reply."""
		message_id = request[_WEB_SOCKET_REQUEST_KEY_MESSAGE_ID]
		return {_WEB_SOCKET_RESPONSE_KEY_MESSAGE_ID: message_id,
		        _WEB_SOCKET_RESPONSE_KEY_SUCCESS   : _WEB_SOCKET_RESPONSE_VALUE_SUCCESS_TRUE}

	def _fail_reply(self, request):
		"""Returns a failed reply."""
		message_id = request[_WEB_SOCKET_REQUEST_KEY_MESSAGE_ID]
		return {_WEB_SOCKET_RESPONSE_KEY_MESSAGE_ID: message_id,
		        _WEB_SOCKET_RESPONSE_KEY_SUCCESS   : _WEB_SOCKET_RESPONSE_VALUE_SUCCESS_FALSE}

	# Specific request handling.
	def _reply_to_login_request(self, request):
		"""Handles the login request."""
		username = request[_WEB_SOCKET_REQUEST_KEY_USERNAME]
		password = request[_WEB_SOCKET_REQUEST_KEY_PASSWORD]

		result = self._quasar_server.is_valid_login(username, password)
		if us.is_success_message(result):
			return self._success_reply(request)
		else:
			return self._fail_reply(request)

'''
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

'''