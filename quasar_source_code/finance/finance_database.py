# coding=utf-8

"""This module, finance_database.py, acts as an API to finance data."""

from quasar_source_code.database_api.postgresql_api import PostgreSQLAPI
from quasar_source_code.database_api import database_tables as db_tables
from quasar_source_code.finance import robinhood_data as rh

import datetime

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

		self.last_updated = None

	def _initial_data_fill(self):
		"""This method is called when the table is empty and needs to be filled in with Trades."""
		print('Populating the finance table with trades!')
		rs     = rh.RobinhoodScraper()
		trades = rs.get_trades()
		rows   = [trade.get_dictionary() for trade in trades]
		self.finance_table.insert_rows(rows)
		# Make sure to update the Master Table's update field.
		self.master_table.set_single_value('last_updated', datetime.date.today(), 'table_name', self.finance_table.table_name)

	def health_checks(self):
		"""Runs any needed database health checks."""
		self.finance_table.create_if_does_not_exist()

		# Ensure that this table exists in the Master Table.
		if not self.master_table.has_value('table_name', self.finance_table.table_name):
			self.master_table.insert_row({'table_name': self.finance_table.table_name, 'last_updated': 'NULL'})

		# Check what the last updated value is.
		self.last_updated = self.master_table.get_single_value('last_updated', 'table_name', self.finance_table.table_name)
		if self.last_updated is None:
			self._initial_data_fill()
		else:
			print('Last updated is : ' + str(self.last_updated))

			if self.last_updated < datetime.datetime.now().date():
				print('Update cache!')
			else:
				print('Cache up to date!')

