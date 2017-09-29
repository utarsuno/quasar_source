# coding=utf-8

"""This module, entity_database.py, contains a database api layer for entity objects."""

from quasar_source_code.database_api import postgresql_api as db_api
from quasar_source_code.database_api import database_tables as db_t
from quasar_source_code.entities import base_entity as be
from quasar_source_code.universal_code import debugging as dbg
from quasar_source_code.entities.entity_manager import EntityManager

# Python PostgreSQL database library.
import psycopg2
# Python objects to binary data.
import dill

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


class EntityDatabaseAPI(object):
	"""An API for Entity database operations."""

	def __init__(self, debug=False):
		self._debug     = debug
		self._api       = db_api.PostgreSQLAPI()
		self._connected = False

		# Owners table.
		self._owners = db_t.DatabaseTable('owners', self._api)
		self._owners.add_table_field(db_t.TableFieldString('name', 100))
		self._owners.add_table_field(db_t.TableFieldString('password', 100))
		self._owners.add_table_field(db_t.TableFieldString('email', 100))
		self._owners.add_table_field(db_t.TableFieldInteger('owner_id', maximum_value=1000000, auto_increment=True))
		self._owners.add_table_field(db_t.TableFieldInteger('manager_id', maximum_value=1000000, auto_increment=True))

		# Table containing entity_managers which contain entities.
		self._entity_managers = db_t.DatabaseTable('entity_managers', self._api)
		self._entity_managers.add_table_field(db_t.TableFieldInteger('manager_id', maximum_value=1000000, auto_increment=False))
		self._entity_managers.add_table_field(db_t.TableFieldBinary('manager'))

		# TODO : Eventually move the location of the health checks call.
		self.health_checks()

	def health_checks(self):
		"""Runs database health checks and applies automatic fixes."""
		# Connects to database if not yet connected.
		self._check_if_connected()

		# Check that all our needed tables exist.
		self._owners.create_if_does_not_exist()
		self._entity_managers.create_if_does_not_exist()

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
		self._entity_managers.delete_row_with_value('manager_id', entity_manager.manager_id)
		cursor.execute('INSERT INTO entity_managers(manager_id, manager) VALUES (%s, %s);', (entity_manager.manager_id, psycopg2.Binary(file_data)))
		self._api.commit()

	def create_owner(self, name: str, password: str, email: str):
		"""Places an owner into the owners table."""
		# TODO: Remove the place holder values for manager_id
		self._owners.insert_row({'name': name, 'password': password, 'email': email})

		# Get the owners info.
		owner = self.get_owner(name)

		# Create the manager here.
		manager = EntityManager(manager_id=owner[INDEX_OWNER_MANAGER_ID], owner_id=owner[INDEX_OWNER_ID])
		self.save_entity_manager(manager)

	def get_all_owners(self):
		"""Returns a list of all the owners."""
		owners = self._owners.get_row_values()
		return owners

	def get_owner(self, owner_name):
		"""Returns the data for an owner, found by owner name."""
		# TODO : Eventually just make this into a database query...
		owners = self._owners.get_row_values()
		for o in owners:
			if o[0] == owner_name:
				return o
		return None

	def get_entity_manager(self, manager_id=-1):
		"""Returns the Entity Manager from the database by id, returns None if not found."""
		# TODO : Make this a single query...
		results = self._entity_managers.get_row_values()
		for r in results:
			if r[0] == manager_id:
				return dill.loads(r[1].tobytes())
		return None

	def _check_if_connected(self):
		"""Connects if the database is not connected."""
		if not self._connected:
			if self._debug:
				dbg.print_dashed_line()
				print('Connecting to the database...', end='')
			self._api.connect()
			self._connected = True
			if self._debug:
				print('connected!')
				dbg.print_dashed_line()

	def terminate(self):
		"""Terminates the database connection if there is one."""
		if self._connected:
			self._api.terminate()

	# This function to be manually ran only.
	def _full_reset(self):
		"""Fully resets the database data for entities."""
		self._owners.delete_if_exists()
		self._owners.create_if_does_not_exist()

		self._entity_managers.delete_if_exists()
		self._entity_managers.create_if_does_not_exist()


#e = EntityDatabaseAPI(debug=True)
#print(e._api.get_all_table_names())
#print(e.get_all_owners())
#e._full_reset()


#print(e._owners.get_row_values())
#print(e._entity_managers.get_row_values())
