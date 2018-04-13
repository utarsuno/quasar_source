# coding=utf-8

"""This module, quasar_web_socket_server.py, provides an abstraction to handling server-side web-socket requests."""

import json
from servers.quasar import quasar_server as qs
from servers import utility_servers as us
from entities import base_entity as be

# Client request keys.
_WEB_SOCKET_REQUEST_KEY_REQUEST_TYPE = 'r'
_WEB_SOCKET_REQUEST_KEY_MESSAGE_ID   = 'm'
_WEB_SOCKET_REQUEST_KEY_USERNAME     = 'u'
_WEB_SOCKET_REQUEST_KEY_PASSWORD     = 'p'
_WEB_SOCKET_REQUEST_KEY_EMAIL        = 'e'

# Server response keys.
_WEB_SOCKET_RESPONSE_KEY_MESSAGE_ID  = 'm'
_WEB_SOCKET_RESPONSE_KEY_SUCCESS     = 's'
_WEB_SOCKET_RESPONSE_KEY_DATA        = 'd'

# Client request values.
_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOGIN          = 1
_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_CREATE_ACCOUNT = 2
_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOAD_USER_DATA = 3

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
		self.current_world = WORLD_LOGIN

	def set_as_logged_in(self, username):
		"""Mark this player as logged in."""
		self._username = username
		self.logged_in = True

	def set_as_logged_out(self):
		"""Mark this player as logged out."""
		self._username = None
		self.logged_in = False

	@property
	def username(self):
		"""Returns the current username."""
		return str(self._username)


class QuasarWebSocketsServerSide(object):
	"""Handles web socket server side requests."""

	def __init__(self):
		self._quasar_server = qs.QuasarServer()
		self._quasar_server.connect()

		self.players = {}

		# Define all the request types.
		self._request_types = {_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOGIN         : self._reply_to_login_request,
		                       _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_CREATE_ACCOUNT: self._reply_to_create_account_request,
		                       _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOAD_USER_DATA: self._reply_to_load_user_data_request}

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

		if request_type in self._request_types:
			return self._request_types[request_type](r, channel_name)
		else:
			return self._send_reply(r, False, 'Invalid request type!')

	# Utility functions.
	def _is_user_already_logged_in(self, username):
		"""Checks if the user is already logged in."""
		for p in self.players:
			if p.username == username:
				return True
		return False

	# Specific request handling.

	# TODO : Save request!!!

	def _reply_to_logout_request(self, request, channel_name):
		"""Handles the log out request."""
		username = request[_WEB_SOCKET_REQUEST_KEY_USERNAME]
		self.players[channel_name].set_as_logged_out()
		return self._send_reply(request, True, 'logged out!')

	def _reply_to_load_user_data_request(self, request, channel_name):
		"""Handles the load user data request."""
		username = request[_WEB_SOCKET_REQUEST_KEY_USERNAME]
		data_to_return = self._quasar_server.get_owner_entities(username)
		return self._send_reply(request, True, data_to_return)

	def _reply_to_create_account_request(self, request, channel_name):
		"""Handles the create account request."""

		# TODO : Get proper response for if username is already taken

		username = request[_WEB_SOCKET_REQUEST_KEY_USERNAME]
		password = request[_WEB_SOCKET_REQUEST_KEY_PASSWORD]
		email    = request[_WEB_SOCKET_REQUEST_KEY_EMAIL]

		owner_data = {be.ENTITY_PROPERTY_USERNAME: username,
		              be.ENTITY_PROPERTY_EMAIL   : email,
		              be.ENTITY_PROPERTY_PASSWORD: password}

		result = self._quasar_server.create_entity_owner(owner_data)
		if us.is_success_message(result):
			# Mark the player as logged in.
			self.players[channel_name].set_as_logged_in(username)
			return self._send_reply(request, True)
		else:
			return self._send_reply(request, False)

	def _reply_to_login_request(self, request, channel_name):
		"""Handles the login request."""

		# TODO : Get proper response for if username is already logged in.

		username = request[_WEB_SOCKET_REQUEST_KEY_USERNAME]
		password = request[_WEB_SOCKET_REQUEST_KEY_PASSWORD]

		# Check if the username is already logged in.
		if self._is_user_already_logged_in(username):
			return self._send_reply(request, False, 'User is already logged in!')

		result = self._quasar_server.is_valid_login(username, password)
		if us.is_success_message(result):
			# Mark the player as logged in.
			self.players[channel_name].set_as_logged_in(username)
			return self._send_reply(request, True)
		else:
			return self._send_reply(request, False, 'Invalid username or password!')

	'''__   ___       __          __      __   ___  __          ___  __
	  /__` |__  |\ | |  \ | |\ | / _`    |__) |__  |__) |    | |__  /__`
	  .__/ |___ | \| |__/ | | \| \__>    |  \ |___ |    |___ | |___ .__/ '''
	def _send_reply(self, request, success, message=None):
		"""Sends the specified reply."""
		message_id = request[_WEB_SOCKET_REQUEST_KEY_MESSAGE_ID]
		if success:
			s = _WEB_SOCKET_RESPONSE_VALUE_SUCCESS_TRUE
		else:
			s = _WEB_SOCKET_RESPONSE_VALUE_SUCCESS_FALSE
		if message is None:
			return {_WEB_SOCKET_RESPONSE_KEY_MESSAGE_ID: message_id,
			        _WEB_SOCKET_RESPONSE_KEY_SUCCESS   : s}
		else:
			return {_WEB_SOCKET_RESPONSE_KEY_MESSAGE_ID: message_id,
			        _WEB_SOCKET_RESPONSE_KEY_SUCCESS   : s,
			        _WEB_SOCKET_RESPONSE_KEY_DATA      : message}


'''

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


'''

