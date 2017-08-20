# coding=utf-8

"""This module, finance_classes.py, contains general classes for financial operations and management,"""

from enum import Enum
from datetime import datetime


class TradePortfolio(object):
	"""Represents a stock portfolio."""

	def __init__(self):
		self._current_trade_index = 1
		self.trades = []

	'''  __       ___          __   ___ ___       __
		|  \  /\   |   /\     /__` |__   |  |  | |__)    .
		|__/ /~~\  |  /~~\    .__/ |___  |  \__/ |       .
	'''
	def get_trades(self) -> None:
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

'''  __  ___  __   __        __
	/__`  |  /  \ /  ` |__/ /__`    .
	.__/  |  \__/ \__, |  \ .__/    .
'''


class StockShares(object):
	"""Represents a stock type and any contained shares."""

	def __init__(self, symbol: str):
		self.symbol = symbol

''' ___  __        __   ___  __
	 |  |__)  /\  |  \ |__  /__`    .
	 |  |  \ /~~\ |__/ |___ .__/    .
'''


class Side(Enum):
	"""The possible sides of a trade transaction."""
	BUY  = 'BUY'
	SELL = 'SELL'


class Trade(object):
	"""Represents a single stock transaction."""

	def __init__(self, side: bool, symbol: str, quantity: int, price: float, date: datetime.date, transaction_id: str):
		if side:
			self.side = Side.BUY
		else:
			self.side = Side.SELL
		self.symbol   = symbol
		self.quantity = quantity
		self.price    = price
		self.date     = date
		self.id       = transaction_id

	def get_dictionary(self):
		"""Returns this trade as a dictionary."""
		return {'ticker': self.symbol, 'side': self.side.value, 'price': self.price, 'quantity': self.quantity, 'transaction_date': self.date, 'transaction_id': self.id}

	def __str__(self):
		return self.symbol + '\t' + self.side.value + '\t' + str(self.quantity) + str(self.price) + '\t' + str(self.date) + '\t' + str(self.id)