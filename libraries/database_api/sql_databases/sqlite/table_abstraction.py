# coding=utf-8

"""This module, table_abstraction.py, represents a SQLite table."""


class TableAbstraction(object):
	"""Represents a SQLite table."""

	def __init__(self, table_name, with_row_id=False):
		self._name        = table_name
		self._with_row_id = with_row_id
		self._columns     = []
		self._db          = None

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
				query += column_declaration + '\n'
			query += ');'
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
