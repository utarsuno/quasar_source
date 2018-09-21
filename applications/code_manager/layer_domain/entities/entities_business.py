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
KEY_OWNER_ID       = entities_db.DBEntityCodeProcess.KEY_OWNER_ID
KEY_OWNER_TABLE_ID = entities_db.DBEntityCodeProcess.KEY_OWNER_TABLE_ID
KEY_PROCESS_NAME   = entities_db.DBEntityCodeProcess.KEY_PROCESS_NAME
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
KEY_NEEDS_MINIFICATION = entities_db.DBEntityFile.KEY_NEEDS_MINIFICATION
KEY_NEEDS_GZIP         = entities_db.DBEntityFile.KEY_NEEDS_GZIP
KEY_NEEDS_LZ           = entities_db.DBEntityFile.KEY_NEEDS_LZ
KEY_PARENT_F_ID        = entities_db.DBEntityFile.KEY_PARENT_F_ID
KEY_CHILD_F_ID         = entities_db.DBEntityFile.KEY_CHILD_F_ID
KEY_CONTENT            = entities_db.DBEntityFile.KEY_CONTENT
#


class BusinessEntity(object):
	"""Represents a DB entity, the table layout and business logic."""

	def __init__(self, parent_table):
		self._table                     = parent_table
		self._default_many_to_many_rows = {}
		self.linked_code_processes      = []

	def load_linked_code_processes(self):
		"""Loads all linked code_processes."""
		results = self.execute(sql.QueryRowsResponse().SELECT(entities_db.TABLE_NID_CODE_PROCESSES)
			.FROM(entities_db.TABLE_NAME_CODE_PROCESSES)
			.WHERE({
			KEY_OWNER_ID      : self.get_id(),
			KEY_OWNER_TABLE_ID: self.table_id
		}))
		for r in results:
			self.linked_code_processes.append(r[0])

	def run_needed_code_processes(self, domain):
		"""Runs all needed linked code_processes."""
		for cp in self.linked_code_processes:
			#print('NEED TO RUN CODE PROCESS {' + str(cp) + '}')
			code_process = domain.get_code_process_by_id(cp)
			code_process.run(domain)

	def add_default_many_to_many_data(self, db_entity, name_match):
		"""Utility function."""
		self._default_many_to_many_rows[db_entity.name] = [db_entity, name_match]

	def load_many_to_many_data(self, db):
		"""Utility function."""
		for table in self._default_many_to_many_rows:
			table_name = self._table.name + '_to_' + table
			t = db.get_table(table_name)

			db_entity = self._default_many_to_many_rows[table][0]

			t.insert({
				self._table.name_id: self.get_id(),
				db_entity.name_id: db_entity.table.get_value(
					db_entity.name_id,
					KEY_NAME, self._default_many_to_many_rows[table][1]
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

	def execute(self, query):
		"""Returns the results of the provided query executed."""
		return self._table.execute(query)


class CodeProject(BusinessEntity):
	"""Represents a CodeProject."""
	def __init__(self, parent_table, project_name):
		super().__init__(parent_table)
		self.project_name          = project_name
		self.linked_applications   = []
		self.linked_code_processes = []

	def get_id(self):
		"""Gets the ID of this business entity instance."""
		return self._table.get_value(self._table.name_id, KEY_NAME, self.project_name)

	def load(self):
		"""Loads this project if not already loaded."""
		self._table.insert({KEY_NAME: self.project_name}, dne_check=True)

	def set_all_linked_data(self):
		"""Returns all the applications linked to this CodeProject."""
		self.load_linked_code_processes()

		results = self.execute(sql.QueryRowsResponse().SELECT(entities_db.TABLE_NID_APPLICATIONS)
		                       .FROM(entities_db.TABLE_NAME_APPLICATIONS_TO_PROJECTS)
		                       .WHERE_EQUALS_TO(entities_db.TABLE_NID_PROJECTS, self.get_id()))
		for r in results:
			self.linked_applications.append(r[0])

	def cache_process(self, domain):
		"""Runs the cache process for this project."""
		for a in self.linked_applications:
			application = domain.get_application_by_id(a)
			application.set_all_linked_data()
			application.cache_process(domain)
		self.run_needed_code_processes(domain)


class Application(BusinessEntity):
	"""Represents an Application."""
	def __init__(self, parent_table, application_name):
		super().__init__(parent_table)
		self.application_name       = application_name
		self.linked_libraries       = []

	def get_id(self):
		"""Gets the ID of this business entity instance."""
		return self._table.get_value(self._table.name_id, KEY_NAME, self.application_name)

	def load(self):
		"""Loads this application if not already loaded."""
		self._table.insert({KEY_NAME: self.application_name}, dne_check=True)

	def set_all_linked_data(self):
		"""Returns all the applications linked to this CodeProject."""
		oc.print_data_with_red_dashes_at_start('Health check on application{' + self.application_name + '}')
		self.load_linked_code_processes()

		results = self.execute(sql.QueryRowsResponse().SELECT(entities_db.TABLE_NID_LIBRARIES)
		                       .FROM(entities_db.TABLE_NAME_LIBRARIES_TO_APPLICATIONS)
		                       .WHERE_EQUALS_TO(entities_db.TABLE_NID_APPLICATIONS, self.get_id()))
		for r in results:
			self.linked_libraries.append(r[0])

	def cache_process(self, domain):
		"""Runs the cache process for this project."""
		for a in self.linked_libraries:
			library = domain.get_library_by_id(a)
			library.set_all_linked_data()
			library.cache_process(domain)
		self.run_needed_code_processes(domain)


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

	def set_all_linked_data(self):
		"""Returns all the applications linked to this CodeProject."""
		oc.print_data_with_red_dashes_at_start('Health check on library{' + self.library_name + '}')
		self.load_linked_code_processes()

	def cache_process(self, domain):
		"""Runs the cache process for this project."""
		self.run_needed_code_processes(domain)


class CodeProcess(BusinessEntity):
	"""Represents a build process."""
	def __init__(self, parent_table, name, process_name, parent_business_object):
		super().__init__(parent_table)
		self.build_process_name     = name
		self.process_name           = process_name
		self.parent_business_object = parent_business_object
		self._process               = None
	
	def get_id(self):
		"""Gets the ID of this business entity instance."""
		return self._table.get_value(self._table.name_id, KEY_NAME, self.build_process_name)

	def load(self):
		"""Loads this build process if not already loaded."""
		self._table.insert_if_does_not_exist(
			{
				KEY_NAME          : self.build_process_name,
				KEY_OWNER_ID      : self.parent_business_object.get_id(),
				KEY_OWNER_TABLE_ID: self.parent_business_object.table_id,
				KEY_PROCESS_NAME  : self.process_name
			},
			{KEY_NAME: self.build_process_name}
		)

	def set_process(self, p):
		"""Sets the code_process to run."""
		self._process = p

	def run(self, domain):
		"""Runs this code process."""
		oc.print_data_with_red_dashes_at_start('Health check on code_process{' + self.build_process_name + '}')
		process = self._process(self, self.parent_business_object, domain)
		return process.run()


class File(BusinessEntity):
	"""Represents a file."""

	def __init__(self, parent_table, file_data):
		super().__init__(parent_table)
		self.file_data                    = file_data

		if self.md5sum == 'CALCULATE':
			self.md5sum = ufo.file_get_md5_checksum(self.path)
		if self.content == 'CALCULATE':
			self.content = ufo.file_get_contents_as_string(self.path)
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
				KEY_FILE_TYPE         : self.file_type,
				KEY_SIZE              : self.size,
				KEY_PATH              : self.path,
				KEY_MD5SUM            : self.md5sum,
				KEY_NEEDS_MINIFICATION: self.needs_minification,
				KEY_NEEDS_GZIP        : self.needs_gzip,
				KEY_NEEDS_LZ          : self.needs_lz,
				KEY_PARENT_F_ID       : self.parent_f_id,
				KEY_CHILD_F_ID        : self.child_f_id,
				KEY_CONTENT           : self.content
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
	def needs_minification(self):
		"""Returns if this file needs minification."""
		return self.file_data[KEY_NEEDS_MINIFICATION]

	@property
	def needs_gzip(self):
		"""Returns if this file needs gzipping."""
		return self.file_data[KEY_NEEDS_GZIP]

	@property
	def needs_lz(self):
		"""Returns if this file needs to be lz-zipped."""
		return self.file_data[KEY_NEEDS_LZ]

	@property
	def parent_f_id(self):
		"""Returns the parent f_id of this file."""
		return self.file_data[KEY_PARENT_F_ID]

	@property
	def child_f_id(self):
		"""Returns the child f_id of this file."""
		return self.file_data[KEY_CHILD_F_ID]

	@property
	def content(self):
		"""Returns the content of this file."""
		return self.file_data[KEY_CONTENT]

	@content.setter
	def content(self, v):
		"""Sets the content value."""
		self.file_data[KEY_CONTENT] = v

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



