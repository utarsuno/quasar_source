# coding=utf-8

"""This module, finance_database.py, acts as an API to finance data."""

from quasar_source_code.database_api.postgresql_api import PostgreSQLAPI
from quasar_source_code.database_api import database_tables as db_tables


class FinanceDatabase(object):
	"""Finance database API."""

	def __init__(self):
		self.database_api = PostgreSQLAPI()
		self.database_api.connect()

		self.finance_table = db_tables.DatabaseTable('finance_table', self.database_api)


	def health_checks(self):
		"""Runs any needed database health checks."""

		# Make sure 'trades' exists in the table monitor table.
