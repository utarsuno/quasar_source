# coding=utf-8

"""This module, db_entities_base.py, provides base abstractions for DB entities (tables + logic)."""

from libraries.database_abstraction.sql.sqlite import sqlite_db
from libraries.database_abstraction.sql.query_abstraction import sql_query as sql
from applications.code_manager.layer_domain.entities import entities_db
from applications.code_manager.layer_domain.entities import entities_business
from libraries.universal_code.data_structures.flags import Flags


class DBDomain(Flags):
	"""Represents a DB connection to code_manager."""

	def __init__(self, db_location, default_generated_content_directory, volume_path, debug_on, build_type):
		super().__init__()
		self.flag_set('BUILD_TYPE', build_type)

		self._db_location           = db_location
		self._db                    = sqlite_db.SQLiteDB(self._db_location, debug_on)
		self._db.connect()

		self.generated_content_path = default_generated_content_directory
		self.volume_path            = volume_path

		self._e_libraries           = entities_db.DBEntityLibrary()
		self._e_files               = entities_db.DBEntityFile()
		self._e_builds              = entities_db.DBEntityBuilds()

		self._libraries             = []
		self._files                 = []
		self._pre_processes         = []

	def get_library_by_id(self, l_id):
		"""Returns a library by ID match."""
		for l in self._libraries:
			if l.get_id() == l_id:
				return l

	def get_library_by_name(self, name):
		"""Returns a library by name match."""
		for l in self._libraries:
			if l.library_name == name:
				return l

	def get_file_by_path(self, path):
		"""Returns a file by path match."""
		for f in self._files:
			if f.path == path:
				return f

	def load(self):
		"""Loads this domain into memory."""
		self._load_tables([self._e_libraries, self._e_files, self._e_builds])

		for l in self._libraries:
			l.load()
		for f in self._files:
			f.load()
		for pp in self._pre_processes:
			pp.load()

		files = self._db.execute_query(sql.QueryRowsResponse().SELECT_ALL().FROM(entities_db.TABLE_NAME_FILES))
		for f in files:
			self._add_file(f)

	def _load_tables(self, tables):
		"""Loads the provided tables."""
		for t in tables:
			self._load_table(t)
		self._db.create_tables()

	def _load_table(self, db_entity):
		"""Utility function."""
		self._db.add_table(db_entity.table)
		db_entity.table.create()

	def add_library(self, library_data):
		"""Adds a library to this domain."""
		l = entities_business.Library(self._e_libraries.table, library_data)
		self._libraries.append(l)
		return l

	def _add_file(self, file_data):
		"""Adds a file to this domain."""
		if type(file_data) == entities_business.File:
			print('THE FILE DATA IS A BUSINESS FILE OBJECT!')
		else:
			data = {
				entities_db.DBEntityFile.KEY_FILE_TYPE         : file_data[1],
				entities_db.DBEntityFile.KEY_SIZE              : file_data[2],
				entities_db.DBEntityFile.KEY_PATH              : file_data[3],
				entities_db.DBEntityFile.KEY_MD5SUM            : file_data[4],
				entities_db.DBEntityFile.KEY_CACHED_AT         : file_data[5],
				entities_db.DBEntityFile.KEY_PARENT_F_ID       : file_data[6],
				entities_db.DBEntityFile.KEY_CHILD_F_ID        : file_data[7]
			}
			f = entities_business.File(self._e_files.table, data)
			self._files.append(f)

	def cache_single_file(self, file_type, size, path, md5sum=None, cached_at=sql.SQL_VALUE_NOW, parent_f_id=None, child_f_id=None):
		"""Performs cache for a single file."""
		match = self.get_file_by_path(path)
		if match is None:
			f = entities_business.File(self._e_files.table, {
				entities_db.DBEntityFile.KEY_FILE_TYPE   : file_type,
				entities_db.DBEntityFile.KEY_SIZE        : size,
				entities_db.DBEntityFile.KEY_PATH        : path,
				entities_db.DBEntityFile.KEY_MD5SUM      : md5sum,
				entities_db.DBEntityFile.KEY_CACHED_AT   : cached_at,
				entities_db.DBEntityFile.KEY_PARENT_F_ID : parent_f_id,
				entities_db.DBEntityFile.KEY_CHILD_F_ID  : child_f_id,
			})
			self._files.append(f)
			f.load()
			return True, f
		else:
			if match.md5sum_changed():
				match.perform_update()
				return True, match
			else:
				return False, match

	def cache_base_file(self, base_file):
		"""Caches the base file provided."""
		cached_or_updated, file = self.cache_single_file(
			base_file.file_type,
			'CALCULATE',
			base_file.full_path,
			'CALCULATE'
		)
		return cached_or_updated, file

	def cache_child_file_based_off_base_code_file(self, base_code_file, base_file, child_path):
		"""Utility function."""
		cached_or_updated, file = self.cache_single_file(
			base_code_file.file_type,
			'CALCULATE',
			child_path,
			None
		)
		self.link_child_file_to_parent(child_file=file, parent_file=base_file)
		return cached_or_updated, file

	def link_child_file_to_parent(self, child_file, parent_file):
		"""Utility function."""
		if parent_file.child_f_id is None:
			parent_file.set_child_file(child_file)
			child_file.set_parent_file(parent_file)
