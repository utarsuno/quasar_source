# coding=utf-8

"""This module, quasar_web_socket_server.py, provides an abstraction to handling server-side web-socket requests."""

import json


_WEB_SOCKET_REQUEST_KEY_REQUEST_TYPE = 'r'
_WEB_SOCKET_MESSAGE_ID               = 'm'
_WEB_SOCKET_REQUEST_KEY_USERNAME     = 'u'
_WEB_SOCKET_REQUEST_KEY_PASSWORD     = 'p'
_WEB_SOCKET_REQUEST_KEY_EMAIL        = 'e'

_WEB_SOCKET_REQUEST_LOGIN          = 1
_WEB_SOCKET_REQUEST_CREATE_ACCOUNT = 2


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
		self.players = {}

	def add_connection(self, channel_name):
		"""Adds a new connection."""
		self.players[channel_name] = QuasarConnectedClient()

	def remove_connection(self, channel_name):
		"""Removes a connection."""
		del self.players[channel_name]

	def get_reply(self, channel_name, request):
		"""Handles a client request."""
		print('The response is:')
		r = json.loads(request)
		print(r)
		print(type(r))

		return {'message': 'HALLLLLLOOO?????'}



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