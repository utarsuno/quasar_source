# coding=utf-8

"""This module, robinhood_data.py, utilizes a 3rd party un-official Robinhood API."""

# Robinhood API.
from third_party_libraries.Robinhood.Robinhood.Robinhood import Robinhood
# Useful file + directory operations.
from quasar_source_code.universal_code import useful_file_operations as ufo
# Contains useful paths for this project.
from quasar_source_code.universal_code import path_manager as pm
# Used for IDE typing.
from typing import List
# Finance classes.
from quasar_source_code.finance.finance_classes import TradePortfolio
from quasar_source_code.finance.finance_classes import Trade
# Used to get Datetime objects from strings.
from dateutil import parser

# Raw data key names.
SIDE    = 'side'
SYMBOL  = 'symbol'
SHARES  = 'shares'
PRICE   = 'price'
DATE    = 'date'

class RobinhoodScraper(object):
	"""Fetches all trade information utilizing 3rd party Robinhood code."""

	def __init__(self):
		self.db = {}

	def get_trade_portfolio(self) -> TradePortfolio:
		"""Gets a base TradePortfolio object."""
		trade_portfolio = TradePortfolio()
		trades = self._get_trades()
		for t in trades:
			trade_portfolio.add_trade(t)
		return trade_portfolio

	def _get_trades(self) -> List[Trade]:
		"""Gets Trade objects to work with."""
		robinhood_scraper = Robinhood()
		account = ufo.get_ini_section_dictionary(path=pm.get_config_ini(), section_name='robinhood')
		robinhood_scraper.login(username=account['username'], password=account['password'])
		past_orders = self._get_all_history_orders(robinhood_scraper)
		orders = [self._order_item_info(order, robinhood_scraper) for order in past_orders]
		t = []
		for o in orders:
			if o['state'] == 'filled':
				t.append(Trade(side=(o[SIDE] == 'buy'), symbol=o[SYMBOL], quantity=o[SHARES], price=o[PRICE], date=o[DATE], transaction_id=None))
		return reversed(t)

	# Code below based from : https://github.com/Jamonek/Robinhood

	def _get_symbol_from_instrument_url(self, rb_client, url):
		"""3rd party function."""
		if url in self.db:
			instrument = self.db[url]
		else:
			self.db[url] = self._fetch_json_by_url(rb_client, url)
			instrument = self.db[url]
		return instrument['symbol']

	def _fetch_json_by_url(self, rb_client, url):
		"""3rd party function."""
		return rb_client.session.get(url).json()

	def _order_item_info(self, order, rb_client):
		"""3rd party function."""
		symbol = self._get_symbol_from_instrument_url(rb_client, order['instrument'])
		return {
			'side'   : order['side'],
			'price'  : order['average_price'],
			'shares' : order['cumulative_quantity'],
			'symbol' : symbol,
			'date'   : order['last_transaction_at'],
			'state'  : order['state']
		}

	def _get_all_history_orders(self, rb_client):
		"""3rd party function."""
		orders = []
		past_orders = rb_client.order_history()
		orders.extend(past_orders['results'])
		while past_orders['next']:
			next_url = past_orders['next']
			past_orders = self._fetch_json_by_url(rb_client, next_url)
			orders.extend(past_orders['results'])
		return orders

