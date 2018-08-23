# coding=utf-8

"""This module, sqlite_db.py, provides an abstraction to accessing a local sqlite_db."""

import sqlite3 as sql


class SQLiteDB(object):
	"""Represents an SQLiteDB."""

	def __init__(self, db_file_path):
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

	def execute_query(self, query, save_changes=False):
		"""Executes a query."""
		#print('Executing query {' + query + '}')
		self._cursor.execute(query)
		results = self._cursor.fetchall()
		if save_changes:
			self._connection.commit()
		return results

