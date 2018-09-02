# coding=utf-8

"""This module, db_entities_base.py, provides base abstractions for DB entities (tables + logic)."""

from libraries.database_api.sql_databases.sqlite import sqlite_db
from libraries.database_api.sql_databases.sqlite import table_abstraction as table
from libraries.universal_code import debugging as dbg


class DBEntity(object):
	"""Represents a DB entity, the table layout and business logic."""

	def __init__(self, table_name, many_to_many=None):
		self._table = table.TableAbstraction(table_name, many_to_many)

	def add_column_name(self, unique=True):
		"""Utility function."""
		self._table.add_column_standard_string('name', unique)

	def add_column_primary_id(self):
		"""Utility function."""
		self._table.add_column_row_id_alias(self._table.name_id)

	def get_id_by_name(self, project_name):
		"""Returns a project by project_name specified."""
		return self._table.get_value(self._table.name_id, 'name', project_name)

	@property
	def name_id(self):
		"""Returns the primary key name."""
		return self._table.name_id

	@property
	def name(self):
		"""Returns the name of this table."""
		return self._table.name

	@property
	def table(self):
		"""Returns the table object of this DB Entity."""
		return self._table

	@property
	def table_id(self):
		"""Returns the table ID of this DB Entity."""
		return self._table.table_id


class DBEntityCodeProject(DBEntity):
	"""Represents a CodeProject."""

	def __init__(self, many_to_many=None):
		super().__init__('code_projects', many_to_many)
		self.add_column_name()
		self.add_column_primary_id()


class DBEntityApplication(DBEntity):
	"""Represents an Application."""

	def __init__(self, many_to_many=None):
		super().__init__('applications', many_to_many)
		self.add_column_name()
		self.add_column_primary_id()


class DBEntityLibrary(DBEntity):
	"""Represents a Library."""

	def __init__(self, many_to_many=None):
		super().__init__('libraries', many_to_many)
		self.add_column_name()
		self.add_column_primary_id()


class DBEntityThirdPartyLibrary(DBEntity):
	"""Represents a Library."""

	def __init__(self, many_to_many=None):
		super().__init__('third_party_libraries', many_to_many)
		self.add_column_name()
		self.add_column_primary_id()
		#
		self._table.add_column_standard_string('git_repo_url', unique=True)
		self._table.add_column_standard_integer('cached_version')
		self._table.add_column_standard_string('path_to_library', unique=True)
		self._table.add_column_datetime('last_checked')


class DBEntityBuildProcess(DBEntity):
	"""Represents a build process."""

	ACTION_NONE   = 0
	ACTION_BUILD  = 1
	ACTION_UPDATE = 2

	def __init__(self, many_to_many=None):
		super().__init__('build_processes', many_to_many)
		self.add_column_name()
		self.add_column_primary_id()
		#
		self._table.add_column_standard_integer('owner_id')
		self._table.add_column_standard_integer('owner_table_id')

