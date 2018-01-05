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

# Utility variables.
ADDRESS = 'address'
PORT    = 'port'

# Pre-defined utility servers.
SERVER_ENTITY  = 'zmq_entity'
SERVER_FINANCE = 'zmq_finance'
SERVER_QUASAR  = 'zmq_quasar'


SUCCESS_MESSAGE = 's:'
ERROR_MESSAGE   = 'e:'

SERVER_COMMAND_REQUEST_ALL_DATA    = 'a'
SERVER_COMMAND_CREATE_ENTITY_OWNER = 'ceo'


# Code from https://stackoverflow.com/questions/7585435/best-way-to-convert-string-to-bytes-in-python-3
def to_bytes(arg):
	"""Utility function."""
	if isinstance(arg, str):
		return arg.encode()
	return arg


def to_str(arg):
	"""Utility function."""
	if isinstance(arg, bytes):
		return arg.decode()
	return arg


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

	def log(self, l):
		"""Logs the message l."""
		print(l, flush=True)

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

