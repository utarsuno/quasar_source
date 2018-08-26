# coding=utf-8

"""This module, sql_query.py, abstracts SQL queries."""


def sql_safe(value):
	"""Ensures strings are wrapped in quotes."""
	if type(value) == str:
		return "'" + value + "'"
	return str(value)


class SQLQuery(object):
	"""Represents an SQL Query string."""
	
	def __init__(self, save_changes=False, boolean_response=False, single_response=False, rows_response=False):
		self._sql              = ''
		self._save_changes     = save_changes
		self._boolean_response = boolean_response
		self._single_response  = single_response
		self._rows_response    = rows_response

	def CREATE_TABLE(self, table_name, columns):
		"""Sets this SQL Query to create a table with the specified name."""
		self._sql           = 'CREATE TABLE ' + table_name + ' (\n'
		self._save_changes  = True
		skipped_foreign_key = None
		for c in columns:
			if c.foreign_key:
				skipped_foreign_key = c
			else:
				self._sql += c.get_utility_sql_create_statement()
		if skipped_foreign_key is not None:
			self._sql += skipped_foreign_key.get_utility_sql_create_statement()
		self._sql = self._sql[:-2] + '\n);'
		return self

	def DROP_TABLE(self, table_name):
		"""Sets this SQL to drop the table with the specified name."""
		self._sql          = 'DROP TABLE ' + table_name + ';'
		self._save_changes = True
		return self

	def SET(self, key, value):
		"""Sets the new value to set by column key."""
		self._save_changes = True
		self._sql += ' SET ' + key + ' = ' + sql_safe(value)
		return self

	def UPDATE(self, table_name):
		"""Sets this SQL to perform an update."""
		self._save_changes = True
		self._sql          = 'UPDATE ' + table_name
		return self

	def INSERT(self, table_name, columns_string, values_string):
		"""Sets this SQL to perform an insert."""
		self._save_changes = True
		self._sql          = 'INSERT INTO ' + table_name + ' ' + columns_string + ' VALUES ' + values_string + ';'
		return self

	def SELECT_COUNT(self):
		"""Sets this SQL Query to fetch the number of rows returned."""
		self._sql = 'SELECT COUNT(*) '
		return self

	def SELECT_ALL(self):
		"""Sets this SQL Query to fetch all data of the rows matched."""
		self._sql = 'SELECT * '
		return self

	def SELECT(self, keys):
		"""Sets this SQL Query to fetch the provided key values."""
		self._sql = 'SELECT '
		if type(keys) == list:
			for k in keys:
				self._sql += k + ', '
			self._sql = self._sql[:-2]
		else:
			self._sql += keys
		return self

	def FROM(self, name):
		"""Sets this SQL Query to perform action on the provided source."""
		self._sql += ' FROM ' + name
		return self

	def WHERE_EQUALS_TO(self, key, value):
		"""Adds a condition on which to perform this SQL Query."""
		self._sql += ' WHERE ' + key + ' = ' + sql_safe(value) + ';'
		return self

	def WHERE(self, keys_and_values):
		"""Adds a condition on which to perform this SQL Query."""
		self._sql += ' WHERE \n'
		for key in keys_and_values:
			self._sql += '\t' + key + ' = ' + sql_safe(keys_and_values[key]) + ' AND \n'
		self._sql = self._sql[:-len(' AND \n')] + ';'
		return self

	def set_to_single_response(self):
		"""Sets this SQL response type to single response."""
		self._single_response = True
		return self

	@property
	def save_results(self):
		"""Returns a boolean indicating if the database should commit changes after this query."""
		return self._save_changes

	@property
	def boolean_response(self):
		"""Returns a boolean indicating if the database should return a boolean response to this query."""
		return self._boolean_response

	@property
	def single_response(self):
		"""Returns a boolean indicating if the database should return a numerical response to this query."""
		return self._single_response

	def __str__(self):
		return self._sql


class SQLQueryBooleanResponse(SQLQuery):
	"""Represents an SQL Query string which returns a boolean response."""

	def __init__(self):
		super().__init__(False, True, False, False)


class SQLQuerySingleResponse(SQLQuery):
	"""Represents an SQL Query string which returns a boolean response."""

	def __init__(self):
		super().__init__(False, False, True, False)


class SQLQueryRowsResponse(SQLQuery):
	"""Represents an SQL Query string which returns a boolean response."""

	def __init__(self):
		super().__init__(False, False, False, True)
