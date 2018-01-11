# coding=utf-8

"""This module, utility_server_host.py, provides an abstraction to running a mini server."""

import zmq
import time
from universal_code import output_coloring as oc
'''
from universal_code import path_manager as pm
from universal_code import useful_file_operations as ufo

from entities.database.entity_database import EntityDatabaseAPI
from entities import base_entity as be

from entities.server import entity_server as es
'''

# HTTP variables.
HTTP_SUCCESS = 200

# Utility variables.
ADDRESS = 'address'
PORT    = 'port'

# Pre-defined utility servers.
SERVER_ENTITY  = 'zmq_entity'
SERVER_FINANCE = 'zmq_finance'
SERVER_QUASAR  = 'zmq_quasar'


SUCCESS_MESSAGE = 's:'
ERROR_MESSAGE   = 'e:'

SERVER_COMMAND_REQUEST_ALL_DATA           = 'rad'
SERVER_COMMAND_CREATE_ENTITY_OWNER        = 'ceo'
SERVER_COMMAND_IS_USERNAME_TAKEN          = 'ist'
SERVER_COMMAND_IS_LOGIN_INFORMATION_VALID = 'ilv'
SERVER_COMMAND_DELETE_ENTITY_OWNER        = 'deo'
SERVER_COMMAND_GET_OWNER_ENTITIES         = 'goe'
SERVER_COMMAND_UPDATE_ENTITY              = 'ue'
SERVER_COMMAND_DELETE_ENTITY              = 'de'

# POST keys.
POST_KEY_GENERIC_DATA = 'generic_data_key'

# Django commands.
SERVER_COMMAND_ENTITY_OWNER_SUDO_OPERATION   = 'eoo'
SERVER_COMMAND_SET_ENTITY_OWNER_ACCOUNT_TYPE = 'seoat'


# Code from https://stackoverflow.com/questions/7585435/best-way-to-convert-string-to-bytes-in-python-3
def to_bytes(arg):
	"""Utility function."""
	if isinstance(arg, bool):
		arg = str(arg)
	if isinstance(arg, str):
		return arg.encode()
	return arg


def to_str(arg):
	"""Utility function."""
	if isinstance(arg, bytes):
		return arg.decode()
	return arg


def log(l):
		"""Logs the message l."""
		print(l, flush=True)


def is_error_message(m) -> bool:
	"""Returns True if the message provided is an error message (False otherwise)."""
	return m.startswith(ERROR_MESSAGE)


def is_success_message(m) -> bool:
	"""Returns True if the message provided is a success message (False otherwise)."""
	return m.startswith(SUCCESS_MESSAGE)


def error(m):
	"""Utility function for returning error messages."""
	if not str(m).startswith(ERROR_MESSAGE):
		return ERROR_MESSAGE + ':' + str(m)
	return str(m)


def success(m):
	"""Utility function for returning success messages."""
	if not str(m).startswith(SUCCESS_MESSAGE):
		return SUCCESS_MESSAGE + ':' + str(m)
	return str(m)


# TODO : Make server utility functions for creating commands + messages, as well as functions for parsing data from messages


class ZMQBase(object):
	"""Defines the common networking variables."""

	def __init__(self, name, ip, port):
		self._name    = name
		self._ip      = ip
		self._port    = port
		self._context = None
		self._socket  = None

	def _initialize_zmq_variables(self):
		"""Initializes the ZMQ specific variables."""
		self._context = zmq.Context()
		self._socket = self._context.socket(zmq.PAIR)


class HostServer(ZMQBase):
	"""Represents a single unique host server."""

	def __init__(self, name, ip, port):
		super().__init__(name, ip, port)
		self._reconnection_interval = 10

	def bind(self):
		"""Starts up the server."""
		oc.print_title('Binding server{' + self._name + '}')
		self._initialize_zmq_variables()
		self._socket.bind('tcp://' + self._ip + ':' + self._port)
		oc.print_data_with_red_dashes_at_start('Binded! Running server!')

	def get_message(self):
		"""Returns the next message that this server receives."""
		return to_str(self._socket.recv())

	def send_reply(self, m):
		"""Sends a reply message."""
		self._socket.send(to_bytes(m))


class ClientConnection(ZMQBase):
	"""Represents a single client connection to a host server."""

	def __init__(self, name, ip, port):
		super().__init__(name, ip, port)

	def attempt_connection(self):
		"""Attempt to connect to the host server."""
		oc.print_title('Attempting connection to host server!')
		self._initialize_zmq_variables()
		self._socket.connect('tcp://' + self._ip + ':' + self._port)
		oc.print_data_with_red_dashes_at_start('Connected! Running client!')

	def send_message(self, m):
		"""Sends the message to the host server."""
		self._socket.send(to_bytes(m))
		return to_str(self._socket.recv())

