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
		# First get the connection information.
		self._database_parameters = ufo.get_ini_section_dictionary(path=pm.get_config_ini(), section_name= 'postgresql')
		# Now try to connect to the database.
		self._connection          = self._connect_to_database()
		self._cursor              = self._connection.cursor()

	def _execute_query(self, query: str, save: bool=False):
		"""Executes the query provided."""
		self._cursor.execute(query)
		if save:
			self._connection.commit()

	def _connect_to_database(self):
		self._connection = psycopg2.connect(**self._database_parameters)
		return self._connection

api = PostgreSQLAPI()

