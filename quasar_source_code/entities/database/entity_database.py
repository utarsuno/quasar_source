# coding=utf-8

"""This module, entity_database.py, contains a database api layer for entity objects."""

from quasar_source_code.database_api import postgresql_api as db_api
from quasar_source_code.database_api import database_tables as db_t
from quasar_source_code.entities import base_entity as be
from quasar_source_code.universal_code import debugging as dbg
from quasar_source_code.entities.entity_manager import EntityManager

from quasar_source_code.universal_code import time_abstraction as ta

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

		# TODO : decide if the additional fields should stay in the Owner Entity or if should be placed into the Owner database table.
		#self._owners.add_table_field(db_t.TableFieldString('phone_number', maximum_length=15, default=None))

		# Table containing entity_managers which contain entities.
		self._entity_managers = db_t.DatabaseTable('entity_managers', self._api)
		self._entity_managers.add_table_field(db_t.TableFieldInteger('manager_id', maximum_value=1000000, auto_increment=False))
		self._entity_managers.add_table_field(db_t.TableFieldBinary('manager'))

		# TODO : Eventually move the location of the health checks call.
		self.health_checks()

		# Owner cache.
		self.cache_owners = self._owners.get_row_values()

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
		file_data = file.read()
		file.close()

		#print('DOES THE DATABASE HAVE THE CURRENT MANAGER ID: ' + str(entity_manager.manager_id))
		manager_exists = self._entity_managers.has_value('manager_id', entity_manager.manager_id)
		if manager_exists:
			#print('IT DOES')
			y = 2
		else:
			print('ERROR?!?! Manager does not exist?')
			#print('IT DOES NOT!')

		if not manager_exists:
			cursor = self._api.get_cursor()
			cursor.execute('INSERT INTO entity_managers(manager_id, manager) VALUES (%s, %s);', (entity_manager.manager_id, psycopg2.Binary(file_data)))
		else:
			self._entity_managers.update_row_with_value('manager_id', entity_manager.manager_id, 'manager', str(psycopg2.Binary(file_data)))

		# Old code to delete later
		# #self._entity_managers.delete_row_with_value('manager_id', entity_manager.manager_id)
		self._api.commit()

	# TODO : create delete_owner

	def create_owner(self, name: str, password: str, email: str):
		"""Places an owner into the owners table."""
		self._owners.insert_row({'name': name, 'password': password, 'email': email})

		# Get the owners info.
		owner = self.get_owner(name)

		# Create the manager here.
		manager = EntityManager(manager_id=owner[INDEX_OWNER_MANAGER_ID], owner_id=owner[INDEX_OWNER_ID])

		# Create the owner entity here!
		owner_entity = be.Entity('OwnerEntity')
		owner_entity._class_name = 'EntityOwner'
		owner_entity.add_information('owner_username', name)
		owner_entity.add_information('owner_email', email)
		owner_entity.add_information('owner_phone_number', '')
		owner_entity.add_information('owner_phone_carrier', '')
		owner_entity.add_information('owner_created_at_date', str(ta.get_now()))
		owner_entity.add_information('owner_id', str(owner[INDEX_OWNER_ID]))

		manager.add_entities(owner_entity)

		self.save_entity_manager(manager)

		self._update_owner_cache()

	def _update_owner_cache(self):
		"""Updates the internal list of owners."""
		self.cache_owners = self._owners.get_row_values()

	def get_all_owners(self):
		"""Returns a list of all the owners."""
		return self.cache_owners

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
		for em in results:
			#print(str(em) + '\t\t' + str(manager_id))
			if em[0] == manager_id:
				return dill.loads(em[1].tobytes())
		#self._api.execute_query('SET CLIENT_ENCODING TO LATIN1', save=True)
		#result = self._entity_managers.get_single_value('manager', 'manager_id', manager_id)
		#if result is not None:
		#	return dill.loads(result.tobytes())
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
#print(e._api.execute_query_and_get_all_results('SELECT * FROM entity_managers'))
#print(e._api.get_all_table_names())
#print(e.get_all_owners())
#e._full_reset()


#print(e._owners.get_row_values())
#print(e._entity_managers.get_row_values())
