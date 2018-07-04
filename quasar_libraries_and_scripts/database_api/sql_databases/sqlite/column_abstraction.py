# coding=utf-8

"""This module, column_abstraction.py, represents a column in a SQLite table."""


class ColumnAbstraction(object):
	"""Represents a column in a SQLite table."""

	def __init__(self, column_name, column_data_type):
		self._name      = column_name
		self._data_type = column_data_type


class ColumnDictionary(ColumnAbstraction):
	"""Represents a python dictionary in a SQLite table (stored as BLOB)."""

	def __init__(self, column_name):
		super().__init__(column_name, 'BLOB')


class ColumnRegularString(ColumnAbstraction):
	"""Represents a python string (converted to ex: UTF-8) in a SQLite table (stored as TEXT)."""

	def __init__(self, column_name):
		super().__init__(column_name, 'TEXT')

