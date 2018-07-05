# coding=utf-8

"""This module, nexus_db.py, provides a SQLite db for the nexus_local and nexus_server."""

from quasar_libraries_and_scripts.database_api.sql_databases.sqlite.table_abstraction import TableAbstraction as Table
from quasar_libraries_and_scripts.database_api.sql_databases.sqlite.column_abstraction import ColumnAbstraction as Column
from quasar_libraries_and_scripts.database_api.sql_databases.sqlite.sqlite_db import SQLiteDB
from quasar_libraries_and_scripts.universal_code.system_abstraction.system_functions import get_system_environment


class NexusDB(SQLiteDB):
	"""Abstraction to running the Nexus SQLiteDB."""

	def __init__(self):
		save_path = get_system_environment('SQLITE_DB_FILE_PATH')
		print('The save path is {' + save_path + '}')
		super().__init__('file_path_HERE!!!!')



