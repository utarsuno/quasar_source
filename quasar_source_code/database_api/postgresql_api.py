# coding=utf-8

"""This module, postgresql_api.py, is a simple interface to an AWS hosted PostgreSQL database."""

# Needed for working with PostgreSQL.
import psycopg2
# Useful file + directory operations.
from quasar_source_code.universal_code import useful_file_operations as ufo
# Contains useful paths needed.
from quasar_source_code.universal_code import path_manager as pm
# Used for IDE typing.
from typing import List
# Represents database tables.
from quasar_source_code.database_api import database_tables as db_t


class PostgreSQLAPI(object):
	"""Acts as an API to the PostgreSQL database hosted on RDS."""

	def __init__(self):
		self._database_parameters = ufo.get_ini_section_dictionary(path=pm.get_config_ini(), section_name='postgresql')
		self._connection          = None
		self._cursor              = None

		# Pre-defined tables.
		self._master_table        = db_t.DatabaseTable('master_table', self)
		self._master_table.add_table_field(db_t.TableFieldString('table_name', 30))
		self._master_table.add_table_field(db_t.TableFieldDate('last_updated'))

	def connect(self) -> None:
		"""Connects to the RDS instance."""
		#try:
		self._connection = psycopg2.connect(**self._database_parameters)
		self._cursor     = self._connection.cursor()
		#except psycopg2.OperationalError:
		#	print('Database connection could not be made!')

	def execute_boolean_query(self, query: str, save: bool=False) -> bool:
		"""Executes a query that returns a boolean result."""
		self._cursor.execute(query)
		if save:
			self._connection.commit()
		result = self._cursor.fetchone()[0][0]
		return result

	def execute_custom_query_one_result(self, query: str, save: bool=False):
		"""Execute a custom query that only returns a single result."""
		self._cursor.execute(query)
		if save:
			self._connection.commit()
		return self._cursor.fetchone()

	def execute_query(self, query: str, save: bool=False) -> None:
		"""Executes the query provided."""
		self._cursor.execute(query)
		if save:
			self._connection.commit()

	def get_all_table_names(self) -> List[str]:
		"""Gets the names of all tables in this database."""
		self._cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';")
		result = self._cursor.fetchall()
		table_names = []
		for r in result:
			table_names.append(r[0])
		return table_names

	# Functions to run manually.
	def _create_table_monitor(self):
		"""Creates the table that tracks all other tables."""
		self.execute_query('CREATE TABLE all_tables (table_name varchar(30), last_updated date);', True)

	def terminate(self):
		"""Closes the database connection."""
		self._cursor.close()
		self._connection.close()


api = PostgreSQLAPI()
api.connect()
api.get_all_table_names()


test_table = db_t.DatabaseTable('test_table', api)
test_table.add_table_field(db_t.TableFieldString('hallo', 30))
print(test_table.exists)
test_table.create_if_does_not_exist()


test_table2 = db_t.DatabaseTable('test_table_2', api)
test_table2.add_table_field(db_t.TableFieldString('hallo', 30))
print(test_table2.exists)

print(api.get_all_table_names())

api.terminate()

#api._create_table_monitor()



# [(False,)]

# (False,)

# [(False,)]

