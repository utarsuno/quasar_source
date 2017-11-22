# coding=utf-8

"""This module, entity_database.py, contains a database api layer for entity objects."""

import dill
import psycopg2

from quasar_source_code.database_api.nosql_databases import mongodb_api as db_api

from quasar_source_code.database_api.sql_databases import database_tables as db_t
from quasar_source_code.entities import base_entity as be
from quasar_source_code.entities.entity_manager import EntityManager
from quasar_source_code.universal_code import debugging as dbg
from quasar_source_code.universal_code import time_abstraction as ta

'''  __       ___       __        __   ___          __
	|  \  /\   |   /\  |__)  /\  /__` |__      /\  |__) |    .
	|__/ /~~\  |  /~~\ |__) /~~\ .__/ |___    /~~\ |    |    .
'''

# Utility indexes.
INDEX_OWNER_NAME       = 0
INDEX_OWNER_PASSWORD   = 1
INDEX_OWNER_EMAIL      = 2
INDEX_OWNER_ID         = 3
INDEX_OWNER_MANAGER_ID = 4

# Owner dictionary key mappings.
OWNER_KEY_NAME      = 'name'
OWNER_KEY_PASSWORD  = 'password'
OWNER_KEY_EMAIL     = 'email'
OWNER_KEYS_REQUIRED = [OWNER_KEY_PASSWORD, OWNER_KEY_NAME, OWNER_KEY_EMAIL]


class EntityDatabaseAPI(object):
	"""An API for Entity database operations."""

	def __init__(self, debug=False):
		self._debug             = debug
		self._api               = db_api.MongoDBAPI()
		self._owners_collection = self._api.get_collection('owners')

		# TODO : Implement owners cache.
		#self.owners_cache       = []

	def get_all_owners(self):
		"""Gets all the owners from the database."""
		return self._owners_collection.get_all()

	def is_valid_owner(self, owner_name, owner_password) -> bool:
		"""Returns a boolean indicating if the owner name and password combination maps to a valid owner."""
		owners = self.get_all_owners()
		for o in owners:
			if o[OWNER_KEY_NAME] == owner_name and o[OWNER_KEY_PASSWORD] == owner_password:
				return True
		return False

	def create_owner(self, owner_data) -> None:
		"""Creates an owner. Throws an exception if the required attributes are not provided."""
		for required_key in OWNER_KEYS_REQUIRED:
			if required_key not in owner_data:
				raise Exception('Owner key ' + required_key + ' not provided in {' + str(owner_data) + '}!')
		self._owners_collection.insert(owner_data)

	def connect(self):
		"""Connect to the database."""
		self._api.connect()

	def terminate(self):
		"""Cleanly exit the connection from the database."""
		self._api.terminate()

	# TODO : save_entity_manager(self, entity_manager):

	# TODO : create_owner(self, name: str, password: str, email: str):
