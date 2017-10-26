# coding=utf-8

"""This module, finance_classes.py, contains general classes for financial operations and management,"""

from enum import Enum
from datetime import datetime
from typing import List

''' ___  __        __   ___  __
	 |  |__)  /\  |  \ |__  /__`    .
	 |  |  \ /~~\ |__/ |___ .__/    .
'''


class Side(Enum):
	"""The possible sides of a trade transaction."""
	BUY  = 'TRUE'
	SELL = 'FALSE'


class Trade(object):
	"""Represents a single stock transaction."""

	def __init__(self, side: bool, symbol: str, quantity: int, price: float, date: datetime.date, transaction_id: str):
		if side:
			self.side = Side.BUY
		else:
			self.side = Side.SELL
		self.symbol   = symbol
		self.quantity = int(float(quantity))
		self.price    = float(price)
		self.date     = date
		self.id       = int(transaction_id)

	def get_dictionary(self):
		"""Returns this trade as a dictionary."""
		return {'ticker': self.symbol, 'side': self.side.value, 'price': self.price, 'quantity': self.quantity, 'transaction_date': self.date, 'transaction_id': self.id}

	def __repr__(self):
		return 'Trade(symbol=' + self.symbol + ',side=Side.' + self.side.key + ',price=' + self.price + ',quantity=' + self.quantity + 'transaction_id=' + self.id + ')'

	def __str__(self):
		return self.symbol + '\t' + str(self.side.key) + '\t' + str(self.quantity) + '\t' + '$' + str(self.price) + '\t' + str(self.date) + '\t' + str(self.id)

'''  __  ___  __   __        __
	/__`  |  /  \ /  ` |__/ /__`    .
	.__/  |  \__/ \__, |  \ .__/    .
'''


class Share(object):
	"""Represent a single stock share owned."""

	def __init__(self, price: float, date_bought: datetime.date, fifo_value: int):
		self.price       = price
		self.date_bought = date_bought
		self.fifo_value  = fifo_value

	def __repr__(self):
		return 'Share(price=' + str(self.price) + ', date_bought=' + str(self.date_bought) + ', fifo_value=' + str(self.fifo_value) + ')'


class StockShares(object):
	"""Represents a stock type and any contained shares."""

	def __init__(self, symbol: str):
		self.symbol                    = symbol
		self.shares                    = []
		self.net_gained                = 0
		# Variables for properties.
		self._all_cash_invested_ever   = 0
		self._all_cash_returned_ever   = 0
		self._all_cash_from_sales_ever = 0
		# Internal usage. Robinhood sells stocks in a FIFO approach.
		self._current_fifo_value       = 0

	# TODO : Make a method that gets current cash value for date X.

	# TODO : Make a method, number_of_shares_owned_at_date_X

	@property
	def average_cost(self) -> float:
		"""Returns the current average cost of all held shares."""
		average_cost = 0.0
		for s in self.shares:
			average_cost += s.price
		return average_cost / len(self.shares)

	@property
	def number_of_currently_owned_shares(self) -> int:
		"""Returns the number of currently owned shares."""
		return len(self.shares)

	@property
	def current_cash_value(self) -> float:
		"""Returns the current cash value of these shares."""
		# TODO : This needs to grab the latest stock price!!!!!!!!!!!!!!!!!!
		return -1

	@property
	def current_cash_invested(self) -> float:
		"""The current value of all the owned shares."""
		value = 0
		for s in self.shares:
			value += s.price
		return value

	@property
	def all_cash_invested_ever(self) -> float:
		"""Returns all the cash ever invested into this stock."""
		return self._all_cash_invested_ever

	@property
	def all_cash_returned_ever(self) -> float:
		"""Returns all the cash returned ever from this stock."""
		# TODO : THIS REQUIRES FANCIER LOGIC WITH HISTORICAL DATA AND DIVIDENDS!!!
		return -1

	@property
	def all_cash_from_sales_ever(self) -> float:
		"""Returns all the cash returned ever from this stock from just share sells."""
		return self._all_cash_from_sales_ever

	def add_shares(self, quantity: int, price: float, date: datetime.date):
		"""Adds a share to be tracked by this StockShares object."""
		for i in range(quantity):
			self._all_cash_invested_ever += price
			self.shares.append(Share(price, date, self._current_fifo_value))
			self._current_fifo_value += 1

	def remove_shares(self, quantity: int, price: float):
		"""Removes N shares from the oldest bought shares."""
		# First sort the shares in place based off the fifo value.
		self.shares.sort(key=lambda x: x.fifo_value, reverse=False)

		shares_removed = 0
		while shares_removed < quantity:
			if len(self.shares) > 0:
				share = self.shares.pop(0)
			else:
				print('ERROR?')
			self._all_cash_from_sales_ever += price
			shares_removed += 1

	def __str__(self):
		return self.symbol + '\tcurrently own ' + str(self.number_of_currently_owned_shares) + ' shares worth a total of : ' + '\twith an average share price of : ' + str(self.average_cost)

'''  __   __   __  ___  ___  __          __
	|__) /  \ |__)  |  |__  /  \ |    | /  \    .
	|    \__/ |  \  |  |    \__/ |___ | \__/    .
'''


class FinancePortfolio(object):
	"""Represents a stock portfolio."""

	def __init__(self):
		self._current_trade_index = 1
		self.trades               = []
		self.stock_shares         = []

	def _get_stock_shares_object(self, symbol) -> StockShares:
		"""Returns the StockShares object for that stock symbol."""
		return_object = next((x for x in self.stock_shares if x.symbol == symbol), None)
		if return_object is None:
			stock_shares_object = StockShares(symbol)
			self.stock_shares.append(stock_shares_object)
			return stock_shares_object
		return return_object

	'''  __       ___          __   ___ ___       __
		|  \  /\   |   /\     /__` |__   |  |  | |__)    .
		|__/ /~~\  |  /~~\    .__/ |___  |  \__/ |       .
	'''
	def parse_trade_data(self):
		"""Reads the trade data and populates StockShares objects."""
		# First sort the trade list in place based off of the transaction id.
		self.trades.sort(key=lambda x: x.id, reverse=False)

		for t in self.trades:
			stock_shares = self._get_stock_shares_object(t.symbol)

			if t.side == Side.BUY:
				stock_shares.add_shares(t.quantity, t.price, t.date)
			else:
				stock_shares.remove_shares(t.quantity, t.price)

	'''  __       ___       __        __   ___     __       ___          __   ___ ___       __
		|  \  /\   |   /\  |__)  /\  /__` |__     |  \  /\   |   /\     /__` |__   |  |  | |__)    .
		|__/ /~~\  |  /~~\ |__) /~~\ .__/ |___    |__/ /~~\  |  /~~\    .__/ |___  |  \__/ |       .
    '''
	def get_trades(self) -> List[Trade]:
		"""Returns the list of trade objects."""
		return self.trades

	def add_trade(self, trade) -> None:
		"""Adds a trade object to this portfolio."""
		trade.id = self._current_trade_index
		self._current_trade_index += 1
		self.trades.append(trade)

	def set_trades_from_database_rows(self, database_rows) -> None:
		"""Sets the trade objects from the database data retrieved."""
		for r in database_rows:
			self.trades.append(Trade(symbol=r[0], side=r[1], price=r[2], quantity=r[3], date=r[4], transaction_id=r[5]))
