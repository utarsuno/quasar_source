# coding=utf-8

"""This module, quasar_server.py, is the utility quasar client to the entity server."""

from servers import utility_servers as us

import time
from universal_code import path_manager as pm
from universal_code import useful_file_operations as ufo
from entities import base_entity as be
from universal_code import system_os as so


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

	# return quasar_server.update_entity(received_username, data_dictionary)
	def update_entity(self, username, entity_data):
		"""Updates an entity for the provided entity owner."""
		return self._send_command_to_entity_server(us.SERVER_COMMAND_UPDATE_ENTITY, username + '|' + str(entity_data))

	def get_all_data(self):
		"""Returns all the data in the database."""
		reply = self._send_command_to_entity_server(us.SERVER_COMMAND_REQUEST_ALL_DATA)
		#print(reply)
		return reply

	def is_valid_login(self, username, password):
		"""Checks that the login username and password have a match."""
		return self._send_command_to_entity_server(us.SERVER_COMMAND_IS_LOGIN_INFORMATION_VALID, username + '|' + password)

	def get_owner_entities(self, username):
		"""Gets owner entities for the provided owner."""
		print('Quasar Utility Server getting owner entities for username{' + username + '}')
		return self._send_command_to_entity_server(us.SERVER_COMMAND_GET_OWNER_ENTITIES, username)

	def create_entity_owner(self, owner_data):
		"""Creates a new entity owner."""
		return self._send_command_to_entity_server(us.SERVER_COMMAND_CREATE_ENTITY_OWNER, owner_data)

	def is_username_taken(self, username):
		"""Checks if the username is taken."""
		return self._send_command_to_entity_server(us.SERVER_COMMAND_IS_USERNAME_TAKEN, username)

	def _send_command_to_entity_server(self, command, data=''):
		"""Sends a command to the entity server."""
		return self._entity_server_connection.send_message(command + ':' + str(data))

	'''__   ___       ___ ___    __
	  |  \ |__  |    |__   |  | /  \ |\ |
	  |__/ |___ |___ |___  |  | \__/ | \| '''
	def delete_entity_owner(self, username):
		"""Deletes the entity owner found by username match."""
		return self._send_command_to_entity_server(us.SERVER_COMMAND_DELETE_ENTITY_OWNER, username)

'''___  __   __                  ___     __                         __
  |__  /  \ |__)    |    | \  / |__     |__) |  | |\ | |\ | | |\ | / _`
  |    \__/ |  \    |___ |  \/  |___    |  \ \__/ | \| | \| | | \| \__> '''

COMMAND_DELETE_OWNER = 'do'
COMMAND_CREATE_OWNER = 'co'
COMMAND_PRINT_ALL_DATA = 'pd'


arguments = so.get_all_program_arguments()
if len(arguments) == 1:
	flag = arguments[0]
	first_match_hit = False
	command = ''
	data = ''
	for c in flag:
		if c == ':':
			if not first_match_hit:
				first_match_hit = True
			else:
				data += c
		else:
			if first_match_hit:
				data += c
			else:
				command += c

	quasar_server = QuasarServer()
	quasar_server.connect()

	if command == COMMAND_CREATE_OWNER:
		owner_data = {be.ENTITY_PROPERTY_USERNAME: data,
		              be.ENTITY_PROPERTY_EMAIL   : data + '@' + data + '.com',
		              be.ENTITY_PROPERTY_PASSWORD: data}
		print(quasar_server.create_entity_owner(owner_data))
	elif command == COMMAND_PRINT_ALL_DATA:
		print('Printing all data!')
		results = quasar_server.get_all_data()
		print(data)
	elif command == COMMAND_DELETE_OWNER:
		print(quasar_server.delete_entity_owner(data))
