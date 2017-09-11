# coding=utf-8

"""This module, entity_database.py, contains a database api layer for entity objects."""

from quasar_source_code.database_api import postgresql_api as db_api
from quasar_source_code.database_api import database_tables as db_t

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
		base_entity_table_fields = [db_t.TableFieldInteger('global_id', maximum_value=10000, auto_increment=False),
		                            db_t.TableFieldString('class_name', 30),
		                            db_t.TableFieldString('parent_ids', 1000),
		                            db_t.TableFieldString('child_ids', 1000),
		                            db_t.TableFieldString('entity_name', 100),
		                            db_t.TableFieldString('information', 10000)]
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

	def _check_if_connected(self):
		"""Connects if the database is not connected."""
		if not self._connected:
			self._api.connect()

	def terminate(self):
		"""Terminates the database connection if there is one."""
		if self._connected:
			self._api.terminate()
