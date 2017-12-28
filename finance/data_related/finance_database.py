# coding=utf-8

"""This module, finance_database.py, provides an abstraction layer to working with Finance data."""

from database_api.nosql_databases import mongodb_api as mongo
from finance.data_related import data_scraper as ds
from universal_code import debugging as dbg


class FinanceDatabase(object):
	"""API for working with the finance data."""

	def __init__(self):
		self._db_connection = mongo.MongoDBAPI()
		self._coins			= {}
		self._coins[ds.CRYPTO_CURRENCY_IOTA] = self._db_connection.get_collection('day_data_' + ds.CRYPTO_CURRENCY_IOTA)
		self._iota = self._coins[ds.CRYPTO_CURRENCY_IOTA]

	def get_all_day_data_for(self, coin):
		if coin not in self._coins:
			dbg.raise_exception('Day data not available for : {' + str(coin) + '}')

		data = self._iota.get_all()
		print(data)

	def terminate(self):
		"""Terminates the connection to the database."""
		self._db_connection.terminate()

