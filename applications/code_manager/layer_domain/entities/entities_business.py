# coding=utf-8

"""This module, db_entities_base.py, provides base abstractions for DB entities (tables + logic)."""

#from libraries.database_abstraction.sql.sqlite import sqlite_db
#from libraries.database_abstraction.sql.sqlite import table_abstraction
#from libraries.universal_code import debugging as dbg
from libraries.database_abstraction.sql.query_abstraction import sql_query as sql
from applications.code_manager.layer_domain.entities import entities_db
from libraries.universal_code import output_coloring as oc
from libraries.universal_code import useful_file_operations as ufo

# Utility globals.
KEY_NAME           = entities_db.DBEntity.KEY_NAME
#
KEY_VERSION              = entities_db.DBEntityLibrary.KEY_VERSION
KEY_DIRECTORY_PATH       = entities_db.DBEntityLibrary.KEY_DIRECTORY_PATH
KEY_IS_THIRD_PARTY       = entities_db.DBEntityLibrary.KEY_IS_THIRD_PARTY
KEY_GIT_REPO_URL         = entities_db.DBEntityLibrary.KEY_GIT_REPO_URL
KEY_VERSION_LAST_CHECKED = entities_db.DBEntityLibrary.KEY_VERSION_LAST_CHECKED
#
KEY_FILE_TYPE          = entities_db.DBEntityFile.KEY_FILE_TYPE
KEY_SIZE               = entities_db.DBEntityFile.KEY_SIZE
KEY_PATH               = entities_db.DBEntityFile.KEY_PATH
KEY_MD5SUM             = entities_db.DBEntityFile.KEY_MD5SUM
KEY_CACHED_AT          = entities_db.DBEntityFile.KEY_CACHED_AT
KEY_PARENT_F_ID        = entities_db.DBEntityFile.KEY_PARENT_F_ID
KEY_CHILD_F_ID         = entities_db.DBEntityFile.KEY_CHILD_F_ID
#


class BusinessEntity(object):
	"""Represents a DB entity, the table layout and business logic."""

	def __init__(self, parent_table):
		self._table                     = parent_table
		self._default_many_to_many_rows = {}
		self.linked_code_processes      = []

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

	def execute(self, query):
		"""Returns the results of the provided query executed."""
		return self._table.execute(query)


class Library(BusinessEntity):
	"""Represents a Library."""
	def __init__(self, parent_table, default_data):
		super().__init__(parent_table)
		self.default_data = default_data

	def needs_version_update_check(self):
		"""Returns a boolean indicating if this library's version was checked over a day ago."""
		current_version_last_checked = self._table.get_value(
			KEY_VERSION_LAST_CHECKED,
			'l_id',
			self.get_id()
		)
		if current_version_last_checked is None:
			return True

		query = sql.Query().SELECT_COUNT().FROM(self._table.name).WHERE({
			'l_id': self.get_id(),
			'version_last_checked': sql.DISCRETE_MORE_THAN_ONE_DAY_OLD
		})
		rows = self._table.db.execute_query(query)
		needs_update = rows == 1

		return needs_update

	def update_version(self, v):
		"""Updates this library's version."""
		#self._table.update_value(KEY_CHILD_F_ID, child_id, KEY_PATH, self.path)
		self._table.update_value(KEY_VERSION, v, self._table.name_id, self.get_id())
		self._table.update_value(KEY_VERSION_LAST_CHECKED, sql.SQL_VALUE_NOW, self._table.name_id, self.get_id())

	@property
	def library_name(self):
		"""Returns this library's name."""
		return self.default_data[KEY_NAME]

	@property
	def version(self):
		"""Returns this library's stored version."""
		return self._table.get_value(entities_db.DBEntityLibrary.KEY_VERSION, KEY_NAME, self.library_name)

	@property
	def version_last_checked(self):
		"""Returns this library's stored date on when the version was last checked."""
		return self._table.get_value(entities_db.DBEntityLibrary.KEY_VERSION_LAST_CHECKED, KEY_NAME, self.library_name)

	def get_id(self):
		"""Gets the ID of this business entity instance."""
		return self._table.get_value(self._table.name_id, KEY_NAME, self.library_name)

	def load(self):
		"""Loads this application if not already loaded."""
		self._table.insert_if_does_not_exist(self.default_data, {KEY_NAME: self.library_name})


class File(BusinessEntity):
	"""Represents a file."""

	def __init__(self, parent_table, file_data):
		super().__init__(parent_table)
		self.file_data = file_data

		if self.md5sum == 'CALCULATE':
			self.md5sum = ufo.file_get_md5_checksum(self.path)
		if self.size == 'CALCULATE':
			self.size = ufo.file_get_size_in_bytes(self.path)

		self.generated_children_directory = None
		self.file_object                  = None
		self.new_md5sum                   = None
		self.new_size                     = None

	def set_file_object(self, o):
		"""Sets the file object, used for performing minification."""
		self.file_object = o

	def set_generated_children_directory(self, d):
		"""Sets the directory that generated children files should be placed into."""
		self.generated_children_directory = d

	def load(self):
		"""Loads this build process if not already loaded."""
		self._table.insert_if_does_not_exist(
			{
				KEY_FILE_TYPE   : self.file_type,
				KEY_SIZE        : self.size,
				KEY_PATH        : self.path,
				KEY_MD5SUM      : self.md5sum,
				KEY_CACHED_AT   : self.cached_at,
				KEY_PARENT_F_ID : self.parent_f_id,
				KEY_CHILD_F_ID  : self.child_f_id
			},
			{KEY_PATH: self.path}
		)

	def perform_update(self):
		"""Updates this file (occurs when the md5sum has changed)."""
		# TODO: Improve efficiency.
		self._update_md5sum()
		self._update_size()

	def set_child_file(self, f):
		"""Sets the child file."""
		child_id = f.get_id()
		self._table.update_value(KEY_CHILD_F_ID, child_id, KEY_PATH, self.path)
		self.file_data[KEY_CHILD_F_ID] = child_id

	def set_parent_file(self, f):
		"""Sets the parent file."""
		parent_id = f.get_id()
		self._table.update_value(KEY_PARENT_F_ID, parent_id, KEY_PATH, self.path)
		self.file_data[KEY_PARENT_F_ID] = parent_id

	@property
	def cached_at(self):
		"""Returns the cached_at date of this file."""
		#return self._table.get_value(KEY_CACHED_AT, KEY_PATH, self.path)
		return self.file_data[KEY_CACHED_AT]

	@property
	def file_type(self):
		"""Returns the file type of this file."""
		return self.file_data[KEY_FILE_TYPE]

	@property
	def size(self):
		"""Returns the size of this file."""
		return self.file_data[KEY_SIZE]

	@size.setter
	def size(self, v):
		"""Sets the size value."""
		self.file_data[KEY_SIZE] = v

	@property
	def path(self):
		"""Returns the path of this file."""
		return self.file_data[KEY_PATH]

	@property
	def md5sum(self):
		"""Returns the md5sum of this file."""
		return self.file_data[KEY_MD5SUM]

	@md5sum.setter
	def md5sum(self, v):
		"""Sets the md5sum value."""
		self.file_data[KEY_MD5SUM] = v

	@property
	def parent_f_id(self):
		"""Returns the parent f_id of this file."""
		return self.file_data[KEY_PARENT_F_ID]

	@property
	def child_f_id(self):
		"""Returns the child f_id of this file."""
		return self.file_data[KEY_CHILD_F_ID]

	def get_id(self):
		"""Gets the ID of this file instance."""
		return self._table.get_value(self._table.name_id, KEY_PATH, self.path)

	def _set_current_md5sum(self):
		"""Utility function."""
		if self.new_md5sum is None:
			self.new_md5sum = ufo.file_get_md5_checksum(self.path)

	def _update_size(self):
		"""Utility function."""
		if self.new_size is None:
			self.new_size = ufo.file_get_size_in_bytes(self.path)
		self._table.update_value(KEY_SIZE, self.new_size, KEY_PATH, self.path)
		self.size = self.new_size

	def _update_md5sum(self):
		"""Utility function."""
		self._set_current_md5sum()
		self._table.update_value(KEY_MD5SUM, self.new_md5sum, KEY_PATH, self.path)
		self.md5sum = self.new_md5sum

	def md5sum_changed(self):
		"""Returns a boolean indicating if the md5sum changed for this file."""
		self._set_current_md5sum()
		return self.md5sum != self.new_md5sum



