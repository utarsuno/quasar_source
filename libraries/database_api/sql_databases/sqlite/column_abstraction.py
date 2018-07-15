# coding=utf-8

"""This module, column_abstraction.py, represents a column in a SQLite table."""


class ColumnAbstraction(object):
	"""Represents a column in a SQLite table."""

	def __init__(self, column_name, column_data_type):
		self._name      = column_name
		self._data_type = column_data_type

	@property
	def name(self):
		"""Returns the name of this column."""
		return self._name

	@property
	def data_type(self):
		"""Returns the data-type of this column."""
		return self._data_type

	def __str__(self):
		return 'TableColumn(' + self._name + ', ' + str(self._data_type) + ')'
