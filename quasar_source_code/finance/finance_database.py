# coding=utf-8

"""This module, finance_database.py, acts as an API to finance data."""

from quasar_source_code.database_api.postgresql_api import PostgreSQLAPI
from quasar_source_code.database_api import database_tables as db_tables
from quasar_source_code.finance import robinhood_data as rh
from quasar_source_code.universal_code import time_abstraction as time
from quasar_source_code.finance import finance_classes as fc


class FinanceDatabase(object):
	"""Finance database API."""

	def __init__(self):
		self.database_api = PostgreSQLAPI()
		self.database_api.connect()

		self.master_table = self.database_api.get_master_table()

		self.finance_table = db_tables.DatabaseTable('finance_table', self.database_api)
		# TODO : ADD A USER FIELD AND ALL THE REQUIRED LOGIC FOR THAT !!!!!!!!!!!!!!!!!!!!!!!!!!
		self.finance_table.add_table_field(db_tables.TableFieldString('ticker', maximum_length=5))
		self.finance_table.add_table_field(db_tables.TableFieldBoolean('buy_or_sell'))
		self.finance_table.add_table_field(db_tables.TableFieldDouble('price'))
		self.finance_table.add_table_field(db_tables.TableFieldInteger('quantity', maximum_value=30000, auto_increment=False))
		self.finance_table.add_table_field(db_tables.TableFieldDate('transaction_date'))
		self.finance_table.add_table_field(db_tables.TableFieldInteger('transaction_id', maximum_value=30000, auto_increment=False))

		self.last_updated = None
		self.trade_portfolio = None

	def _mark_as_updated_in_master_table(self):
		"""Sets last updated in the master table to today's date."""
		self.master_table.set_single_value('last_updated', time.get_today(), 'table_name', self.finance_table.table_name)

	def _set_trade_portfolio(self):
		"""Grabs the initial data needed for the trade portfolio."""
		if self.trade_portfolio is None:
			print('Scraping Robinhood!')
			rs     = rh.RobinhoodScraper()
			self.trade_portfolio = rs.get_trade_portfolio()

	def _initial_data_fill(self):
		"""This method is called when the table is empty and needs to be filled in with Trades."""
		print('Populating the finance table with trades!')
		self._set_trade_portfolio()
		trades = self.trade_portfolio.get_trades()
		rows   = [trade.get_dictionary() for trade in trades]
		self.finance_table.insert_rows(rows)
		self._mark_as_updated_in_master_table()

	def run_health_checks_and_grab_trade_data(self):
		"""Runs any needed database health checks."""
		if not self.finance_table.exists:
			# If the finance table doesn't exist then make sure there is no entry in the Master Table as well.
			self.master_table.delete_row_with_value('table_name', self.finance_table.table_name)

		self.finance_table.create_if_does_not_exist()

		# Ensure that this table exists in the Master Table.
		if not self.master_table.has_value('table_name', self.finance_table.table_name):
			self.master_table.insert_row({'table_name': self.finance_table.table_name, 'last_updated': 'NULL'})

		# Check what the last updated value is.
		self.last_updated = self.master_table.get_single_value('last_updated', 'table_name', self.finance_table.table_name)
		if self.last_updated is None:
			self._initial_data_fill()
		else:
			if self.last_updated < time.get_today():
				print('Updating trade cache since last updated was ' + str(self.last_updated) + ' and it\'s ' + str(time.get_today()))
				self._set_trade_portfolio()

				last_row = self.finance_table.get_row_with_max_value('transaction_id')
				# If there are no records at all then fill the data from scratch.
				if last_row is None:
					self._initial_data_fill()
					return

				last_id = last_row[5]
				rows_to_add = []
				trades = self.trade_portfolio.get_trades()

				if last_id > len(trades):
					for trade in trades:
						if trade.id > last_id:
							rows_to_add.append(trade.get_dictionary())
					self.finance_table.insert_rows(rows_to_add)

				self._mark_as_updated_in_master_table()
			else:
				print('Cache up to date! Populating Trade Portfolio.')
				self.trade_portfolio = fc.FinancePortfolio()
				self.trade_portfolio.set_trades_from_database_rows(self.finance_table.get_row_values())

