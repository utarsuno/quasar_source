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
		self._owners_collection.collection.find_one_and_replace({be.ENTITY_PROPERTY_USERNAME: username}, json_data)

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

	# This function is to be manually ran only.
	def _full_reset(self):
		"""Fully deletes all the data in the quasar database."""
		self._api.clear_database('quasar')
		self._owners_cache = None
