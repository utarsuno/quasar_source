# coding=utf-8

"""This module, quasar_web_socket_server.py, provides an abstraction to handling server-side web-socket requests."""

import json
from servers.quasar import quasar_server as qs
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


# TODO : Create constants/abstractions for player world state.
WORLD_LOGIN = 0


class QuasarConnectedClient(object):
	"""Represents a single connected Quasar client."""

	def __init__(self):
		self.logged_in = False
		self._username = None
		self._password = None
		self.current_world = WORLD_LOGIN

	def set_as_logged_in(self, username, password):
		"""Mark this player as logged in."""
		self._username = username
		self._password = password
		self.logged_in = True


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
			return self._reply_to_login_request(r, channel_name)
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
	def _reply_to_create_account_request(self, request, channel_name):
		"""Handles the create account request."""
		username = request[_WEB_SOCKET_REQUEST_KEY_USERNAME]
		password = request[_WEB_SOCKET_REQUEST_KEY_PASSWORD]
		email    = request[_WEB_SOCKET_REQUEST_KEY_EMAIL]
		

	def _reply_to_login_request(self, request, channel_name):
		"""Handles the login request."""
		username = request[_WEB_SOCKET_REQUEST_KEY_USERNAME]
		password = request[_WEB_SOCKET_REQUEST_KEY_PASSWORD]

		result = self._quasar_server.is_valid_login(username, password)
		if us.is_success_message(result):
			# Mark the player as logged in.
			self.players[channel_name].set_as_logged_in(username, password)
			return self._success_reply(request)
		else:
			return self._fail_reply(request)




'''
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
'''
