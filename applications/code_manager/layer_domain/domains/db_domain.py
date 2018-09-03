# coding=utf-8

"""This module, db_entities_base.py, provides base abstractions for DB entities (tables + logic)."""

from libraries.database_abstraction.sql.sqlite import sqlite_db
from libraries.database_abstraction.sql.query_abstraction import sql_query as sql
from libraries.database_abstraction.sql.sqlite import table_abstraction as table
from libraries.universal_code import debugging as dbg
from applications.code_manager.layer_domain.entities import entities_db
from applications.code_manager.layer_domain.entities import entities_business
from libraries.universal_code import output_coloring as oc
from libraries.universal_code import useful_file_operations as ufo


_INDEX_TABLE_NAME  = 0
_INDEX_TABLE_OBJ   = 1
_INDEX_BASE_NAME   = 2
_INDEX_LINKED_ONJ  = 3
_INDEX_LINKED_NAME = 4


class DBDomain(object):
	"""Represents a DB connection to code_manager."""

	def __init__(self, db_location, debug_on=False):
		self._db_location      = db_location
		self._db               = sqlite_db.SQLiteDB(self._db_location, debug_on)
		self._db.connect()

		self._e_projects       = entities_db.DBEntityCodeProject()
		self._e_applications   = entities_db.DBEntityApplication([self._e_projects.table])
		self._e_libraries      = entities_db.DBEntityLibrary([self._e_applications.table])
		self._e_code_processes = entities_db.DBEntityCodeProcess()
		self._e_files          = entities_db.DBEntityFile()

		self._projects         = []
		self._applications     = []
		self._libraries        = []
		self._code_processes   = []
		self._files            = []

	def get_application_by_id(self, a_id):
		"""Returns an application by ID match."""
		for a in self._applications:
			if a.get_id() == a_id:
				return a
		return None

	def get_library_by_id(self, l_id):
		"""Returns a library by ID match."""
		for l in self._libraries:
			if l.get_id() == l_id:
				return l
		return None

	def get_code_process_by_id(self, cp_id):
		"""Returns a code_process by ID match."""
		for cp in self._code_processes:
			if cp.get_id() == cp_id:
				return cp
		return None

	def get_file_by_path(self, path):
		"""Returns a file by path match."""
		for f in self._files:
			if f.path == path:
				return f
		return None

	def run_needed_code_processes(self):
		"""Runs the build + cache process for all projects in this Domain."""
		print('RUNNING CODE PROCESSES')

		for p in self._projects:
			oc.print_data_with_red_dashes_at_start('Health check on project{' + p.project_name + '}')
			p.set_all_linked_data()
			p.cache_process(self)

	def load(self):
		"""Loads this domain into memory."""
		self._load_table(self._e_projects)
		self._load_table(self._e_applications)
		self._load_table(self._e_libraries)
		self._load_table(self._e_code_processes)
		self._load_table(self._e_files)
		self._db.create_tables()

		for p in self._projects:
			p.load()

		for a in self._applications:
			a.load()
			a.load_many_to_many_data(self._db)

		for l in self._libraries:
			l.load()
			l.load_many_to_many_data(self._db)

		for bp in self._code_processes:
			bp.load()
		#
		# Load all the files.
		y = 2
		# TODO: Load all files!
		print('TODO: load all files!')

		files = self._db.execute_query(sql.QueryRowsResponse().SELECT_ALL().FROM(entities_db.TABLE_NAME_FILES))
		print('PRINTING ALL THE FILES')
		for f in files:
			print(f)
		# TODO: store the file!

	def _load_table(self, db_entity):
		"""Utility function."""
		self._db.add_table(db_entity.table)
		db_entity.table.create()

	def add_project(self, project_name):
		"""Adds a project to this domain."""
		p = entities_business.CodeProject(self._e_projects.table, project_name)
		self._projects.append(p)
		return p

	def add_application(self, application_name, parent_code_project_name):
		"""Adds an application to this domain."""
		a = entities_business.Application(self._e_applications.table, application_name)
		a.add_default_many_to_many_data(self._e_projects, parent_code_project_name)
		self._applications.append(a)
		return a

	def add_library(self, library_data, parent_name):
		"""Adds a library to this domain."""
		l = entities_business.Library(self._e_libraries.table, library_data)
		l.add_default_many_to_many_data(self._e_applications, parent_name)
		self._libraries.append(l)
		return l

	def add_code_process(self, name, process_name, parent_business_object):
		"""Adds a build process to this domain."""
		bp = entities_business.CodeProcess(self._e_code_processes.table, name, process_name, parent_business_object)
		self._code_processes.append(bp)
		return bp

	def cache_file(self, file_type, size, path, md5sum, needs_minification, needs_gzip, needs_lz, parent_f_id, child_f_id, content, child_path=None):
		"""Caches the provided file information into this domain."""
		print('TODO: CACHE THE FILE!')

		current_md5sum = ufo.get_md5_checksum(path)

		if md5sum == 'CALCULATE':
			md5sum = current_md5sum
		if content == 'CALCULATE':
			content = ufo.get_file_content_as_string(path)
		if size == 'CALCULATE':
			size = ufo.get_file_size_in_bytes(path)


		# First check if a file match exists.
		match = self.get_file_by_path(path)

		if match is None:
			print('TODO: add new file object.')
			f = entities_business.File(self._e_files.table, {
				entities_db.DBEntityFile.KEY_FILE_TYPE         : file_type,
				entities_db.DBEntityFile.KEY_SIZE              : size,
				entities_db.DBEntityFile.KEY_PATH              : path,
				entities_db.DBEntityFile.KEY_MD5SUM            : md5sum,
				entities_db.DBEntityFile.KEY_NEEDS_MINIFICATION: needs_minification,
				entities_db.DBEntityFile.KEY_NEEDS_GZIP        : needs_gzip,
				entities_db.DBEntityFile.KEY_NEEDS_LZ          : needs_lz,
				entities_db.DBEntityFile.KEY_PARENT_F_ID       : parent_f_id,
				entities_db.DBEntityFile.KEY_CHILD_F_ID        : child_f_id,
				entities_db.DBEntityFile.KEY_CONTENT           : content
			})
			self._files.append(f)
			f.load()

			if child_path is not None:
				print('TODO: Create and return a child file instance!')

				if needs_gzip:
					print('TODO: gzip!')

				#child = self.cache_file({
				#
				#})

		else:
			if current_md5sum != match.md5sum:
				print('TODO: PERFORM AN UPDATE!')



