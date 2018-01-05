# coding=utf-8

"""This module, entity_database.py, contains a database api layer for entity objects."""

import ast

from database_api.nosql_databases import mongodb_api as db_api
from entities.entity_manager import EntityManager
from entities import base_entity as be

'''  __       ___       __        __   ___          __
	|  \  /\   |   /\  |__)  /\  /__` |__      /\  |__) |    .
	|__/ /~~\  |  /~~\ |__) /~~\ .__/ |___    /~~\ |    |    .
'''

# Public entities owner name
PUBLIC_ENTITIES_OWNER = 'public_entities'


class EntityOwner(object):
	"""Represents an Entity owner in the database."""

	def __init__(self, owner_data, entity_database_api):
		self._entity_database_api = entity_database_api
		self._data     = {}
		# self._entities is only used for the initial data population.
		self._entities = {}
		for key in owner_data:
			if str(key).isdigit():
				self._entities[int(key)] = owner_data[key]
			else:
				self._data[key] = owner_data[key]

		self._entity_manager = EntityManager()
		self._populate_entities()

	@property
	def entity_manager(self):
		"""Returns the entity manager object of this EntityOwner."""
		return self._entity_manager

	def get_pretty_print_entities(self):
		"""Temporary"""
		return self._entity_manager.get_pretty_print_all_entities()

	def print_entities(self):
		"""Temporary debugging function."""
		self._entity_manager.print_entities()

	def get_entities_as_string_lines(self):
		"""TODO : Document"""
		lines = []
		entities = self._entity_manager.get_all_entities()
		for e in entities:
			lines.append(str(e.get_full_info()))
		return lines

	def ensure_entity_owner_exists(self):
		"""Creates the owner entity if it does not yet exist."""
		if self._entity_manager.ensure_entity_owner_exists(self._data, self._entity_database_api.get_largest_entity_owner_server_id() + 1):
			# An owner was created.
			self.save_to_database()

	def is_public_entity_owner(self) -> bool:
		"""Returns a boolean indicating if this EntityOwner account is the public entities owner."""
		if be.ENTITY_PROPERTY_USERNAME not in self._data:
			return False
		return self._data[be.ENTITY_PROPERTY_USERNAME] == 'public_entities'

	def save_to_database(self, perform_replace=False):
		"""Utility function to send changes to the database."""

		# TODO : In the future only save the data that has been changed!!

		save_data = {}
		for key in self._data:
			save_data[key] = self._data[key]

			#print('Adding the following save data!?')
			#print(str(key) + '\t' + str(self._data[key]))
			#print('@@@@')

		entities_as_a_dictionary = self._entity_manager.get_all_entities_as_dictionary()
		for key in entities_as_a_dictionary:
			#print('Adding the following to the entities dictionary')
			#print(key)
			#print(entities_as_a_dictionary[key])
			save_data[key] = entities_as_a_dictionary[key]

		if not perform_replace:
			self._entity_database_api.update_owner_for_database(save_data)
		else:
			self._entity_database_api.replace_owner_for_database(save_data)

		#print('Here is the save data!!')
		#print(save_data)
		#print()

	def delete_entity_with_id(self, entity_id):
		"""Deletes the specified entity."""
		self._entity_manager.delete_entity(entity_id)

	def save_or_update_entity(self, entity_data):
		"""Updates the entity."""
		self._entity_manager.save_or_update_entity(entity_data)
		self.save_to_database()

	def get_entity_manager(self):
		"""Returns the EntityManager object holding this EntityOwner's entities."""
		return self._entity_manager

	def get_owner_name(self) -> str:
		"""Returns the name of this EntityOwner."""
		if be.ENTITY_PROPERTY_USERNAME not in self._data:
			return 'NO_OWNER_NAME_SET'
		return self._data[be.ENTITY_PROPERTY_USERNAME]

	def get_owner_password(self) -> str:
		"""Returns the password of this EntityOwner."""
		return self._data[be.ENTITY_PROPERTY_PASSWORD]

	def get_owner_id(self):
		"""Returns the _id of this EntityOwner."""
		return self._data[be.ENTITY_PROPERTY_SERVER_ID]

	def _populate_entities(self):
		"""Gives the entity data to the EntityManager."""
		for e in self._entities:
			base_entity = be.Entity()
			base_entity.set_relative_id(int(e))
			for key in self._entities[e]:
				value = self._entities[e][key]
				if key == be.ENTITY_DEFAULT_PROPERTY_TYPE:
					base_entity.set_entity_type(value)
				elif key == be.ENTITY_DEFAULT_PROPERTY_CHILD_IDS:
					base_entity._children_entities = ast.literal_eval(value)
				elif key == be.ENTITY_DEFAULT_PROPERTY_PARENT_IDS:
					base_entity._parent_entities = ast.literal_eval(value)
				elif key == be.ENTITY_DEFAULT_PROPERTY_RELATIVE_ID:
					base_entity.set_relative_id(int(value))
				else:
					base_entity.add_information(str(key), str(value))

			self._entity_manager.add_entities(base_entity)

		# In case owner entity was made, but eventually make this operation faster.
		#self._save_to_database()

	def get_number_of_entities(self) -> int:
		"""Returns the number of entities that this EntityOwner has."""
		return self._entity_manager.get_number_of_entities()

	def get_largest_entity_key(self) -> int:
		"""Returns the largest integer key found or -1 if none found."""
		return self._entity_manager.get_largest_entity_id()

	def does_entity_id_exist(self, entity_id) -> bool:
		"""Returns a boolean indicating if the entity ID exists for this owner."""
		for e in self._entities:
			if int(e) == entity_id:
				return True
		return False

	def get_all_entities_as_dictionary(self):
		"""Returns a dictionary of all the entities."""
		return self._entity_manager.get_all_entities_as_dictionary()

	def __str__(self):
		return 'EntityOwner{' + str(self.get_owner_name()) + '} (has ' + str(self.get_number_of_entities()) + ' entities)'


class EntityDatabaseAPI(object):
	"""An API for Entity database operations."""

	def __init__(self, debug=False):
		self._debug             = debug
		self._api               = db_api.MongoDBAPI()
		self._owners_collection = self._api.get_collection('owners')

		# OLD CODE BELOW
		#self._owners_cache      = []
		#self._update_owners_cache()



	def test_function(self):
		return self._owners_collection.get_all()

	# OLD CODE BELOW
	# OLD CODE BELOW
	# OLD CODE BELOW

	def create_owner(self, owner_data) -> None:
		"""Creates an owner. Throws an exception if the required attributes are not provided."""
		# Make sure that all the required keys are provided.
		for required_key in [be.ENTITY_PROPERTY_USERNAME, be.ENTITY_PROPERTY_PASSWORD, be.ENTITY_PROPERTY_EMAIL]:
			if required_key not in owner_data:
				raise Exception('Owner key ' + required_key + ' not provided in {' + str(owner_data) + '}!')
		# Make sure that the owner name isn't already taken.
		if self.is_owner_name_taken(owner_data[be.ENTITY_PROPERTY_USERNAME]):
			raise Exception('Owner name ' + owner_data[be.ENTITY_PROPERTY_USERNAME] + ' is already taken!')

		# Update the owner cache.
		new_entity_owner = self._add_owner_to_cache(owner_data)

		# Create the owner.
		self._owners_collection.insert(owner_data)

		# When creating the owner object we also need to create the owner entity.
		new_entity_owner.ensure_entity_owner_exists()

	def connect(self):
		"""Connect to the database."""
		self._api.connect()

	def terminate(self):
		"""Cleanly exit the connection from the database."""
		self._api.terminate()

	def get_largest_entity_owner_server_id(self) -> int:
		"""Returns an integer of the current largest entity owner server id. Returns -1 if there are no owners."""
		largest_entity_owner_id = -1
		for o in self._owners_cache:
			entity_owner = o.entity_manager.get_entity_owner()
			if entity_owner is not None:
				server_id = int(entity_owner.get_value(be.ENTITY_PROPERTY_SERVER_ID))
				if server_id > largest_entity_owner_id:
					largest_entity_owner_id = server_id
		return largest_entity_owner_id

	def get_all_database_data(self):
		"""TODO : Document"""
		entities = self._owners_collection.get_all()
		text = ''
		for e in entities:
			text += str(e) + '\n'
		return text

	def get_full_data_on_all_owners(self):
		"""Temporary debugging function."""
		return_data = ''
		for o in self._owners_cache:
			return_data += str(o) + '\n'
			d = o.get_entities_as_string_lines()
			for l in d:
				return_data += l
		return return_data

	def get_data_on_all_owners(self):
		"""Temporary debugging function."""
		data = ''
		for o in self._owners_cache:
			data += o + '\n'
			lines = o.get_entities_as_string_lines()
			for l in lines:
				data += l
		return data

	def delete_entity(self, owner_name, entity_id_to_delete):
		"""Deletes the entity with an ID match for the given owner."""
		for o in self._owners_cache:
			if o.get_owner_name() == owner_name:
				o.delete_entity_with_id(entity_id_to_delete)
				o.save_to_database(True)

	def get_all_entities_from_owner_as_json(self, owner_name):
		"""Returns all the owner's entities as json."""
		for o in self._owners_cache:
			if o.get_owner_name() == owner_name:
				return o.get_all_entities_as_dictionary()

	def replace_owner_for_database(self, replace_data):
		"""Replaces the data for the owner. (Currently needed to enable delete functionality)"""
		self._owners_collection.replace(replace_data)

	def update_owner_for_database(self, save_data):
		"""Performs a database update for the owner."""

		#print('\nupdate_owner_for_database\n')
		#print(save_data)

		self._owners_collection.update(save_data)

	def save_or_update_entity(self, owner_name, data_dictionary):
		"""Saves or updates an entity."""
		# Owner name does not exist check.
		if not self.is_owner_name_taken(owner_name):
			raise Exception('Can\'t update or save an entity for an owner that does not exist! {' + str(owner_name) + '}')
		owner = self.get_specific_owner_by_name(owner_name)
		owner.save_or_update_entity(data_dictionary)

	def get_owner_id_by_name(self, owner_name):
		"""Returns the _id of the owner."""
		return self._owners_collection.get_id_by_key_value_match(be.ENTITY_PROPERTY_USERNAME, owner_name)

	def _add_public_entity_owner(self):
		"""Adds the public entity owner."""
		o = {be.ENTITY_PROPERTY_PASSWORD: PUBLIC_ENTITIES_OWNER, be.ENTITY_PROPERTY_USERNAME: PUBLIC_ENTITIES_OWNER, be.ENTITY_PROPERTY_EMAIL: PUBLIC_ENTITIES_OWNER}
		self._owners_cache.append(EntityOwner(o, self))

	def _update_owners_cache(self):
		"""Reloads the owners."""
		owners = self._owners_collection.get_all()
		for o in owners:
			self._owners_cache.append(EntityOwner(o, self))

		# Ensure that there is an owner for all the public entities.
		public_entity_owner_found = False
		for o in self._owners_cache:
			if o.is_public_entity_owner():
				public_entity_owner_found = True
				break
		if not public_entity_owner_found:
			self._add_public_entity_owner()

	def get_all_owners(self):
		"""Gets all the owners from the database."""
		return self._owners_cache

	def get_specific_owner_by_name(self, owner_name):
		"""Returns an EntityOwner of that owner."""
		for o in self._owners_cache:
			if o.get_owner_name() == owner_name:
				return o
		return None

	def is_valid_owner(self, owner_name, owner_password) -> bool:
		"""Returns a boolean indicating if the owner name and password combination maps to a valid owner."""
		for o in self._owners_cache:
			if o.get_owner_name() == owner_name and o.get_owner_password() == owner_password:
				return True
		return False

	def is_owner_id_valid(self, owner_id) -> bool:
		"""Returns a boolean indicating if the owner id maps to a valid owner."""
		for o in self._owners_cache:
			if o.get_owner_id() == owner_id:
				return True
		return False

	def is_owner_name_taken(self, owner_name):
		"""Returns a boolean indicating if the owner name has already been taken."""
		for o in self._owners_cache:
			if o.get_owner_name() == owner_name:
				return True
		return False

	def _add_owner_to_cache(self, owner_data):
		"""Adds the owner to the owner cache and returns the EntityOwner created."""
		new_entity_owner = EntityOwner(owner_data, self)
		self._owners_cache.append(new_entity_owner)
		return new_entity_owner

	def update_owner(self, owner_data) -> None:
		"""Updates an owner. Throws an exception if the _id key is not passed in."""
		# Make sure the the _id key is provided.
		if be.ENTITY_PROPERTY_SERVER_ID not in owner_data:
			raise Exception('Owner key _id not provided in {' + str(owner_data) + '}')
		# Update the owner.
		self._owners_collection.update(owner_data)
		# TODO ; UPDATE THE CACHE!!!! Or possibly have a flag determining if an update is needed
		print('NEED TO UPDATE OWNER')
		print('UPDATE DATA IS : ' + str(owner_data))


		# Update the owner cache.
		#self._update_owners_cache()

	# TODO : save_entity_manager(self, entity_manager):

	# This function is to be manually ran only.
	def _full_reset(self):
		"""Fully deletes all the data in the quasar database."""
		self._api.clear_database('quasar')
		self._owners_cache = None
