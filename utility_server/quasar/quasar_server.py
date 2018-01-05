# coding=utf-8

"""This module, quasar_server.py, is the utility quasar client to the entity server."""

from utility_server import utility_servers as us

import time
from universal_code import path_manager as pm
from universal_code import useful_file_operations as ufo


SUCCESS_MESSAGE = 's:'
ERROR_MESSAGE   = 'e:'

SERVER_COMMAND_REQUEST_ALL_DATA = 'a'


class QuasarServer(object):
	"""Represents the Quasar utility server."""

	def __init__(self):
		#self._host_server_data = ufo.get_ini_section_dictionary(pm.get_config_ini(), SERVER_QUASAR)
		#self._host_server = HostServer(SERVER_QUASAR, self._host_server_data[ADDRESS], self._host_server_data[PORT])

		# Client connection to the entity data server.
		self._entity_server_data = ufo.get_ini_section_dictionary(pm.get_config_ini(), us.SERVER_ENTITY)
		self._entity_server_connection = us.ClientConnection('client:' + us.SERVER_ENTITY, self._entity_server_data[us.ADDRESS], self._entity_server_data[us.PORT])

	def connect(self):
		"""Performs the initial connection."""
		self._entity_server_connection.attempt_connection()



		'''
		response = self._entity_server_connection.send_message(es.SERVER_COMMAND_REQUEST_ALL_DATA)

		#response = self._entity_server_connection.send_message('Hello from client 0')

		print('Client got this response : ' + response)
		time.sleep(2)
		response = self._entity_server_connection.send_message('Hello from client 1')
		print('Client got this response : ' + response)
		time.sleep(4)
		response = self._entity_server_connection.send_message('Hello from client 2')
		print('Client got this response : ' + response)
		'''

	def create_entity_owner(self, owner_data):
		"""Creates a new entity owner."""
		print('Create entity owner start!')

		reply = self._entity_server_connection.send_message(SERVER_COMMAND_REQUEST_ALL_DATA)
		reply = eval(reply)
		print(type(reply))
		#print(reply)

		print('Need to create an entity owner for the following data :')
		print(owner_data)
		return SUCCESS_MESSAGE

