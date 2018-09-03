# coding=utf-8

"""This module, db_entities_base.py, provides base abstractions for DB entities (tables + logic)."""

from libraries.database_abstraction.sql.sqlite import sqlite_db
from libraries.database_abstraction.sql.sqlite import table_abstraction as table
from libraries.universal_code import debugging as dbg


class DBEntitySpecificInstance(object):
	"""Adds functionality to represent a specific instance of a DBEntity."""

	def __init__(self, instance_name):
		self._instance_name = instance_name

	def get_parent_id(self):
		"""Returns the row_id of the parent."""
		return self.parent.table.get_value(self.parent_key, 'name', self.parent.name)

	def ensure_self_row_exists(self):
		"""Utility function."""
		if self._parent is not None:
			self._table.insert_if_does_not_exist({self.parent_key: self.get_parent_id(), 'name': self._instance_name}, {'name': self._instance_name})
		else:
			self._table.insert_if_does_not_exist({'name': self._instance_name}, {'name': self._instance_name})

	@property
	def name(self):
		"""Returns the instance name."""
		return self._instance_name


class DBEntity(object):
	"""Represents a DB entity, the table layout and business logic."""

	def __init__(self, table_name, parent_db_entity=None):
		self._table      = table.TableAbstraction(table_name)
		self._parent     = parent_db_entity
		self._parent_key = None
		self._children   = []

		if parent_db_entity is not None:
			self._table.add_column_foreign_key(self.parent.table.primary_key)
			self._parent.add_child(self)

	def get_parent_foreign_key_name(self):
		"""Utility function."""
		return self.parent.table.primary_key.name

	def ensure_data(self):
		"""Ensures any data that needs to exist, does."""
		pass

	def delete(self):
		"""Deletes all the data of this DB Entity."""
		self._table.delete()

	def load_children(self, db=None):
		"""Loads the children DB Entities of this Entity."""
		for c in self._children:
			c.initial_load(db)

	def initial_load(self, db=None):
		"""Loads this DB Entity and all children of it."""
		if db is None:
			db = self._db

		db.add_table(self._table)
		self._table.create()

		if self._parent is not None:
			self._parent_key = self.get_parent_foreign_key_name()

		self.ensure_data()
		self.load_children(db)

	def add_child(self, db_entity):
		"""Adds a children DBEntity to this DBEntity."""
		self._children.append(db_entity)

	@property
	def children(self):
		"""Returns the children DBEntities of this DBEntity."""
		return self._children

	@property
	def parent_key(self):
		"""Returns the parent primary key."""
		return self._parent_key

	@property
	def parent(self):
		"""Returns the parent DBEntity of this DBEntity."""
		return self._parent

	@property
	def table(self):
		"""Returns the table object of this DB Entity."""
		return self._table


class DBEntityCodeProject(DBEntity):
	"""Represents a code project."""

	def __init__(self, db_location, debug_on=False):
		DBEntity.__init__(self, 'code_projects')
		self._db_location    = db_location
		self._db             = sqlite_db.SQLiteDB(self._db_location, debug_on)
		self._db.connect()

		self._table.add_column_string('name')
		self._table.add_column_row_id_alias()


class DBEntityMicroService(DBEntity):
	"""Represents a micro-service (one or more services make up a code project)."""

	def __init__(self, parent_code_project):
		DBEntity.__init__(self, 'micro_services', parent_code_project)
		self._table.add_column_string('name')
		self._table.add_column_row_id_alias()


class DBEntityCodeProcess(DBEntity):
	"""Represents a code process belonging to a micro-service."""

	def __init__(self, parent_micro_service):
		DBEntity.__init__(self, 'micro_services', parent_micro_service)
		self._table.add_column_string('name')
		self._table.add_column_row_id_alias()


class DBEntitySubCodeProcess(DBEntity):
	"""Represents a sub build process belonging to a build process."""

	def __init__(self, parent_build_process):
		DBEntity.__init__(self, 'sub_build_processes', parent_build_process)
		self._table.add_column_string('name')
		self._table.add_column_row_id_alias()


class DBEntitySourceFile(DBEntity):
	"""Represents a source file."""

	def __init__(self, project_files):
		DBEntity.__init__(self, 'source_files', project_files)
		self._table.add_column_row_id_alias()
		self._table.add_column_integer('md5sum')

	def cache_file(self, f, pf_id):
		"""Caches the provided file."""
		self._table.insert({'pf_id': pf_id, 'md5sum': f.md5sum})

	def has_pf_id(self, pf_id):
		"""Returns a boolean indicating if there is a row with a matched pf_id value."""
		return self._table.has_value('pf_id', pf_id)

	def update_md5sum(self, f, sf_id):
		"""Updates the md5sum value for this source file."""
		self._table.update_value('md5sum', f.md5sum, 'sf_id', sf_id)

	def get_sf_id_from_pf_id(self, pf_id):
		"""Utility function."""
		return self._table.get_value('sf_id', 'pf_id', pf_id)


class DBEntityGeneratedFile(DBEntity):
	"""Represents a generated file."""

	def __init__(self, project_files):
		DBEntity.__init__(self, 'generated_files', project_files)
		self._table.add_column_row_id_alias()
		self._table.add_column_integer('parent_key')
		self._table.add_column_integer('parent_is_generated')

	def cache_file(self, pf_id, parent_file_id, parent_is_generated):
		"""Caches the generated file."""
		if parent_is_generated:
			self._table.insert({'pf_id': pf_id, 'parent_key': parent_file_id, 'parent_is_generated': 1})
		else:
			self._table.insert({'pf_id': pf_id, 'parent_key': parent_file_id, 'parent_is_generated': 0})
		return self._table.get_value('gf_id', 'pf_id', pf_id)

	def has_pf_id(self, pf_id):
		"""Returns a boolean indicating if there is a row with a matched pf_id value."""
		return self._table.has_value('pf_id', pf_id)

	def get_pf_id(self, full_path):
		"""Gets the pf_id from the full_path."""
		return self._table.get_value('pf_id', 'full_path', full_path)


class DBEntityProjectFile(DBEntity):
	"""Represents a project file (the metadata)."""

	def __init__(self):
		DBEntity.__init__(self, 'project_files_metadata')
		self._table.add_column_row_id_alias()
		self._table.add_column_string('full_path')
		self._table.add_column_integer('size')

	def is_cached(self, full_path):
		"""Checks if the file provided is cached."""
		return self._table.has_value('full_path', full_path)

	def cache_file(self, f):
		"""Caches the provided file."""
		self._table.insert({'full_path': f.full_path, 'size': f.file_size})
		return self._table.get_value('pf_id', 'full_path', f.full_path)

	def cache_file_data(self, path, size):
		"""Caches the provided file data."""
		self._table.insert({'full_path': path, 'size': size})
		return self._table.get_value('pf_id', 'full_path', path)

	def get_file_id(self, f):
		"""Gets a file_id from the provided file."""
		return self._table.get_value('pf_id', 'full_path', f.full_path)

	def get_file_id_from_path(self, path):
		"""Gets a file_id from the provided file_path."""
		return self._table.get_value('pf_id', 'full_path', path)

	def update_file_size(self, full_path, file_size):
		"""Updates the file size."""
		self._table.update_value('size', file_size, 'full_path', full_path)

