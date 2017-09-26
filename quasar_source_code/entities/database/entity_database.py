# coding=utf-8

"""This module, entity_database.py, contains a database api layer for entity objects."""

from quasar_source_code.database_api import postgresql_api as db_api
from quasar_source_code.database_api import database_tables as db_t
from quasar_source_code.entities import base_entity as be

# Python PostgreSQL database library.
import psycopg2
# Python objects to binary data.
import dill

'''  __       ___       __        __   ___          __
	|  \  /\   |   /\  |__)  /\  /__` |__      /\  |__) |    .
	|__/ /~~\  |  /~~\ |__) /~~\ .__/ |___    /~~\ |    |    .
'''


class EntityDatabaseAPI(object):
	"""An API for Entity database operations."""

	def __init__(self):
		self._api = db_api.PostgreSQLAPI()
		self._connected = False

		# Owners table.
		self._owners       = db_t.DatabaseTable('owners', self._api)
		self._owners.add_table_field(db_t.TableFieldString('name', 100))
		self._owners.add_table_field(db_t.TableFieldInteger('owner_id', maximum_value=1000000, auto_increment=False))
		self._owners.add_table_field(db_t.TableFieldInteger('manager_id', maximum_value=1000000, auto_increment=False))

		# Table containing entity_managers which contain entities.
		self._entity_managers_table = db_t.DatabaseTable('entity_managers', self._api)
		self._entity_managers_table.add_table_field(db_t.TableFieldInteger('manager_id', maximum_value=1000000, auto_increment=False))
		self._entity_managers_table.add_table_field(db_t.TableFieldBinary('manager'))

		# TODO : Eventually move the location of the health checks call.
		self.health_checks()

	def health_checks(self):
		"""Runs database health checks and applies automatic fixes."""
		# Connects to database if not yet connected.
		self._check_if_connected()

		# Check that all our needed tables exist.
		self._owners.create_if_does_not_exist()
		self._entity_managers_table.create_if_does_not_exist()

	def save_entity_manager(self, entity_manager):
		"""Saves an entity manager object into the database."""
		# TODO : Make this method more elegant.
		file_name = 'entity_manager_' + str(entity_manager.manager_id) + '.db'
		with open(file_name, 'wb') as f:
			dill.dump(entity_manager, f)
		file = open(file_name, 'rb')
		cursor = self._api.get_cursor()
		file_data = file.read()
		file.close()
		self._entity_managers_table.delete_row_with_value('manager_id', entity_manager.manager_id)
		cursor.execute('INSERT INTO entity_managers(manager_id, manager) VALUES (%s, %s);', (entity_manager.manager_id, psycopg2.Binary(file_data)))
		self._api.commit()

	def get_all_owners(self):
		"""Returns a list of all the owners."""
		y = 2
		# TODO : !!!

	def get_entity_manager(self, manager_id):
		"""Returns the Entity Manager from the database by id, returns None if not found."""
		results = self._entity_managers_table.get_row_values()
		for r in results:
			if r[0] == manager_id:
				return dill.loads(r[1].tobytes())
		return None

	def _check_if_connected(self):
		"""Connects if the database is not connected."""
		if not self._connected:
			self._api.connect()
			self._connected = True

	def terminate(self):
		"""Terminates the database connection if there is one."""
		if self._connected:
			self._api.terminate()
