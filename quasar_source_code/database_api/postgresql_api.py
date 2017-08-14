# coding=utf-8

"""This module, postgresql_api.py, is a simple interface to an AWS hosted PostgreSQL database."""

# Needed for working with PostgreSQL.
import psycopg2
# Useful file + directory operations.
from quasar_source_code.universal_code import useful_file_operations as ufo
# Contains useful paths needed.
from quasar_source_code.universal_code import path_manager as pm


class PostgreSQLAPI(object):
	"""Acts as an API to the PostgreSQL database hosted on RDS."""

	def __init__(self):
		self._database_parameters = ufo.get_ini_section_dictionary(path=pm.get_config_ini(), section_name= 'postgresql')
		self._connection          = None
		self._cursor              = None

	def connect(self) -> None:
		"""Connects to the RDS instance."""
		# TODO : Add error handeling. (Example : no internet connection avaiable)
		self._connection = psycopg2.connect(**self._database_parameters)
		self._cursor     = self._connection.cursor()

	def execute_

	def _execute_query(self, query: str, save: bool=False) -> None:
		"""Executes the query provided."""
		self._cursor.execute(query)
		if save:
			self._connection.commit()

	# Functions to run manually.
	def _create_table_monitor(self):
		"""Creates the table that tracks all other tables."""
		self._execute_query('CREATE TABLE all_tables (table_name varchar(30), last_updated date);')

api = PostgreSQLAPI()
#api._create_table_monitor()
