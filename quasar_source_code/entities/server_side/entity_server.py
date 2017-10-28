# coding=utf-8

"""This module, entity_server.py, is used to manager a server's memory + cache of entity managers and owners."""

from quasar_source_code.entities.database import entity_database
from quasar_source_code.entities import base_entity as be

# Needed for sending a simple HttpResponse such as a string response.
from django.http import HttpResponse

from quasar_source_code.universal_code import time_abstraction as ta

import json

from django.http import JsonResponse

# Utility indexes.
INDEX_OWNER_NAME       = 0
INDEX_OWNER_PASSWORD   = 1
INDEX_OWNER_EMAIL      = 2
INDEX_OWNER_ID         = 3
INDEX_OWNER_MANAGER_ID = 4

# Server response messages.
SERVER_REPLY_INVALID_POST_DATA_ERROR                = HttpResponse('Invalid POST data!')
SERVER_REPLY_INVALID_NUMBER_OF_POST_ARGUMENTS_ERROR = HttpResponse('Invalid number of POST arguments!')
SERVER_REPLY_GENERIC_NO                             = HttpResponse('n')
SERVER_REPLY_GENERIC_YES                            = HttpResponse('y')
SERVER_REPLY_GENERIC_SERVER_ERROR                   = HttpResponse('Server Error!')

# Entity properties.
ENTITY_PROPERTY_ID       = 'ENTITY_PROPERTY_ID'
ENTITY_PROPERTY_TYPE     = 'ENTITY_PROPERTY_TYPE'
ENTITY_PROPERTY_POSITION = 'ENTITY_PROPERTY_POSITION'
ENTITY_PROPERTY_LOOK_AT  = 'ENTITY_PROPERTY_LOOK_AT'
ENTITY_PROPERTY_NAME     = 'ENTITY_PROPERTY_NAME'


class EntityServer(object):
	"""Memory layer for entity managers and owners."""

	def __init__(self):
		self._db_api   = entity_database.EntityDatabaseAPI(debug=True)
		self._owners   = self._db_api.get_all_owners()
		# Managers are loaded as needed.
		self._managers = {}

	def delete_entity(self, owner_username, entity_id_to_delete):
		"""Deletes an entity."""
		print('Remove the entity{' + str(entity_id_to_delete) + '} for user {' + str(owner_username) + '}')

		match_found = False
		entity_to_remove = None

		# Check if the owner already has an Entity with the provided entity ID.
		owner_entities = self._managers[owner_username].get_all_entities()
		print('The owner{' + str(owner_username) + '} currently has {' + str(len(owner_entities)) + '} entities.')
		for e in owner_entities:
			print(str(e) + '\t' + str(e.relative_id))
			if e.relative_id == int(entity_id_to_delete):
				print('Found an Entity match to delete!')
				entity_to_remove = e
				match_found = True

		if match_found:
			self._managers[owner_username].remove_entity(entity_to_remove)

			self._db_api.save_entity_manager(self._managers[owner_username])
			return SERVER_REPLY_GENERIC_YES
		else:
			return SERVER_REPLY_GENERIC_NO

	def save_or_update_entity(self, owner_username, data_dictionary):
		"""Creates a new entity or updates an existing entity."""
		entity_manager = self._managers[owner_username]

		print('NEED TO SAVE THE ENTITY : ' + str(data_dictionary))

		for key in data_dictionary:
			print(str(key) + '\t' + str(data_dictionary[key]) + '\t' + str(type(data_dictionary[key])))
		print('------------')

		match_found = False
		id_match    = None

		# Check if the owner already has an Entity with the provided entity ID.
		owner_entities = entity_manager.get_all_entities()
		print('The owner{' + str(owner_username) + '} currently has {' + str(len(owner_entities)) + '} entities.')
		for e in owner_entities:
			#print(e)
			if e.relative_id == data_dictionary[ENTITY_PROPERTY_ID]:
				print('Found an Entity match!')
				id_match = e.relative_id
				match_found = True

		if not match_found:
			print('Adding in a new entity!!!')

			entity_name = data_dictionary[ENTITY_PROPERTY_NAME]
			entity_id   = data_dictionary[ENTITY_PROPERTY_ID]
			entity_type = data_dictionary[ENTITY_PROPERTY_TYPE]

			new_entity = be.Entity(entity_name)
			new_entity.set_relative_id(entity_id)
			new_entity.set_entity_type(entity_type)

			# Now set all other properties into the information field.
			for key in data_dictionary:
				if key != ENTITY_PROPERTY_NAME and key != ENTITY_PROPERTY_ID and key != ENTITY_PROPERTY_TYPE:
					new_entity.add_information(key, data_dictionary[key])

			# Give the entity to the manager.
			entity_manager.add_entities(new_entity)

			# Now save the entity manager.
			# TODO : Make a more efficient save method. Only save the entity change, not the entire manager again.
			self._db_api.save_entity_manager(entity_manager)

		else:
			print('Updating the entity{' + str(id_match) + '}')

			# If an entity match was found then the entity's values need to be saved over.
			current_entity = entity_manager.get_entity_by_id(id_match)

			for key in data_dictionary:
				# TODO : re-look at this design later on. (Note add_information will over-ride currently existing values)
				current_entity.add_information(key, data_dictionary[key])

			self._db_api.save_entity_manager(entity_manager)

	def _update_owners(self):
		"""Updates the owners list."""
		self._owners = self._db_api.get_all_owners()

	def _is_username_taken(self, username) -> bool:
		"""Returns a boolean indicating if a username is taken."""
		self._owners = self._db_api.get_all_owners()
		for o in self._owners:
			if o[INDEX_OWNER_NAME] == username:
				return True
		return False

	def is_valid_login_info(self, username, password) -> bool:
		"""Returns a boolean indicating if a username and password combination is valid."""
		self._owners = self._db_api.get_all_owners()
		for o in self._owners:
			if o[INDEX_OWNER_NAME] == username and o[INDEX_OWNER_PASSWORD] == password:
				return True
		return False

	def create_owner(self, owner_name, owner_email, owner_password):
		"""Creates an owner."""
		self._update_owners()
		if self._is_username_taken(owner_name):
			return HttpResponse('Username is taken!')
		else:
			# TODO : other checks here too.
			self._db_api.create_owner(name=owner_name, email=owner_email, password=owner_password)
			# Now that the user is created make sure to update owners again.
			self._update_owners()
			return SERVER_REPLY_GENERIC_YES

	def get_owner(self, owner_name):
		"""Gets the owner object, searched by owner name."""
		self._owners = self._db_api.get_all_owners()
		for o in self._owners:
			if o[INDEX_OWNER_NAME] == owner_name:
				return o

	def ensure_manager_is_loaded_for_owner(self, owner_name):
		"""Loads an entity_manager through the reference of an owner name."""
		self._owners = self._db_api.get_all_owners()
		if owner_name not in self._managers:
			for o in self._owners:
				if o[INDEX_OWNER_NAME] == owner_name:
					manager = self._db_api.get_entity_manager(manager_id=int(o[INDEX_OWNER_MANAGER_ID]))
					print('Owner is : ' + str(owner_name))
					#print('Manager is : ' + str(manager))
					self._managers[owner_name] = manager

	def load_all_entities(self, username, password):
		"""Gets all entities for the username provided."""
		if self.is_valid_login_info(username, password):
			error_happened = False

			try:
				self.ensure_manager_is_loaded_for_owner(username)
			except Exception as e:
				print('ERROR GETTING ENTITIES FOR ' + str(username) + '}')
				print(str(e))
				print('@@@@@@@@@@@@@@@@')
				error_happened = True

			entities = self._managers[username].get_all_entities()

			print('Returning the following entities : ')
			for e in entities:
				print(str(e))

			json_data = {}

			for e in entities:
				json_data[e.name] = e.get_json_data()

			return JsonResponse(json_data)
		else:
			return HttpResponse('Username or password is not correct.')

		return SERVER_REPLY_GENERIC_NO

	# TODO : Delete this method.
	def get_entities_for_day(self, day, username):
		"""Gets the entities for the day provided."""
		print('Get entities for day got the following day{' + str(day) + '}')
		parts = day.split('/')
		specific_day = ta.get_specific_day(year=int(parts[2]), month=int(parts[0]), day=int(parts[1]))

		error_happened = False

		try:
			self.ensure_manager_is_loaded_for_owner(username)
		except Exception as e:
			print('ERROR GETTING ENTITIES FOR DAY{' + str(day) + '} for {' + str(username) + '}')
			print(str(e))
			print('@@@@@@@@@@@@@@@@')
			error_happened = True

		data = self._managers[username].get_information_for_specific_day(specific_day)
		print(data)
		print(specific_day)
		if error_happened:
			print('oh and an error happened!\n')

		json_data = {day : []}
		for d in data:
			json_data[day].append(d)

		print('returning : ' + str(json_data))

		return HttpResponse(json.dumps(json_data))
