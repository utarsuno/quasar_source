# coding=utf-8

"""This module, db_entities_base.py, provides base abstractions for DB entities (tables + logic)."""

from libraries.database_abstraction.sql.sqlite import table_abstraction as table


def util_get_library_data(name, version, directory_path, is_third_party, git_repo_url, version_last_checked):
	"""Utility function."""
	return {
		DBEntity.KEY_NAME                       : name,
		DBEntityLibrary.KEY_VERSION             : version,
		DBEntityLibrary.KEY_DIRECTORY_PATH      : directory_path,
		DBEntityLibrary.KEY_IS_THIRD_PARTY      : is_third_party,
		DBEntityLibrary.KEY_GIT_REPO_URL        : git_repo_url,
		DBEntityLibrary.KEY_VERSION_LAST_CHECKED: version_last_checked,
	}


def util_get_build_process_data(name, owner_id, owner_table_id, process_name):
	"""Utility function."""
	return {
		DBEntity.KEY_NAME                       : name,
		DBEntityCodeProcess.KEY_OWNER_ID       : owner_id,
		DBEntityCodeProcess.KEY_OWNER_TABLE_ID : owner_table_id,
		DBEntityCodeProcess.KEY_PROCESS_NAME   : process_name,
	}

TABLE_NID_PROJECTS                        = 'p_id'
TABLE_NID_APPLICATIONS                    = 'a_id'
TABLE_NID_LIBRARIES                       = 'l_id'
TABLE_NID_CODE_PROCESSES                  = 'cp_id'
TABLE_NID_FILES                           = 'f_id'
TABLE_NAME_PROJECTS                       = 'projects'
TABLE_NAME_APPLICATIONS                   = 'applications'
TABLE_NAME_LIBRARIES                      = 'libraries'
TABLE_NAME_CODE_PROCESSES                 = 'code_processes'
TABLE_NAME_FILES                          = 'files'
TABLE_NAME_APPLICATIONS_TO_PROJECTS       = TABLE_NAME_APPLICATIONS   + '_to_' + TABLE_NAME_PROJECTS
TABLE_NAME_LIBRARIES_TO_APPLICATIONS      = TABLE_NAME_LIBRARIES      + '_to_' + TABLE_NAME_APPLICATIONS
TABLE_NAME_CODE_PROCESSES_TO_APPLICATIONS = TABLE_NAME_CODE_PROCESSES + '_to_' + TABLE_NAME_APPLICATIONS
TABLE_NAME_CODE_PROCESSES_TO_LIBRARIES    = TABLE_NAME_CODE_PROCESSES + '_to_' + TABLE_NAME_LIBRARIES


class DBEntity(object):
	"""Represents a DB entity, the table layout and business logic."""

	KEY_NAME = 'name'

	def __init__(self, table_name, many_to_many=None):
		self._table = table.TableAbstraction(table_name, many_to_many)

	def add_standard_index_and_name(self):
		"""Utility function."""
		self._table.add_column_string(DBEntity.KEY_NAME, unique=True, nullable=False, indexed=False)
		self._table.add_column_row_id_alias()

	def get_id_by_name(self, project_name):
		"""Returns a project by project_name specified."""
		return self._table.get_value(self._table.name_id, DBEntity.KEY_NAME, project_name)

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
		super().__init__(TABLE_NAME_PROJECTS, many_to_many)
		self.add_standard_index_and_name()


class DBEntityApplication(DBEntity):
	"""Represents an Application."""

	def __init__(self, many_to_many=None):
		super().__init__(TABLE_NAME_APPLICATIONS, many_to_many)
		self.add_standard_index_and_name()


class DBEntityLibrary(DBEntity):
	"""Represents a Library."""

	KEY_VERSION              = 'version'
	KEY_DIRECTORY_PATH       = 'directory_path'
	KEY_IS_THIRD_PARTY       = 'is_third_party'
	KEY_GIT_REPO_URL         = 'git_repo_url'
	KEY_VERSION_LAST_CHECKED = 'version_last_checked'

	def __init__(self, many_to_many=None):
		super().__init__(TABLE_NAME_LIBRARIES, many_to_many)
		self.add_standard_index_and_name()
		# Library specific.
		self._table.add_column_string(DBEntityLibrary.KEY_VERSION, unique=False, nullable=True, indexed=False)
		self._table.add_column_string(DBEntityLibrary.KEY_DIRECTORY_PATH, unique=True, nullable=False, indexed=False)
		# Third party specific.
		self._table.add_column_boolean(DBEntityLibrary.KEY_IS_THIRD_PARTY, unique=False, nullable=False, indexed=False)
		self._table.add_column_string(DBEntityLibrary.KEY_GIT_REPO_URL, unique=True, nullable=True, indexed=False)
		self._table.add_column_datetime(DBEntityLibrary.KEY_VERSION_LAST_CHECKED, unique=False, nullable=True, indexed=False)


class DBEntityCodeProcess(DBEntity):
	"""Represents a build process."""

	KEY_OWNER_ID       = 'owner_id'
	KEY_OWNER_TABLE_ID = 'owner_table_id'
	KEY_PROCESS_NAME   = 'process_name'

	def __init__(self):
		super().__init__(TABLE_NAME_CODE_PROCESSES)
		self.add_standard_index_and_name()
		# Build process specific.
		self._table.add_column_integer(DBEntityCodeProcess.KEY_OWNER_ID, unique=False, nullable=False, indexed=False)
		self._table.add_column_integer(DBEntityCodeProcess.KEY_OWNER_TABLE_ID, unique=False, nullable=False, indexed=False)
		self._table.add_column_string(DBEntityCodeProcess.KEY_PROCESS_NAME, unique=True, nullable=False, indexed=False)


class DBEntityFile(DBEntity):
	"""Represents a project file."""

	KEY_FILE_TYPE          = 'file_type'
	KEY_SIZE               = 'size'
	KEY_PATH               = 'path'
	KEY_MD5SUM             = 'md5sum'
	#
	KEY_NEEDS_MINIFICATION = 'needs_minification'
	KEY_NEEDS_GZIP         = 'needs_gzip'
	KEY_NEEDS_LZ           = 'needs_lz'
	KEY_PARENT_F_ID        = 'parent_f_id'
	KEY_CHILD_F_ID         = 'child_f_id'
	#
	KEY_CONTENT            = 'content'

	def __init__(self):
		super().__init__(TABLE_NAME_FILES)
		self._table.add_column_row_id_alias()
		# File specific.
		self._table.add_column_string(DBEntityFile.KEY_FILE_TYPE, unique=False, nullable=False, indexed=False)
		self._table.add_column_integer(DBEntityFile.KEY_SIZE, unique=False, nullable=False, indexed=False)
		self._table.add_column_string(DBEntityFile.KEY_PATH, unique=True, nullable=False)
		self._table.add_column_string(DBEntityFile.KEY_MD5SUM, unique=False, nullable=True, indexed=False)
		#
		self._table.add_column_boolean(DBEntityFile.KEY_NEEDS_MINIFICATION, unique=False, nullable=False, indexed=False)
		self._table.add_column_boolean(DBEntityFile.KEY_NEEDS_GZIP, unique=False, nullable=False, indexed=False)
		self._table.add_column_boolean(DBEntityFile.KEY_NEEDS_LZ, unique=False, nullable=False, indexed=False)
		self._table.add_column_integer(DBEntityFile.KEY_PARENT_F_ID, unique=False, nullable=True, indexed=False)
		self._table.add_column_integer(DBEntityFile.KEY_CHILD_F_ID, unique=False, nullable=True, indexed=False)
		#
		self._table.add_column_string(DBEntityFile.KEY_CONTENT, unique=False, nullable=True, indexed=False)
