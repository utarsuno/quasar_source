# coding=utf-8

"""This module, entity_server.py, is used to manager a server's memory + cache of entity managers and owners."""

from entities.database.entity_database import EntityDatabaseAPI
from entities import base_entity as be

from universal_code import useful_file_operations as ufo
from universal_code import path_manager as pm
from servers import utility_servers as us

from universal_code import system_os as so

from entities import base_entity as be

import time
from servers.entities import entity_owner as eo
from universal_code import debugging as dbg


class EntityServer(object):
	"""Represents the Entity Data Server."""

	def __init__(self):
		self._host_server_data = ufo.get_ini_section_dictionary(pm.get_config_ini(), us.SERVER_ENTITY)
		self._host_server = us.HostServer(us.SERVER_ENTITY, self._host_server_data[us.ADDRESS], self._host_server_data[us.PORT])

		# Acts as cache.
		self._entity_owners = []

		self._db_api = EntityDatabaseAPI()

		# TODO : Text reminder support.

	def _update_owner(self, owner_username):
		"""Saves all the cache object information to the database."""
		self._db_api.update_owner(owner_username, self._get_entity_owner_by_username(owner_username).get_data_for_database())

	def _update_entity(self, username, entity_data):
		"""Updates the entity cache object."""
		if type(entity_data) == str:

			entity_data = entity_data.replace('\'', '"')

			#print(entity_data)

			entity_data = eval(entity_data)

		# ENTITY_PROPERTIES_ONLY_SERVER_SIDE
		for key in entity_data:
			if key in be.ENTITY_PROPERTIES_ONLY_SERVER_SIDE:
				return us.error('An entity property was sent that should only be updated on the server side! { ' + str(entity_data) + '}')

		updated_entity = None
		for e_o in self._entity_owners:
			if e_o.username == username:
				updated_entity = e_o.update_entity(entity_data)

		if updated_entity is None:
			dbg.raise_exception('The provided entity to update is None!')

		# TODO : Eventually remove this. The perform saves should cover it.
		self._update_owner(username)

		return us.SUCCESS_MESSAGE

	def _get_all_accounts_information(self):
		"""Returns all account information."""
		data = ''
		for e_o in self._entity_owners:
			username, account_type = e_o.get_account_name_and_type()
			data += username + '+' + account_type + '-'
		return data

	def _set_entity_owner_account_type(self, username, account_type):
		"""Sets the entity owner's account type."""
		entity_owner = self._get_entity_owner_by_username(username)
		entity_owner.set_entity_owner_account_type(account_type)

		# TODO : Eventually remove this. The perform saves should cover it.
		self._update_owner(username)

		return us.SUCCESS_MESSAGE

	'''__   ___  __        ___  __           __   __     __
	  /__` |__  |__) \  / |__  |__)    |    /  \ / _` | /  `
	  .__/ |___ |  \  \/  |___ |  \    |___ \__/ \__> | \__, '''

	def _parse_out_server_command(self, raw_message):
		"""Returns the server command type and data."""
		if ':' not in raw_message:
			dbg.raise_exception('Not a valid raw message passed in {{' + str(raw_message) + '}}')
		command = raw_message[:raw_message.index(':')]
		data = raw_message[raw_message.index(':') + 1:]
		return command, data

	def run(self):
		"""Runs the entity server."""
		self._host_server.bind()

		self._load_entity_owners()

		while True:
			command, data = self._parse_out_server_command(self._host_server.get_message())

			if command == us.SERVER_COMMAND_CREATE_ENTITY_OWNER:
				self._host_server.send_reply(self._create_entity_owner(data))
			elif command == us.SERVER_COMMAND_IS_LOGIN_INFORMATION_VALID:
				cleaned_data = data.split('|')
				self._host_server.send_reply(self._is_login_info_valid(cleaned_data[0], cleaned_data[1]))
			elif command == us.SERVER_COMMAND_GET_SHARED_WORLDS:
				self._host_server.send_reply(self._get_shared_worlds(data))
			elif command == us.SERVER_COMMAND_GET_OWNER_ENTITIES:
				self._host_server.send_reply(self._get_all_owner_entities(data))
			elif command == us.SERVER_COMMAND_UPDATE_ENTITY:
				raw_data = data.split('|')
				self._host_server.send_reply(self._update_entity(raw_data[0], raw_data[1]))
			elif command == us.SERVER_COMMAND_ENTITY_OWNER_SUDO_OPERATION:

				username = None

				if ':' in data:
					sub_command, sub_data = self._parse_out_server_command(data)
				else:
					sub_command = data

				if sub_command == us.SERVER_COMMAND_SET_ENTITY_OWNER_ACCOUNT_TYPE:

					cleaned_data = sub_data.split('|')
					username = cleaned_data[0]
					data = cleaned_data[1]

					self._host_server.send_reply(self._set_entity_owner_account_type(username, data))
				elif sub_command == us.SERVER_COMMAND_GET_ALL_ACCOUNTS_INFORMATION:
					self._host_server.send_reply(self._get_all_accounts_information())
				elif sub_command == us.SERVER_COMMAND_DELETE_ENTITY_OWNER:
					self._host_server.send_reply(self._delete_entity_owner(sub_data))
				else:
					dbg.raise_exception('Invalid sub command passed in!')

			elif command == us.SERVER_COMMAND_DELETE_ENTITY:
				raw_data = data.split('|')
				self._host_server.send_reply(self._delete_entity_by_id(raw_data[0], raw_data[1]))
			elif command == us.SERVER_COMMAND_REQUEST_ALL_DATA:
				self._host_server.send_reply(str(self._get_all_database_raw_data()))
			elif command == us.SERVER_COMMAND_IS_USERNAME_TAKEN:
				self._host_server.send_reply(self._is_username_taken(data))
			else:
				self._host_server.send_reply(us.error('Invalid server command sent!'))

	'''__   ___       ___ ___    __
	  |  \ |__  |    |__   |  | /  \ |\ |
	  |__/ |___ |___ |___  |  | \__/ | \| '''
	def _delete_entity_by_id(self, username, relative_id):
		"""Deletes an entity by ID."""
		entity_owner = self._get_entity_owner_by_username(username)
		entity_owner.remove_entity(relative_id)

		# TODO : Eventually move/change the save logic.
		self._update_owner(username)

		return us.SUCCESS_MESSAGE

	def _delete_entity_owner(self, username):
		"""Deletes an entity owner."""
		#us.log('Entity server is deleting the following owner : { ' + username + ' }')
		owners_to_remove = []
		for e_o in self._entity_owners:
			if e_o.username == username:
				owners_to_remove.append(e_o)
		for e_o in owners_to_remove:
			self._entity_owners.remove(e_o)
		self._db_api.delete_owner(username)
		return us.SUCCESS_MESSAGE

	'''__   __   ___      ___    __
	  /  ` |__) |__   /\   |  | /  \ |\ |
	  \__, |  \ |___ /~~\  |  | \__/ | \| '''
	def _create_entity_owner(self, data):
		"""Performs this server command and returns the reply."""
		#us.log('Entity server is creating the following owner : { ' + str(data) + ' }')
		if type(data) == str:
			data = eval(data)

		# TODO : Add syntax rule checks on the entity owner data provided.

		# Required keys passed in check.
		for required_key in [be.ENTITY_PROPERTY_PASSWORD, be.ENTITY_PROPERTY_EMAIL, be.ENTITY_PROPERTY_USERNAME]:
			if required_key not in data:
				return us.error('Required key data not provided for creating an owner! Missing at least {' + required_key + '} from the provided {' + str(data) + '}')

		# Username already taken check.
		if us.is_success_message(self._is_username_taken(data[be.ENTITY_PROPERTY_USERNAME])):
			return us.error('The username{' + data[be.ENTITY_PROPERTY_USERNAME] + '} is already taken!')

		# TODO : Create the EntityOwner object first!

		# All designated error checks passed, create the new owner.
		self._create_new_entity_owner(data)
		return us.SUCCESS_MESSAGE

	def _create_new_entity_owner(self, data):
		"""Creates a new entity owner and adds it to cache."""
		new_entity_owner = eo.EntityOwner(data)
		new_entity_owner.create_initial_entities()
		self._db_api.create_owner(new_entity_owner.get_data_for_database())
		self._entity_owners.append(new_entity_owner)

	'''__   ___ ___ ___  ___  __   __
	  / _` |__   |   |  |__  |__) /__`
	  \__> |___  |   |  |___ |  \ .__/ '''
	def _get_shared_worlds(self, username):
		"""Gets shared worlds for this username."""
		return 'TODO:GET_SHARED_WORLDS!!!'

	def _get_entity_owner_by_username(self, username):
		"""Returns an EntityOwner object matched by username (or None if not found)."""
		for e_o in self._entity_owners:
			if e_o.username == username:
				return e_o
		return None

	def _get_all_owner_entities(self, username):
		"""Returns all the entities for the provided owner."""
		#print('Returning all entities for username{' + username + '}!')
		entities = {}
		for e_o in self._entity_owners:
			if e_o.username == username:
				#print('Found username match!')
				all_entities = e_o.get_all_entities()
				for e in all_entities:
					entities[str(e.relative_id)] = e.get_json_data()
		return str(entities).replace("'", '"')

	def _get_all_database_raw_data(self):
		"""Returns all the database data."""
		return self._db_api.get_all_database_raw_data()

	'''__       ___               __        __          __
	  |  \  /\   |   /\     |    /  \  /\  |  \ | |\ | / _`
	  |__/ /~~\  |  /~~\    |___ \__/ /~~\ |__/ | | \| \__> '''
	def _load_entity_owners(self):
		"""Does the initial load of the entity owner cache objects."""
		us.log('Entity server loading the initial entity owners!')
		all_data = self._db_api.get_all_database_data_as_list_of_dictionaries()
		for d in all_data:
			if '_id' in d:
				del d['_id']
			self._entity_owners.append(eo.EntityOwner(d))
		us.log('Loaded!')

	'''      ___  ___  __   __    ___         __        ___  __        __
      | |\ |  |  |__  / _` |__) |  |  \ /    /  ` |__| |__  /  ` |__/ /__`
      | | \|  |  |___ \__> |  \ |  |   |     \__, |  | |___ \__, |  \ .__/ '''
	def _is_username_taken(self, username):
		"""Checks if the provided username is taken."""
		for e_o in self._entity_owners:
			if e_o.username == username:
				return us.SUCCESS_MESSAGE
		return us.ERROR_MESSAGE

	def _is_login_info_valid(self, username, password):
		"""Checks if the login information provided is a valid combination."""
		for e_o in self._entity_owners:
			if e_o.username == username and e_o.password == password:
				return us.SUCCESS_MESSAGE
		return us.ERROR_MESSAGE + 'provided username and password are not valid'


'''___  __   __                  ___     __                         __
  |__  /  \ |__)    |    | \  / |__     |__) |  | |\ | |\ | | |\ | / _`
  |    \__/ |  \    |___ |  \/  |___    |  \ \__/ | \| | \| | | \| \__> '''

arguments = so.get_all_program_arguments()
if len(arguments) == 1:
	if arguments[0] == '-r':
		entity_server = EntityServer()
		entity_server.run()
