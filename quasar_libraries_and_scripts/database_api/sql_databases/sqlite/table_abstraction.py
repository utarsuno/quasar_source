# coding=utf-8

"""This module, table_abstraction.py, represents a SQLite table."""


class TableAbstraction(object):
	"""Represents a SQLite table."""

	def __init__(self, table_name):
		self._name    = table_name
		self._columns = None

	def add_column(self, table_column):
		"""Adds a column to this table."""
		y = 2
