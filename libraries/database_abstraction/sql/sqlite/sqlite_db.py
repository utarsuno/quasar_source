# coding=utf-8

"""This module, sqlite_db.py, provides an abstraction to accessing a local sqlite_db."""

from libraries.database_abstraction.sql.sqlite import table_abstraction
from libraries.database_abstraction.sql.query_abstraction import sql_query as sql
import sqlite3


class SQLiteDB(object):
	"""Represents an SQLiteDB."""

	def __init__(self, db_file_path, debug=False, auto_connect=False):
		self._debug        = debug
		self._db_file_path = db_file_path
		self._connection   = None
		self._cursor       = None
		self._tables       = []

		self._all_tables   = table_abstraction.TableAbstraction('all_tables')
		self._all_tables.add_column_string('name', unique=True)
		self._all_tables.add_column_row_id_alias() # self._all_tables.name_id
		self._all_tables.set_db(self)

		if auto_connect:
			self.connect()

	def connect(self):
		"""Establish a connection to the db file."""
		self._connection = sqlite3.connect(self._db_file_path)
		self._cursor     = self._connection.cursor()
		self._all_tables.create()

	def add_table(self, table):
		"""Adds a table to this db."""
		self._tables.append(table)
		table.set_db(self)
		self._all_tables.insert({'name': table.name}, dne_check=True)
		table.table_id = self._all_tables.get_value(self._all_tables.name_id, 'name', table.name)

	def get_table(self, table_name):
		"""Returns the table with matched table_name."""
		for t in self._tables:
			if t.name == table_name:
				return t
		return None

	def create_tables(self):
		"""Loads the tables into memory."""
		for t in self._tables:
			t.create()
			many_to_many = t.many_to_many
			if many_to_many is not None:
				for mtm in many_to_many:
					self._ensure_many_to_many(t, mtm)

	def execute_query(self, query):
		"""Executes a query."""
		if self._debug:
			print('Executing the following query')
			print('--------------------------------------------------')
			print(str(query))
			print('--------------------------------------------------')
		self._cursor.execute(str(query))
		results = self._cursor.fetchall()

		if query.save_results:
			self._connection.commit()

		#if query.is_insert_into_table():

		if query.boolean_response:
			return len(results) != 0
		elif query.single_response:
			if len(results) == 0:
				return None
			return results[0][0]
		#elif query.rows_response:
		#	if len(results) == 0:
		#		return []
		#	print(results)
		#	print(results[0])
		#	print(type(results[0]))
		#	print(list(results[0]))
		#	return results[0]

		return results

	# ----------------------------------------------------------------------------------------------------

	def _ensure_many_to_many(self, base_table, linked_table):
		"""Ensure a many-to-many relationship table exists for the provided tables."""
		table = table_abstraction.TableAbstraction(base_table.name + '_to_' + linked_table.name)
		table.add_column_foreign_key(base_table.primary_key)
		table.add_column_foreign_key(linked_table.primary_key)
		self.add_table(table)
		table.create()

