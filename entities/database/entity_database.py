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

class EntityDatabaseAPI(object):
	"""An API for Entity database operations."""

	def __init__(self, debug=False):
		self._debug             = debug
		self._api               = db_api.MongoDBAPI()
		self._owners_collection = self._api.get_collection('owners')

	def get_all_database_data_as_list_of_dictionaries(self) -> list:
		"""Returns all the database data as a list where each element is a python dictionary of that database entry."""
		return self._owners_collection.get_all()

	def update_owner(self, username, json_data):
		"""Updates the owner by username match with the provided json data."""
		#self._db_api._update_owner(username, json_data)


	def get_owner_id(self, username):
		"""Gets the owner id object by owner username match."""
		return self._owners_collection.find(be.ENTITY_DEFAULT_PROPERTY_RELATIVE_ID)

	def create_owner(self, owner_data):
		"""Creates the owner."""
		self._owners_collection.insert_one(owner_data)

	def delete_owner(self, username):
		"""Deletes the owner by username match."""
		self._owners_collection.delete_many(be.ENTITY_PROPERTY_USERNAME, username)

	# OLD CODE BELOW
	# OLD CODE BELOW
	# OLD CODE BELOW

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

	def get_all_database_raw_data(self):
		"""Returns the raw data of the database."""
		entities = self._owners_collection.get_all()
		text = ''
		for e in entities:
			#print(e)
			print(type(e))
			print(str(e))
			text += str(e) + '\n'
		return text

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
