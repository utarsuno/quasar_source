# coding=utf-8

"""This module, sqlite_db.py, provides an abstraction to accessing a local sqlite_db."""

import sqlite3 as sql


class SQLiteDB(object):
	"""Represents an SQLiteDB."""

	def __init__(self, db_file_path, debug=False):
		self._debug        = debug
		self._db_file_path = db_file_path
		self._connection   = None
		self._cursor       = None
		self._tables       = []

	def connect(self):
		"""Establish a connection to the db file."""
		self._connection = sql.connect(self._db_file_path)
		self._cursor     = self._connection.cursor()

	def add_table(self, table):
		"""Adds a table to this db."""
		self._tables.append(table)
		table.set_db(self)

	def execute_query(self, query):
		"""Executes a query."""
		if self._debug:
			print('Executing the following query \n--------------------------------------------------\n' + str(query) + '\n--------------------------------------------------')
		self._cursor.execute(str(query))
		results = self._cursor.fetchall()

		if query.save_results:
			self._connection.commit()

		if query.boolean_response:
			return len(results) != 0
		elif query.single_response:
			if len(results) == 0:
				return None
			return results[0][0]

		return results

