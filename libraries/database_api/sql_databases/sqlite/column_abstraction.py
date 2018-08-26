# coding=utf-8

"""This module, column_abstraction.py, represents a column in a SQLite table."""

_DATA_TYPE_NULL    = 'NULL'
_DATA_TYPE_INTEGER = 'INTEGER'
_DATA_TYPE_REAL    = 'REAL'
_DATA_TYPE_TEXT    = 'TEXT'
_DATA_TYPE_BLOB    = 'BLOB'


class ColumnAbstraction(object):
	"""Represents a column in a SQLite table."""

	def __init__(self, name, data_type, is_primary_key=False, is_nullable=False, is_unique=False, is_foreign_key=False, foreign_key_reference=None):
		self._name                  = name
		self._data_type             = data_type
		self._is_primary_key        = is_primary_key
		self._is_nullable           = is_nullable
		self._is_unique             = is_unique
		self._is_foreign_key        = is_foreign_key
		self._foreign_key_reference = foreign_key_reference

		self.table_instance         = None

	@property
	def name(self):
		"""Returns the name of this column."""
		return self._name

	@property
	def data_type(self):
		"""Returns the data-type of this column."""
		return self._data_type

	@property
	def foreign_key_reference(self):
		"""Returns the foreign key reference."""
		return self._foreign_key_reference

	@foreign_key_reference.setter
	def foreign_key_reference(self, fkr):
		"""Sets the foreign key reference."""
		self._foreign_key_reference = fkr

	@property
	def foreign_key(self) -> bool:
		"""Returns a boolean indicating if this data type is a foreign key or not."""
		return self._is_foreign_key

	@property
	def primary_key(self) -> bool:
		"""Returns a boolean indicating if this data type is a primary key or not."""
		return self._is_primary_key

	@property
	def nullable(self) -> bool:
		"""Returns a boolean indicating if this data type is nullable or not."""
		return self._is_nullable

	@property
	def unique(self) -> bool:
		"""Returns a boolean indicating if this data type is unique or not."""
		return self._is_unique

	@foreign_key.setter
	def foreign_key(self, b) -> bool:
		"""Sets if this column is a foreign key."""
		self._is_foreign_key = b

	@primary_key.setter
	def primary_key(self, b):
		"""Sets if this column is a primary key."""
		self._is_primary_key = b

	@nullable.setter
	def nullable(self, b):
		"""Sets if this column is nullable."""
		self._is_nullable = b

	@unique.setter
	def unique(self, b):
		"""Sets if this column can be unique."""
		self._is_unique = b

	def get_utility_sql_create_statement(self):
		"""Gets a utility string for constructing SQL statements."""
		if self._is_foreign_key:
			return '\t' + self._name + ' ' + self._foreign_key_reference.table_instance.primary_key.data_type + ',\n\tFOREIGN KEY(' + self._name + ') REFERENCES ' + self._foreign_key_reference.table_instance.name + '(' + self._name + '),\n'
		sql = '\t' + self._name + ' ' + self._data_type
		if self._is_primary_key:
			sql += ' PRIMARY KEY'
		if not self._is_nullable:
			sql += ' NOT NULL'
		if self._is_unique:
			sql += ' UNIQUE'
		return sql + ',\n'

	def __str__(self):
		return 'TableColumn(' + self._name + ', ' + str(self._data_type) + ')'


class ColumnAbstractionINTEGER(ColumnAbstraction):
	"""Represents an integer column in an SQLite table."""
	def __init__(self, column_name):
		super().__init__(column_name, _DATA_TYPE_INTEGER)
		self.nullable = True


class ColumnAbstractionNULL(ColumnAbstraction):
	"""Represents a NULL column in an SQLite table."""
	def __init__(self, column_name):
		super().__init__(column_name, _DATA_TYPE_NULL)


class ColumnAbstractionREAL(ColumnAbstraction):
	"""Represents a REAL column in an SQLite table."""
	def __init__(self, column_name):
		super().__init__(column_name, _DATA_TYPE_REAL)


class ColumnAbstractionTEXT(ColumnAbstraction):
	"""Represents a TEXT column in an SQLite table."""
	def __init__(self, column_name):
		super().__init__(column_name, _DATA_TYPE_TEXT)


class ColumnAbstractionBLOB(ColumnAbstraction):
	"""Represents a BLOB column in an SQLite table."""
	def __init__(self, column_name):
		super().__init__(column_name, _DATA_TYPE_BLOB)


class ColumnAbstractionRowIDAlias(ColumnAbstractionINTEGER):
	"""Represents a column in a SQLite table which acts as an alias to the ROW_ID."""
	def __init__(self, column_name, table_instance):
		super().__init__(column_name)
		self.primary_key    = True
		self.table_instance = table_instance


class ColumnAbstractionForeignKey(ColumnAbstraction):
	"""Represents a column in a SQLite table which is a foreign key."""
	def __init__(self, column_reference):
		super().__init__(column_reference.name, None)
		self.foreign_key           = True
		self.foreign_key_reference = column_reference
