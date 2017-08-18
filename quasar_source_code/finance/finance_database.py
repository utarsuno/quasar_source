# coding=utf-8

"""This module, finance_database.py, acts as an API to finance data."""

from quasar_source_code.database_api.postgresql_api import PostgreSQLAPI
from quasar_source_code.database_api import database_tables as db_tables
from quasar_source_code.finance import robinhood_data as rh


class FinanceDatabase(object):
	"""Finance database API."""

	def __init__(self):
		self.database_api = PostgreSQLAPI()
		self.database_api.connect()

		self.master_table = self.database_api.get_master_table()

		self.finance_table = db_tables.DatabaseTable('finance_table', self.database_api)
		self.finance_table.add_table_field(db_tables.TableFieldString('ticker', maximum_length=5))
		self.finance_table.add_table_field(db_tables.TableFieldBoolean('buy_or_sell'))
		self.finance_table.add_table_field(db_tables.TableFieldDouble('price'))
		self.finance_table.add_table_field(db_tables.TableFieldInteger('quantity', maximum_value=30000))
		self.finance_table.add_table_field(db_tables.TableFieldDate('transaction_date'))

		self.cache_needs_to_be_updated = None

	def health_checks(self):
		"""Runs any needed database health checks."""
		self.finance_table.create_if_does_not_exist()

		# Check if the finance table exists in the master table.
		if not self.master_table.has_value('table_name', self.finance_table.table_name):
			self.master_table.insert_row({'table_name': self.finance_table.table_name, 'last_updated': 'NULL'})
			self.cache_needs_to_be_updated = True

		if self.cache_needs_to_be_updated is None:
			last_updated = self.master_table.get_single_value('last_updated', 'table_name', self.finance_table.table_name)
			if last_updated is None:
				self.cache_needs_to_be_updated = True
			# TODO : If the date is today then needs to be cached is false. Otherwise it's true.

		if self.cache_needs_to_be_updated:
			rs = rh.RobinhoodScraper()
			trades = rs.get_trades()
			for trade in trades:
				print(trade)
