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

	def __init__(self, debug: bool=False):
		self.debug                = debug
		self._database_parameters = ufo.get_ini_section_dictionary(path=pm.get_config_ini(), section_name='postgresql_nexus')
		self._connection          = None
		self._cursor              = None

		# Pre-defined tables.
		self._master_table        = db_t.DatabaseTable('master_table', self)
		self._master_table.add_table_field(db_t.TableFieldString('table_name', 30))
		self._master_table.add_table_field(db_t.TableFieldDate('last_updated'))

	def get_master_table(self) -> db_t.DatabaseTable:
		"""Returns the master table object that's used for caching mechanisms."""
		return self._master_table

	def connect(self) -> None:
		"""Connects to the RDS instance."""
		#try:
		self._connection = psycopg2.connect(**self._database_parameters)
		self._cursor     = self._connection.cursor()
		#except psycopg2.OperationalError:
		#	print('Database connection could not be made!')

	def execute_boolean_query(self, query: str, save: bool=False) -> bool:
		"""Executes a query that returns a boolean result."""
		self.execute_query(query)
		if save:
			self._connection.commit()

		print('PRINTING THE CURSOR DESCRIPTION!!!!!!!! : ' + str(self._cursor.description))
		print('PRINTING THE ROW COUNT!!!!!! : ' + str(self._cursor.rowcount))

		result = self._cursor.fetchone()

		print('DEBUGGING!!!')
		print('The result is : ' + str(result))
		print('DEBUGGING!!!')

		#result = self._cursor.fetchone()[0]
		return result[0]

	def execute_custom_query_one_result(self, query: str, save: bool=False):
		"""Execute a custom query that only returns a single result."""
		self.execute_query(query)
		if save:
			self._connection.commit()
		return self._cursor.fetchone()

	def execute_query_and_get_all_results(self, query: str, save: bool=False):
		"""Executes the query provided and returns all results."""
		self.execute_query(query)
		if save:
			self._connection.commit()
		return self._cursor.fetchall()

	def get_cursor(self):
		"""Returns the database cursor that this api is utilizing."""
		return self._cursor

	def commit(self):
		"""Saves changes to the database."""
		self._connection.commit()

	def execute_query(self, query, save: bool=False) -> None:
		"""Executes the query provided."""
		# TODO : Query can be type of string and tuple.
		if query[-1] != ';':
			query += ';'

		query = query.encode('utf-8')

		try:
			self._cursor.execute(query)
			if save:
				self._connection.commit()
		except Exception as e:
			print('Exception occurred, query was {' + str(query) + '}')
			print('--------------------------------------------------------')
			print('Exception occurred! It was {' + str(e) + '}')
			print('--------------------------------------------------------')

	def get_all_table_names(self) -> List[str]:
		"""Gets the names of all tables in this database."""
		self._cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';")
		result = self._cursor.fetchall()
		table_names = []
		for r in result:
			table_names.append(r[0])
		return table_names

	def terminate(self):
		"""Closes the database connection."""
		self._cursor.close()
		self._connection.close()

	# Functions to run manually.
	def create_database(self, database_name):
		"""Creates a database with the provided name."""
		self._connection.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
		self.execute_query('CREATE DATABASE ' + database_name + ';', save=True)
