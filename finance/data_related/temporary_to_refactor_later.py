# coding=utf-8

"""Refactor later"""

from universal_code import useful_file_operations as ufo
from universal_code import debugging as dbg

DATA_FILE = '/Users/utarsuno/git_repos/quasar_source/configuration_files/temp_data'


API_MY_TRADES_KEY_ID               = 'id'
API_MY_TRADES_KEY_ORDER_ID         = 'orderId'
API_MY_TRADES_KEY_PRICE            = 'price'
API_MY_TRADES_KEY_QUANTITY         = 'qty'
API_MY_TRADES_KEY_COMMISSION       = 'commission'
API_MY_TRADES_KEY_COMMISSION_ASSET = 'commissionAsset'
API_MY_TRADES_KEY_TIME             = 'time'
API_MY_TRADES_KEY_IS_BUYER         = 'isBuyer'
API_MY_TRADES_KEY_IS_MAKER         = 'isMaker'
API_MY_TRADES_KEY_IS_BEST_MATCH    = 'isBestMatch'
API_MY_TRADES_KEY_ALL              = [API_MY_TRADES_KEY_ID,
                                      API_MY_TRADES_KEY_ORDER_ID,
                                      API_MY_TRADES_KEY_PRICE,
                                      API_MY_TRADES_KEY_QUANTITY,
                                      API_MY_TRADES_KEY_COMMISSION,
                                      API_MY_TRADES_KEY_COMMISSION_ASSET,
                                      API_MY_TRADES_KEY_TIME,
                                      API_MY_TRADES_KEY_IS_BUYER,
                                      API_MY_TRADES_KEY_IS_MAKER,
                                      API_MY_TRADES_KEY_IS_BEST_MATCH]


file_text = ufo.get_all_file_lines(DATA_FILE)
for l in file_text:
	data = eval(l)
	print(data)


class AccountTrade(object):
	"""Represents a single unique account trade."""

	def __init__(self, raw_data):
		self._data = {}
		for key in raw_data:
			if key not in API_MY_TRADES_KEY_ALL:
				dbg.raise_exception('Invalid key passed to AccountTrade, key was {' + str(key) + '}')
			else:
				self._data[key] = raw_data[key]


class AccountManager(object):
	"""Performs analysis on account data."""

	def __init__(self):
		self._trades = []

