# coding=utf-8

"""This module, entity_database.py, contains a database api layer for entity objects."""

from quasar_source_code.database_api import postgresql_api as db_api
from quasar_source_code.database_api import database_tables as db_t
from quasar_source_code.entities import base_entity as be

'''  __       ___       __        __   ___          __
	|  \  /\   |   /\  |__)  /\  /__` |__      /\  |__) |    .
	|__/ /~~\  |  /~~\ |__) /~~\ .__/ |___    /~~\ |    |    .
'''


class EntityDatabase(object):
	"""An API for Entity database operations."""

	def __init__(self):
		self._api = db_api.PostgreSQLAPI()
		self._connected = False

		# Owners table.
		self._owners       = db_t.DatabaseTable('owners', self._api)
		self._owners.add_table_field(db_t.TableFieldString('name', 20))
		self._owners.add_table_field(db_t.TableFieldString('entity_ids', 10000)) # 10000 is a placeholder.

		# Entity table.
		self._entity_table = db_t.DatabaseTable('entities', self._api)
		# Placeholder value limits.
		base_entity_table_fields = [db_t.TableFieldInteger(be.Entity.DB_GLOBAL_ID, maximum_value=10000, auto_increment=False),
		                            db_t.TableFieldString(be.Entity.DB_CLASS_NAME, 30),
		                            db_t.TableFieldString(be.Entity.DB_PARENT_ENTITIES, 1000),
		                            db_t.TableFieldString(be.Entity.DB_CHILD_ENTITIES, 1000),
		                            db_t.TableFieldString(be.Entity.DB_ENTITY_NAME, 100),
		                            db_t.TableFieldString(be.Entity.DB_INFORMATION, 10000)]
		for betf in base_entity_table_fields:
			self._entity_table.add_table_field(betf)

		# Entity task table.
		self._entity_task_table = db_t.DatabaseTable('entity_tasks', self._api)
		entity_task_table_fields = []
		for betf in base_entity_table_fields:
			self._entity_task_table.add_table_field(betf)

		# Entity Time table.
		self._entity_time_table = db_t.DatabaseTable('entity_times', self._api)
		entity_time_table_fields = []
		for betf in base_entity_table_fields:
			self._entity_time_table.add_table_field(betf)

		# TODO : Eventually move the location of the health checks call.
		self.health_checks()

	def health_checks(self):
		"""Runs database health checks and applies automatic fixes."""
		# Connects to database if not yet connected.
		self._check_if_connected()

		# Check that all our needed tables exist.
		self._owners.create_if_does_not_exist()
		self._entity_table.create_if_does_not_exist()
		#self._entity_task_table.create_if_does_not_exist()
		#self._entity_time_table.create_if_does_not_exist()

	def get_all_entity_data(self):
		"""Returns all the data for all the entities in the database."""
		data = []
		for r in self._entity_table.get_row_values():
			print(r)
		return data

	def create_entity(self, entity_data):
		"""Creates an Entity into the database from the entity dictionary data provided."""
		print('CREATING : ')
		class_name = entity_data['class_name']
		if class_name == be.ENTITY:
			print('Saving an entity')
			print(entity_data)
			for key in entity_data:
				if self._entity_table.get_python_data_type_of_column(key) == str:
					entity_data[key] = '"' + str(entity_data[key]).replace("'", "''") + '"'
			self._entity_table.insert_row(entity_data)
		elif class_name == be.ENTITY_TASK:
			print('Entity Task saving not yet supported')
		elif class_name == be.ENTITY_TIME:
			print('Entity Time saving not yet supported')


		#print(entity_data)
		#self._entity_table.insert_row()


	def _check_if_connected(self):
		"""Connects if the database is not connected."""
		if not self._connected:
			self._api.connect()

	def terminate(self):
		"""Terminates the database connection if there is one."""
		if self._connected:
			self._api.terminate()
