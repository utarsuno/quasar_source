# coding=utf-8

"""This module, db_entities_base.py, provides base abstractions for DB entities (tables + logic)."""

from libraries.database_api.sql_databases.sqlite import sqlite_db
from libraries.database_api.sql_databases.sqlite import table_abstraction as table
from libraries.universal_code import debugging as dbg
from applications.code_manager.layer_domain.entities import entities_db
from applications.code_manager.layer_domain.entities import entities_business


_INDEX_TABLE_NAME  = 0
_INDEX_TABLE_OBJ   = 1
_INDEX_BASE_NAME   = 2
_INDEX_LINKED_ONJ  = 3
_INDEX_LINKED_NAME = 4


class DBDomain(object):
	"""Represents a DB connection to code_manager."""

	def __init__(self, db_location, debug_on=False):
		self._db_location = db_location
		self._db          = sqlite_db.SQLiteDB(self._db_location, debug_on)
		self._db.connect()

		self._db_entities = []

		self._e_projects              = entities_db.DBEntityCodeProject()
		self._e_applications          = entities_db.DBEntityApplication([self._e_projects.table])
		self._e_libraries             = entities_db.DBEntityLibrary([self._e_applications.table])
		self._e_libraries_third_party = entities_db.DBEntityThirdPartyLibrary([self._e_libraries.table])
		self._e_build_processes       = entities_db.DBEntityBuildProcess()

		self._projects              = []
		self._applications          = []
		self._libraries             = []
		self._libraries_third_party = []
		self._build_processes       = []

	def add_db_entity(self, entity):
		"""Adds a DB Entity to this domain."""
		self._db_entities.append(entity)
		return entity

	def load(self):
		"""Loads this domain into memory."""
		self._load_table(self._e_projects)
		self._load_table(self._e_applications)
		self._load_table(self._e_libraries)
		self._load_table(self._e_libraries_third_party)
		self._load_table(self._e_build_processes)
		self._db.create_tables()

		for p in self._projects:
			p.load()

		for a in self._applications:
			a.load()
			a.load_many_to_many_data(self._db)

		for l in self._libraries:
			l.load()
			l.load_many_to_many_data(self._db)

		for l in self._libraries_third_party:
			l.load()
			l.load_many_to_many_data(self._db)
		#

	def _load_table(self, db_entity):
		"""Utility function."""
		self._db.add_table(db_entity.table)
		db_entity.table.create()

	def post_load(self):
		"""Implemented by child objects."""
		dbg.raise_exception_abstract_method('post_load')

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

	def add_library(self, library_name, parent_name):
		"""Adds a library to this domain."""
		l = entities_business.Library(self._e_libraries.table, library_name)
		l.add_default_many_to_many_data(self._e_applications, parent_name)
		self._libraries.append(l)
		return l

	def add_library_third_party(self, data, parent_library_name):
		"""Adds a third party library to this domain."""
		l = entities_business.ThirdPartyLibrary(self._e_libraries_third_party.table, data)
		l.add_default_many_to_many_data(self._e_libraries, parent_library_name)
		self._libraries_third_party.append(l)
		return l

	#def add_build_process(self, ):
