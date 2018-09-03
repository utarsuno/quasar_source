# coding=utf-8

"""This module, column_abstraction.py, represents a column in a SQLite table."""

_DATA_TYPE_NULL     = 'NULL'
_DATA_TYPE_INTEGER  = 'INTEGER'
_DATA_TYPE_REAL     = 'REAL'
_DATA_TYPE_TEXT     = 'TEXT'
_DATA_TYPE_BLOB     = 'BLOB'
_DATA_TYPE_DATETIME = 'DATETIME'
_DATA_TYPE_BOOLEAN  = 'BOOLEAN'


class ColumnAbstraction(object):
	"""Represents a column in a SQLite table."""

	def __init__(self, name, data_type, primary_key=False, nullable=False, unique=False, foreign_key_reference=None, indexed=False):
		self._name                  = name
		self._data_type             = data_type
		self._primary_key           = primary_key
		self._nullable              = nullable
		self._unique                = unique
		self._indexed               = indexed
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

	@property
	def indexed(self):
		"""Returns a boolean indicating if this column is indexed."""
		return self._indexed

	@foreign_key_reference.setter
	def foreign_key_reference(self, fkr):
		"""Sets the foreign key reference."""
		self._foreign_key_reference = fkr

	@property
	def foreign_key(self) -> bool:
		"""Returns a boolean indicating if this data type is a foreign key or not."""
		return self._foreign_key_reference is not None

	@property
	def primary_key(self) -> bool:
		"""Returns a boolean indicating if this data type is a primary key or not."""
		return self._primary_key

	@property
	def nullable(self) -> bool:
		"""Returns a boolean indicating if this data type is nullable or not."""
		return self._nullable

	@property
	def unique(self) -> bool:
		"""Returns a boolean indicating if this data type is unique or not."""
		return self._unique

	@primary_key.setter
	def primary_key(self, b):
		"""Sets if this column is a primary key."""
		self._primary_key = b

	@nullable.setter
	def nullable(self, b):
		"""Sets if this column is nullable."""
		self._nullable = b

	@indexed.setter
	def indexed(self, i):
		"""Sets this column if it should be indexed or not."""
		self._indexed = i

	@unique.setter
	def unique(self, b):
		"""Sets if this column can be unique."""
		self._unique = b

	def get_utility_sql_create_statement(self):
		"""Gets a utility string for constructing SQL statements."""
		if self.foreign_key:
			return '\t' + self._name + ' ' + self._foreign_key_reference.table_instance.primary_key.data_type + ',\n\tFOREIGN KEY(' + self._name + ') REFERENCES ' + self._foreign_key_reference.table_instance.name + '(' + self._name + ') ON DELETE CASCADE,\n'
		sql = '\t' + self._name + ' ' + self._data_type
		if self._primary_key:
			sql += ' PRIMARY KEY'
		if not self._nullable:
			sql += ' NOT NULL'
		if self._unique:
			sql += ' UNIQUE'
		return sql + ',\n'

	def __str__(self):
		return 'TableColumn(' + self._name + ', ' + str(self._data_type) + ')'


class ColumnAbstractionINTEGER(ColumnAbstraction):
	"""Represents an integer column in an SQLite table."""
	def __init__(self, column_name, nullable=False, unique=False, indexed=False):
		super().__init__(column_name, _DATA_TYPE_INTEGER, nullable=nullable, unique=unique, indexed=indexed)


class ColumnAbstractionNULL(ColumnAbstraction):
	"""Represents a NULL column in an SQLite table."""
	def __init__(self, column_name, nullable=False, unique=False, indexed=False):
		super().__init__(column_name, _DATA_TYPE_NULL, nullable=nullable, unique=unique, indexed=indexed)


class ColumnAbstractionREAL(ColumnAbstraction):
	"""Represents a REAL column in an SQLite table."""
	def __init__(self, column_name, nullable=False, unique=False, indexed=False):
		super().__init__(column_name, _DATA_TYPE_REAL, nullable=nullable, unique=unique, indexed=indexed)


class ColumnAbstractionTEXT(ColumnAbstraction):
	"""Represents a TEXT column in an SQLite table."""
	def __init__(self, column_name, nullable=False, unique=False, indexed=False):
		super().__init__(column_name, _DATA_TYPE_TEXT, nullable=nullable, unique=unique, indexed=indexed)


class ColumnAbstractionDATETIME(ColumnAbstraction):
	"""Represents a DATETIME column in an SQLite table."""
	def __init__(self, column_name, nullable=False, unique=False, indexed=False):
		super().__init__(column_name, _DATA_TYPE_DATETIME, nullable=nullable, unique=unique, indexed=indexed)


class ColumnAbstractionBOOLEAN(ColumnAbstraction):
	"""Represents a BOOLEAN column in an SQLite table."""
	def __init__(self, column_name, nullable=False, unique=False, indexed=False):
		super().__init__(column_name, _DATA_TYPE_BOOLEAN, nullable=nullable, unique=unique, indexed=indexed)


class ColumnAbstractionBLOB(ColumnAbstraction):
	"""Represents a BLOB column in an SQLite table."""
	def __init__(self, column_name, nullable=False, unique=False, indexed=False):
		super().__init__(column_name, _DATA_TYPE_BLOB, nullable=nullable, unique=unique, indexed=indexed)


class ColumnAbstractionRowIDAlias(ColumnAbstractionINTEGER):
	"""Represents a column in a SQLite table which acts as an alias to the ROW_ID."""
	def __init__(self, table_instance):
		super().__init__(table_instance.name_id)
		self.primary_key    = True
		self.table_instance = table_instance


class ColumnAbstractionForeignKey(ColumnAbstraction):
	"""Represents a column in a SQLite table which is a foreign key."""
	def __init__(self, column_reference):
		super().__init__(column_reference.name, None)
		self.foreign_key_reference = column_reference
