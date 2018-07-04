# coding=utf-8

"""This module, nexus_db.py, provides a SQLite db for the nexus_local and nexus_server."""

from quasar_libraries_and_scripts.database_api.sql_databases.sqlite.table_abstraction import TableAbstraction as Table
from quasar_libraries_and_scripts.database_api.sql_databases.sqlite.column_abstraction import ColumnAbstraction as Column
from quasar_libraries_and_scripts.database_api.sql_databases.sqlite.sqlite_db import SQLiteDB


class NexusDB(SQLiteDB):
	"""Abstraction to running the Nexus SQLiteDB."""

	def __init__(self):
		# TODO : get file path
		super().__init__('file_path_HERE!!!!')



