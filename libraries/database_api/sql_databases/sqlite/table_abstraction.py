# coding=utf-8

"""This module, table_abstraction.py, represents a SQLite table."""


class TableAbstraction(object):
	"""Represents a SQLite table."""

	def __init__(self, table_name, with_row_id=False):
		self._name        = table_name
		self._with_row_id = with_row_id
		self._columns     = []
		self._db          = None

	def get_row_id(self, key, value):
		"""Gets the row_id for they key-value match."""
		query = 'SELECT rowid FROM ' + self._name + self._sql_where_equals_to(key, value)
		results = self._db.execute_query(query)
		return results[0][0]

	def update_value(self, key_update, value_update, key_match, value_match):
		"""Updates a value for a given row match."""
		query = 'UPDATE ' + self._name + ' SET ' + key_match + ' = ' + self._adjust_value(value_update) + self._sql_where_equals_to(key_match, value_match)
		self._db.execute_query(query, save_changes=True)

	def has_value(self, key, value):
		"""Checks for any row with a key-value match."""
		query = 'SELECT * FROM ' + self._name + self._sql_where_equals_to(key, value)
		results = self._db.execute_query(query)
		return len(results) != 0

	def get_value(self, key_value, key_match, value_match):
		"""Gets a value from this table."""
		query = 'SELECT ' + key_value + ' FROM ' + self._name + self._sql_where_equals_to(key_match, value_match)
		results = self._db.execute_query(query)
		if len(results) == 0:
			return None
		return results[0][0]

	def insert(self, keys_values):
		"""Insert a row into this table."""
		query = 'INSERT INTO ' + self._name + ' ' + self._get_column_string() + ' VALUES ' + self._get_values_string(keys_values) + ';'
		self._db.execute_query(query, save_changes=True)

	def get_row_matches(self, key, value):
		"""Get all rows that match with the provided key and value."""
		query = 'SELECT * FROM ' + self._name + self._sql_where_equals_to(key, value)
		results = self._db.execute_query(query)
		if len(results) == 0:
			return []
		return results

	def get_all_rows(self, with_row_id=False):
		"""Returns all rows."""
		if with_row_id:
			query = 'SELECT rowid, * FROM ' + self._name + ';'
		else:
			query = 'SELECT * FROM ' + self._name + ';'
		results = self._db.execute_query(query)
		if len(results) == 0:
			return []
		return results

	def create(self):
		"""Creates this table (if it does not exist)."""
		if not self.exists:
			query = 'CREATE TABLE IF NOT EXISTS {}(\n'.format(self._name)
			for c in self._columns:
				column_declaration = '\t' + c.name + ' ' + c.data_type.data_type
				if c.data_type.is_nullable():
					column_declaration += ' NOT NULL'
				if c.data_type.is_unique():
					column_declaration += ' UNIQUE'
				query += column_declaration + ',\n'
			query = query[:-2] + '\n);'
			self._db.execute_query(query, save_changes=True)

	def delete(self):
		"""Deletes this table (if it exists)."""
		if self.exists:
			query = 'DROP TABLE ' + self._name + ';'
			self._db.execute_query(query, save_changes=True)

	@property
	def exists(self):
		"""Returns a boolean indicating if this table exists."""
		if len(self._db.execute_query("SELECT name FROM sqlite_master WHERE type='table' AND name='{}';".format(self._name))) == 0:
			return False
		return True

	def add_column(self, table_column):
		"""Adds a column to this table."""
		self._columns.append(table_column)

	def set_db(self, db):
		"""Sets the db that this table belongs to."""
		self._db = db

	def _get_values_string(self, keys_and_values):
		"""Utility function."""
		s = '('
		for c in self._columns:
			if type(keys_and_values[c.name]) == str:
				s += "'" + keys_and_values[c.name] + "',"
			else:
				s += str(keys_and_values[c.name]) + ','
		return s[:-1] + ')'

	def _get_column_string(self):
		"""Utility function."""
		s = '('
		for c in self._columns:
			s += c.name + ','
		return s[:-1] + ')'

	def _adjust_value(self, key):
		"""Utility function."""
		if type(key) == str:
			return "'" + key + "'"
		return str(key)

	def _sql_where_equals_to(self, key, value):
		"""Utility function."""
		return ' WHERE ' + key + ' = ' + self._adjust_value(value) + ';'
