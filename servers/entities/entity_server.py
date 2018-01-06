# coding=utf-8

"""This module, entity_server.py, is used to manager a server's memory + cache of entity managers and owners."""

from entities.database.entity_database import EntityDatabaseAPI
from entities import base_entity as be

from universal_code import useful_file_operations as ufo
from universal_code import path_manager as pm
from servers import utility_servers as us

from universal_code import system_os as so

import time


class EntityOwner(object):
	"""Cache for an instance of an EntityOwner."""

	def __init__(self, entity_manager):
		self._entity_manager = entity_manager
		self._username = None

	@property
	def username(self) -> str:
		"""Returns the username of this EntityOwner."""
		return self._username


class EntityServer(object):
	"""Represents the Entity Data Server."""

	def __init__(self):
		self._host_server_data = ufo.get_ini_section_dictionary(pm.get_config_ini(), us.SERVER_ENTITY)
		self._host_server = us.HostServer(us.SERVER_ENTITY, self._host_server_data[us.ADDRESS], self._host_server_data[us.PORT])

		self._entity_owners = []

		self._db_api = EntityDatabaseAPI()

	def _parse_out_server_command(self, raw_message):
		"""Returns the server command type and data."""
		first_match_found = False
		command = ''
		data = ''
		for c in raw_message:
			if c == ':':
				if not first_match_found:
					first_match_found = True
				else:
					data += c
			else:
				if first_match_found:
					data += c
				else:
					command += c
		return command, data

	def _load_entity_owners(self):
		"""Does the initial load of the entity owner cache objects."""
		all_data = self._get_all_database_data()

		print('ALL DATA')
		print(type(all_data))
		print(all_data)
		data = all_data.split('\n')
		for d in data:
			print(d)

	def run(self):
		"""Runs the entity server."""
		self._host_server.bind()

		self._load_entity_owners()

		while True:
			command, data = self._parse_out_server_command(self._host_server.get_message())

			if command == us.SERVER_COMMAND_CREATE_ENTITY_OWNER:
				self._host_server.send_reply(self._create_entity_owner(data))
			elif command == us.SERVER_COMMAND_REQUEST_ALL_DATA:
				self._host_server.send_reply(str(self._get_all_database_data()))
			elif command == us.SERVER_COMMAND_IS_USERNAME_TAKEN:
				self._host_server.send_reply(self._is_username_taken(data))
			else:
				self._host_server.send_reply('Invalid server command sent!')

	def _is_username_taken(self, username):
		"""Checks if the provided username is taken."""
		for eo in self._entity_owners:
			if eo.username == username:
				return us.SUCCESS_MESSAGE
		return us.ERROR_MESSAGE

	def _get_all_database_data(self):
		"""Returns all the database data."""
		return self._db_api.get_all_database_data()

	def _create_entity_owner(self, data):
		"""Performs this server command and returns the reply."""

		us.log('Entity server needs to create the following owner :')
		if type(data) == str:
			data = eval(data)
		us.log(str(data))
		#us.log(type(data))

		all_data = self._get_all_database_data()
		us.log(all_data)

		# Required keys passed in check.
		for required_key in [be.ENTITY_PROPERTY_PASSWORD, be.ENTITY_PROPERTY_EMAIL, be.ENTITY_PROPERTY_USERNAME]:
			if required_key not in data:
				return us.error('Required key data not provided for creating an owner! Missing at least {' + required_key + '} from the provided {' + str(data) + '}')

		# TODO :
		# Username not already taken check.
		#if self._db_api.is_owner_name_taken(owner_data[be.ENTITY_PROPERTY_USERNAME]):
		#	return HttpResponse('The username{' + owner_data[be.ENTITY_PROPERTY_USERNAME] + '} is already taken!')

		self._db_api.create_owner(data)

		return us.SUCCESS_MESSAGE

		'''

		# Checks passed, create the owner.
		self._db_api.create_owner(owner_data)
		return SERVER_REPLY_GENERIC_YES
		'''

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
