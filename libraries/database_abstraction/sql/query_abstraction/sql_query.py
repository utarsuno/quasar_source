# coding=utf-8

"""This module, sql_query.py, abstracts SQL queries."""

from libraries.universal_code import debugging as dbg


SQL_VALUE_NOW  = 'CURRENT_TIMESTAMP'
SQL_VALUE_NULL = 'NULL'

SQL_DEFAULT_VALUES = [
	SQL_VALUE_NOW,
	SQL_VALUE_NULL
]


def sql_safe(value):
	"""Ensures strings are wrapped in quotes."""
	if type(value) == str:
		if value in SQL_DEFAULT_VALUES:
			return value
		else:
			return "'" + value + "'"
	elif type(value) == bool:
		if value:
			value = 1
		else:
			value = 0
	elif value is None:
		return 'NULL'
	return str(value)


DISCRETE_ZERO_DAY_OLD = "datetime('now', '-0 day')"
DISCRETE_ONE_DAY_OLD = "datetime('now', '-1 day')"
DISCRETE_MORE_THAN_ONE_DAY_OLD = ' < ' + DISCRETE_ONE_DAY_OLD
DISCRETE_MORE_THAN_ZERO_DAYS_OLD = ' < ' + DISCRETE_ZERO_DAY_OLD

_DISCRETE_COMPARISONS = [
	DISCRETE_MORE_THAN_ONE_DAY_OLD,
	DISCRETE_MORE_THAN_ZERO_DAYS_OLD
]


class Query(object):
	"""Represents a SQL Query string."""
	
	def __init__(self, save_changes=False, boolean_response=False, single_response=False, rows_response=False):
		self._sql                = ''
		self._save_changes       = save_changes
		self._is_insert_to_table = False
		self._boolean_response   = boolean_response
		self._single_response    = single_response
		self._rows_response      = rows_response
		# Utility.
		self._table_name         = None

	def CREATE_TRIGGER(self, trigger_name, table_name, query, before=False, after=False, insert=False, update=False, delete=False):
		"""Sets this SQL Query to create a trigger with the specified name."""
		if before and after:
			dbg.raise_exception('for CREATE_TRIGGER, both before and after should not be True.')
		count = 0
		if insert:
			count += 1
		if update:
			count += 1
		if delete:
			count += 1
		if count > 1 or count == 0:
			dbg.raise_exception('for CREATE_TRIGGER, only one of after,insert, or delete should be set to True.')

		self._save_changes = True
		self._sql = 'CREATE TRIGGER IF NOT EXISTS ' + trigger_name + '\n'
		if before:
			self._sql += '\tBEFORE '
		if after:
			self._sql += '\tAFTER '
		if insert:
			self._sql += 'INSERT '
		if update:
			self._sql += 'UPDATE '
		if delete:
			self._sql += 'DELETE '
		self._sql += table_name + '\nBEGIN\n' + query + '\nEND;'
		return self

	def CREATE_TABLE(self, table_name, columns):
		"""Sets this SQL Query to create a table with the specified name."""
		self._sql            = 'CREATE TABLE ' + table_name + ' (\n'
		self._save_changes   = True
		skipped_foreign_keys = []
		for c in columns:
			if c.foreign_key:
				skipped_foreign_keys.append(c)
			else:
				self._sql += c.get_utility_sql_create_statement()
		if len(skipped_foreign_keys) != 0:
			first_half  = []
			second_half = []
			for fk in skipped_foreign_keys:
				split = fk.get_utility_sql_create_statement().split('\n')
				first_half.append(split[0])
				second_half.append(split[1])
			for fh in first_half:
				self._sql += fh + '\n'
			for sh in second_half:
				self._sql += sh + '\n'
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
		self._save_changes       = True
		self._is_insert_to_table = True
		self._table_name         = table_name
		self._sql                = 'INSERT INTO ' + table_name + ' ' + columns_string + ' VALUES ' + values_string + ';'
		return self

	def SELECT_COUNT(self):
		"""Sets this SQL Query to fetch the number of rows returned."""
		self._sql             = 'SELECT COUNT(*) '
		self._single_response = True
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
			value = keys_and_values[key]
			if value in _DISCRETE_COMPARISONS:
				self._sql += '\t' + key + value + ' AND \n'
			else:
				self._sql += '\t' + key + ' = ' + sql_safe(value) + ' AND \n'
		self._sql = self._sql[:-len(' AND \n')] + ';'
		return self

	def set_to_single_response(self):
		"""Sets this SQL response type to single response."""
		self._single_response = True
		return self

	def is_insert_into_table(self):
		"""Returns a boolean indicating if this SQL query is an insert into a table."""
		return self._is_insert_to_table

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

	@property
	def rows_response(self):
		"""Returns a boolean indicating if the database should return a list of rows as a response to this query."""
		return self._rows_response

	@property
	def table_name(self):
		"""Returns the table name assigned to this SQL query."""
		return self._table_name

	def __str__(self):
		return self._sql


class QueryBooleanResponse(Query):
	"""Represents an SQL Query string which returns a boolean response."""

	def __init__(self):
		super().__init__(False, True, False, False)


class QuerySingleResponse(Query):
	"""Represents an SQL Query string which returns a boolean response."""

	def __init__(self):
		super().__init__(False, False, True, False)


class QueryRowsResponse(Query):
	"""Represents an SQL Query string which returns a boolean response."""

	def __init__(self):
		super().__init__(False, False, False, True)
