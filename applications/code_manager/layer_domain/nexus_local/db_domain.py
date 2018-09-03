# coding=utf-8

"""This module, db_entities_base.py, provides base abstractions for DB entities (tables + logic)."""

from libraries.database_abstraction.sql.sqlite import sqlite_db
from libraries.database_abstraction.sql.sqlite import table_abstraction as table
from libraries.universal_code import debugging as dbg


class DBDomain(object):
	"""Represents a DB connection to code_manager."""

	def __init__(self, db_location, debug_on=False):
		self._db_location = db_location
		self._db          = sqlite_db.SQLiteDB(self._db_location, debug_on)
		self._db.connect()


class DBEntity(object):
	"""Represents a DB entity, the table layout and business logic."""

	def __init__(self, table_name, parent_db_entity=None):
		self._table      = table.TableAbstraction(table_name)
		self._parent     = parent_db_entity
		self._parent_key = None
		self._children   = []

		if parent_db_entity is not None:
			self._table.add_column_foreign_key(self.parent.table.primary_key)
			self._parent.add_child(self)

	def get_parent_foreign_key_name(self):
		"""Utility function."""
		return self.parent.table.primary_key.name

	def ensure_data(self):
		"""Ensures any data that needs to exist, does."""
		pass

	def delete(self):
		"""Deletes all the data of this DB Entity."""
		self._table.delete()

	def load_children(self, db=None):
		"""Loads the children DB Entities of this Entity."""
		for c in self._children:
			c.initial_load(db)

	def initial_load(self, db=None):
		"""Loads this DB Entity and all children of it."""
		if db is None:
			db = self._db

		db.add_table(self._table)
		self._table.create()

		if self._parent is not None:
			self._parent_key = self.get_parent_foreign_key_name()

		self.ensure_data()
		self.load_children(db)

	def add_child(self, db_entity):
		"""Adds a children DBEntity to this DBEntity."""
		self._children.append(db_entity)

	@property
	def children(self):
		"""Returns the children DBEntities of this DBEntity."""
		return self._children

	@property
	def parent_key(self):
		"""Returns the parent primary key."""
		return self._parent_key

	@property
	def parent(self):
		"""Returns the parent DBEntity of this DBEntity."""
		return self._parent

	@property
	def table(self):
		"""Returns the table object of this DB Entity."""
		return self._table

