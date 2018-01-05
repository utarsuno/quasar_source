# coding=utf-8

"""This module, entity_server.py, is used to manager a server's memory + cache of entity managers and owners."""

from entities.database.entity_database import EntityDatabaseAPI
from entities import base_entity as be

from universal_code import useful_file_operations as ufo
from universal_code import path_manager as pm
from utility_server import utility_servers as us

from universal_code import system_os as so

import time


SERVER_COMMAND_REQUEST_ALL_DATA = 'a'


class EntityOwner(object):
	"""Cache for an instance of an EntityOwner."""

	def __init__(self, entity_manager):
		self._entity_manager = entity_manager


class EntityServer(object):
	"""Represents the Entity Data Server."""

	def __init__(self):
		self._host_server_data = ufo.get_ini_section_dictionary(pm.get_config_ini(), us.SERVER_ENTITY)
		self._host_server = us.HostServer(us.SERVER_ENTITY, self._host_server_data[us.ADDRESS], self._host_server_data[us.PORT])

		self._entity_owners = []

		self._db_api = EntityDatabaseAPI()
		print('Test function!')

	def run(self):
		"""Runs the entity server."""
		self._host_server.bind()

		while True:
			message = self._host_server.get_message()

			if message == SERVER_COMMAND_REQUEST_ALL_DATA:
				self._host_server.send_reply(str(self._db_api.test_function()))
			else:
				self._host_server.send_reply('Server says hello!')


'''
class EntityServerOld(object):
	"""Memory layer for entity managers and owners."""

	def __init__(self):
		self._db_api = EntityDatabaseAPI()



		# TODO : Text reminder support.

	def is_valid_login_info(self, username, password) -> bool:
		"""Returns a boolean indicating if a username and password combination is valid."""
		return self._db_api.is_valid_owner(username, password)

	def is_username_taken(self, username) -> bool:
		"""Returns a boolean indicating if the username is taken."""
		return self._db_api.is_owner_name_taken(username)

	# TODO : delete owner function

	def delete_entity(self, owner_name, entity_id_to_delete):
		"""Deletes an entity."""
		self._db_api.delete_entity(owner_name, entity_id_to_delete)

	def create_owner(self, owner_data):
		"""Creates an owner. Throws an exception if the required owner keys are not provided."""
		# Required keys passed in check.
		for required_key in [be.ENTITY_PROPERTY_PASSWORD, be.ENTITY_PROPERTY_EMAIL, be.ENTITY_PROPERTY_USERNAME]:
			if required_key not in owner_data:
				return HttpResponse('Required key data not provided for creating an owner! Missing at least {' + required_key + '} from the provided {' + str(owner_data) + '}')

		# Username not already taken check.
		if self._db_api.is_owner_name_taken(owner_data[be.ENTITY_PROPERTY_USERNAME]):
			return HttpResponse('The username{' + owner_data[be.ENTITY_PROPERTY_USERNAME] + '} is already taken!')

		# Checks passed, create the owner.
		self._db_api.create_owner(owner_data)
		return SERVER_REPLY_GENERIC_YES

	def update_owner(self, owner_data):
		"""Updates an owner. Throws an exception if the _id key is not provided."""
		# Required keys passed in check.
		if be.ENTITY_PROPERTY_SERVER_ID not in owner_data:
			return HttpResponse('Required key data not provided for updating an owner! Missing at the _id key from ' + str(owner_data) + '}')

		# Owner ID exists check.
		if not self._db_api.is_owner_id_valid(owner_data[be.ENTITY_PROPERTY_SERVER_ID]):
			return HttpResponse('The owner ID{' + str(owner_data[be.ENTITY_PROPERTY_SERVER_ID]) + '} is not valid!')

		self._db_api.update_owner(owner_data)
		return SERVER_REPLY_GENERIC_YES

	def save_or_update_entity(self, owner_name, entity_data):
		"""Creates a new entity or modifies an existing with with the new data."""
		# Update the entity for the owner.
		self._db_api.save_or_update_entity(owner_name, entity_data)

		# TODO : Add text reminder checking logic here

	def get_all_users_entities(self, owner_name, owner_password):
		"""Returns a JSON response containing all the user's entities."""
		# Check for valid username and password.
		if not self._db_api.is_valid_owner(owner_name, owner_password):
			return HttpResponse('Invalid username and password!')

		#print('GET ALL USER ENTITIES RESPONSE IS ')
		response = self._db_api.get_all_entities_from_owner_as_json(owner_name)

		return JsonResponse(response)

	def get_all_public_entities(self):
		"""Returns all the public entities."""
		return JsonResponse(self._db_api.get_all_entities_from_owner_as_json(PUBLIC_ENTITIES_OWNER))

	def print_full_status(self):
		"""Temporary debugging function."""
		return self._db_api.get_data_on_all_owners()

	def get_managers_cache_report(self):
		"""Return the current status of the managers cache."""
		return self._db_api.get_full_data_on_all_owners()

	def get_database_data(self):
		"""TODO : Document"""
		return self._db_api.get_all_database_data()
'''


'''___  __   __                  ___     __                         __
  |__  /  \ |__)    |    | \  / |__     |__) |  | |\ | |\ | | |\ | / _`
  |    \__/ |  \    |___ |  \/  |___    |  \ \__/ | \| | \| | | \| \__> '''

arguments = so.get_all_program_arguments()
if len(arguments) == 1:
	if arguments[0] == '-r':
		entity_server = EntityServer()
		entity_server.run()
