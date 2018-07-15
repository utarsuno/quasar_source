# coding=utf-8

"""This module, column_abstraction.py, represents a column in a SQLite table."""


class SQLiteDataType(object):

	"""Represents a data type in SQLite."""
	def __init__(self, data_type, is_primary_key, is_nullable, is_unique):
		self._data_type      = data_type
		self._is_primary_key = is_primary_key
		self._is_nullable    = is_nullable
		self._is_unique      = is_unique

	@property
	def data_type(self):
		"""Returns the SQLite data-type this object represents."""
		return self._data_type

	def is_primary_key(self) -> bool:
		"""Returns a boolean indicating if this data type is a primary key or not."""
		return self._is_primary_key

	def is_nullable(self) -> bool:
		"""Returns a boolean indicating if this data type is nullable or not."""
		return self._is_nullable

	def is_unique(self) -> bool:
		"""Returns a boolean indicating if this data type is unique or not."""
		return self._is_unique

	def __str__(self):
		s = self._data_type + '_'
		if not self._is_primary_key:
			s += 'NOT-'
		s += 'PRIMARY_'
		if not self._is_nullable:
			s += 'NOT-'
		s += 'NULLABLE_'
		if not self._is_unique:
			s += 'NOT-'
		s += 'UNIQUE'
		return s

class SQLiteDataTypeNULL(object):
	"""Represents the NULL data type in SQLite."""
	def __init__(self, is_primary_key, is_nullable, is_unique):
		super().__init__('NULL', is_primary_key, is_nullable, is_unique)


class SQLiteDataTypeINTEGER(SQLiteDataType):
	"""Represents the INTEGER data type in SQLite."""
	def __init__(self, is_primary_key, is_nullable, is_unique):
		super().__init__('INTEGER', is_primary_key, is_nullable, is_unique)


class SQLiteDataTypeREAL(SQLiteDataType):
	"""Represents the REAL data type in SQLite."""
	def __init__(self, is_primary_key, is_nullable, is_unique):
		super().__init__('REAL', is_primary_key, is_nullable, is_unique)


class SQLiteDataTypeTEXT(SQLiteDataType):
	"""Represents the TEXT data type in SQLite."""
	def __init__(self, is_primary_key, is_nullable, is_unique):
		super().__init__('TEXT', is_primary_key, is_nullable, is_unique)


class SQLiteDataTypeBLOB(SQLiteDataType):
	"""Represents the BLOB data type in SQLite."""
	def __init__(self, is_primary_key, is_nullable, is_unique):
		super().__init__('BLOB', is_primary_key, is_nullable, is_unique)


