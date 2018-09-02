# coding=utf-8

"""This module, sqlite_db.py, provides an abstraction to accessing a local sqlite_db."""

from libraries.database_api.sql_databases.sqlite import table_abstraction
from libraries.database_api.sql_databases.sql_query_abstraction import sql_query as sql
import sqlite3


class SQLiteDB(object):
	"""Represents an SQLiteDB."""

	def __init__(self, db_file_path, debug=False):
		self._debug        = debug
		self._db_file_path = db_file_path
		self._connection   = None
		self._cursor       = None
		self._tables       = []

		self._all_tables   = table_abstraction.TableAbstraction('all_tables')
		self._all_tables.add_column_standard_string('name', unique=True)
		self._all_tables.add_column_row_id_alias(self._all_tables.name_id)
		self._all_tables.set_db(self)

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

	def ensure_many_to_many(self, base_table, linked_table):
		"""Ensure a many-to-many relationship table exists for the provided tables."""
		table_name = base_table.name + '_to_' + linked_table.name
		#print('MANY TO MANY TABLE: ' + table_name)
		table = table_abstraction.TableAbstraction(base_table.name + '_to_' + linked_table.name)
		table.add_column_foreign_key(base_table.primary_key)
		table.add_column_foreign_key(linked_table.primary_key)
		self.add_table(table)

		table.create()

		#self._many_to_many[base_table.name] = linked_table.name

		#return table

		# Create a trigger to insert the linked ids.
		#insert = sql.SQLQuery().INSERT(table_name, table.get_column_string(), table.get_values_string({
		#	base_table.name_id: base_table.name,
		#
		#}))
		#query = sql.SQLQuery().CREATE_TRIGGER('trigger_' + table_name)

		#table.insert_if_does_not_exist()

	def create_tables(self):
		"""Loads the tables into memory."""
		for t in self._tables:
			t.create()
			many_to_many = t.many_to_many
			if many_to_many is not None:
				for mtm in many_to_many:
					self.ensure_many_to_many(t, mtm)

	def execute_query(self, query):
		"""Executes a query."""
		if self._debug:
			#print('Executing the following query \n--------------------------------------------------\n' + str(query) + '\n--------------------------------------------------')
			print('Executing the following query \n--------------------------------------------------')
			print(str(query) + '\n--------------------------------------------------')
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

		return results

