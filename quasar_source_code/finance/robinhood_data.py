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

from dateutil import parser

# Raw data key names.
SIDE    = 'side'
SYMBOL  = 'symbol'
SHARES  = 'shares'
PRICE   = 'price'
DATE    = 'date'


class Trade(object):
	"""Represents a single stock transaction."""

	def __init__(self, raw_data: dict):
		self.side   = raw_data[SIDE]
		if self.side == 'buy':
			self.side = 'TRUE'
		else:
			self.side = 'FALSE'
		self.symbol = raw_data[SYMBOL]
		self.shares = int(float(raw_data[SHARES]))
		self.price  = raw_data[PRICE]
		self.date   = parser.parse(raw_data[DATE]).date()

	def get_dictionary(self):
		"""Returns this trade as a dictionary."""
		return {'ticker': self.symbol, 'buy_or_sell': self.side, 'price': self.price, 'quantity': self.shares, 'transaction_date': self.date}

	def __str__(self):
		if self.side == 'TRUE':
			return self.symbol + ' - ' + 'buy' + ' - ' + str(self.shares) + ' - ' + str(self.price) + ' - ' + str(self.date)
		else:
			return self.symbol + ' - ' + 'sell' + ' - ' + str(self.shares) + ' - ' + str(self.price) + ' - ' + str(self.date)
		return self.symbol + ' - ' + self.side + ' - ' + str(self.shares) + ' - ' + str(self.price) + ' - ' + str(self.date)


class RobinhoodScraper(object):
	"""Fetches all trade information utilizing 3rd party Robinhood code."""

	def __init__(self):
		self.db = {}

	def get_trades(self) -> List[Trade]:
		"""Gets Trade objects to work with."""
		robinhood_scraper = Robinhood()
		account = ufo.get_ini_section_dictionary(path = pm.get_config_ini(), section_name = 'robinhood')
		robinhood_scraper.login(username = account['username'], password = account['password'])
		past_orders = self._get_all_history_orders(robinhood_scraper)
		orders = [self._order_item_info(order, robinhood_scraper) for order in past_orders]
		t = []
		for o in orders:
			if o['state'] == 'filled':
				t.append(Trade(o))
		return t

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

