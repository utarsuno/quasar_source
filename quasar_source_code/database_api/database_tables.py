# coding=utf-8

"""This module, database_tables.py, defines an abstraction to database tables."""


'''          __   __   __  ___          __  ___  ___  __
	|  |\/| |__) /  \ |__)  |     |\ | /  \  |  |__  /__`    .
	|  |  | |    \__/ |  \  |     | \| \__/  |  |___ .__/    .

Not all possible database field types will be represented for now.
This is an abstraction to the database. Efficiency will intentionally be lost
in order to make development easier.
'''


''' ___       __        ___     ___    ___       __   __
	 |   /\  |__) |    |__     |__  | |__  |    |  \ /__`    .
	 |  /~~\ |__) |___ |___    |    | |___ |___ |__/ .__/    .
'''


class TableField(object):
	"""Represents a field to a database table."""

	def __init__(self, field_name, field_type):
		self.field_name = field_name
		self.field_type = field_type


class TableFieldString(TableField):
	"""Represents a string field for a database table."""

	def __init__(self, field_name, maximum_length):
		super().__init__(field_name, 'varchar(' + str(maximum_length) + ')')


class TableFieldDate(TableField):
	"""Represents a date field for a database table."""

	def __init__(self, field_name):
		super().__init__(field_name, 'date')


''' ___       __        ___
	 |   /\  |__) |    |__     .
	 |  /~~\ |__) |___ |___    .
'''


class DatabaseTable(object):
	"""Represents a table in a PostgreSQL database."""

	def __init__(self, table_name, database_api):
		self._table_name   = table_name
		self._database_api = database_api
		self._fields       = []

	def add_table_field(self, table_field: TableField):
		"""Adds a table field definition to this database table."""
		self._fields.append(table_field)

	def create_if_does_not_exist(self):
		"""Creates this table if it does not exist."""
		if not self.exists:
			query = 'CREATE TABLE ' + self._table_name + '('
			for i, f in enumerate(self._fields):
				if i != len(self._fields) - 1:
					query += f.field_name + ' ' + f.field_type + ', '
				else:
					query += f.field_name + ' ' + f.field_type + ');'
					print(query)
					self._database_api.execute_query(query, True)

	@property
	def exists(self) -> bool:
		"""Returns a boolean indicating if this table exists."""
		result = self._database_api.execute_custom_query_one_result("SELECT 1 FROM pg_catalog.pg_class WHERE relkind = 'r' AND relname = '" + self._table_name + "' AND pg_catalog.pg_table_is_visible(oid) LIMIT 1")
		return not (result is None)
