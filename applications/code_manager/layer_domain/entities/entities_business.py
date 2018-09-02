# coding=utf-8

"""This module, db_entities_base.py, provides base abstractions for DB entities (tables + logic)."""

#from libraries.database_api.sql_databases.sqlite import sqlite_db
#from libraries.database_api.sql_databases.sqlite import table_abstraction
#from libraries.universal_code import debugging as dbg


class BusinessEntity(object):
	"""Represents a DB entity, the table layout and business logic."""

	def __init__(self, parent_table):
		self._table                     = parent_table
		self._default_many_to_many_rows = {}
		#self._id                        = None

	def add_default_many_to_many_data(self, db_entity, name_match):
		"""Utility function."""
		self._default_many_to_many_rows[db_entity.name] = [db_entity, name_match]

	def load_many_to_many_data(self, db):
		"""Utility function."""
		#table_name = self._table.name + '_to_' +
		for table in self._default_many_to_many_rows:
			table_name = self._table.name + '_to_' + table
			t = db.get_table(table_name)

			t.insert({
				self._table.name_id: self.get_id(),
				self._default_many_to_many_rows[table][0].name_id:
					self._default_many_to_many_rows[table][0].table.get_value(
						self._default_many_to_many_rows[table][0].name_id,
						'name', self._default_many_to_many_rows[table][1]
					)
			}, dne_check=True)

	def get_id(self):
		"""Implemented by child objects."""
		pass

	def load(self):
		"""Loads this entity if not already loaded."""
		pass

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


class CodeProject(BusinessEntity):
	"""Represents a CodeProject."""
	def __init__(self, parent_table, project_name):
		super().__init__(parent_table)
		self.project_name = project_name

	def get_id(self):
		"""Gets the ID of this business entity instance."""
		return self._table.get_value(self._table.name_id, 'name', self.project_name)

	def load(self):
		"""Loads this project if not already loaded."""
		self._table.insert({'name': self.project_name}, dne_check=True)


class Application(BusinessEntity):
	"""Represents an Application."""
	def __init__(self, parent_table, application_name):
		super().__init__(parent_table)
		self.application_name = application_name

	def get_id(self):
		"""Gets the ID of this business entity instance."""
		return self._table.get_value(self._table.name_id, 'name', self.application_name)

	def load(self):
		"""Loads this application if not already loaded."""
		self._table.insert({'name': self.application_name}, dne_check=True)


class Library(BusinessEntity):
	"""Represents a Library."""
	def __init__(self, parent_table, library_name):
		super().__init__(parent_table)
		self.library_name = library_name

	def get_id(self):
		"""Gets the ID of this business entity instance."""
		return self._table.get_value(self._table.name_id, 'name', self.library_name)

	def load(self):
		"""Loads this application if not already loaded."""
		self._table.insert({'name': self.library_name}, dne_check=True)


class ThirdPartyLibrary(BusinessEntity):
	"""Represents a Library."""
	def __init__(self, parent_table, data):
		super().__init__(parent_table)
		self.library_name  = data['name']
		self.data          = data
		self.cache_checker = None

	def get_id(self):
		"""Gets the ID of this business entity instance."""
		return self._table.get_value(self._table.name_id, 'name', self.library_name)

	def load(self):
		"""Loads this application if not already loaded."""
		self._table.insert(self.data, dne_check=True)
		#self._table.insert({'name': self.library_name}, dne_check=True)

	def set_cache_checker(self, cache_checker):
		"""Sets the cache checker object."""
		self.cache_checker = cache_checker


class BuildProcess(BusinessEntity):
	"""Represents a build process."""
	def __init__(self, parent_table):
		super().__init__(parent_table)


