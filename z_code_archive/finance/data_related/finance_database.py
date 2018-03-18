# coding=utf-8

"""This module, finance_database.py, provides an abstraction layer to working with Finance data."""

import math

from database_api.nosql_databases import mongodb_api as mongo
from universal_code import debugging as dbg
from universal_code import output_coloring as oc
from z_code_archive.finance.data_related import data_scraper as ds


class FinanceDatabase(object):
	"""API for working with the finance data."""

	def __init__(self, debug=False):
		self._debug         = debug

		self._data_scraper  = ds.DataScraper()

		self._db_connection = mongo.MongoDBAPI()
		self._coins			= {}
		self._coins[ds.CRYPTO_CURRENCY_IOTA] = self._db_connection.get_collection('day_data_' + ds.CRYPTO_CURRENCY_IOTA)
		self._iota = self._coins[ds.CRYPTO_CURRENCY_IOTA]
		if self._debug:
			oc.print_data_with_red_dashes_at_start('Finance Database connected!')

	def health_check(self):
		"""Performs a health check on the database."""
		oc.print_data_with_red_dashes_at_start('Running health check on database!')
		iota_data = self._get_all_database_day_data_for(ds.CRYPTO_CURRENCY_IOTA)
		if iota_data is None or len(iota_data) == 0:
			oc.print_data_with_red_dashes_at_start('IOTA has no data, populating now!')
			all_day_data = self._data_scraper.get_all_day_data_for(ds.CRYPTO_CURRENCY_IOTA)
			for dd in all_day_data:
				self._iota.insert(dd.to_json())
		else:
			y = 2
			# TODO : Check if the latest data is needed!!!

	def _get_all_database_day_data_for(self, coin):
		"""Returns the database day data for this coin."""
		if coin not in self._coins:
			dbg.raise_exception('Day data not available for : {' + str(coin) + '}')
		return self._iota.get_all()

	def get_all_vector_day_data_for(self, coin):
		"""Returns the vector day data for this coin."""
		if coin not in self._coins:
			dbg.raise_exception('Day data not available for : {' + str(coin) + '}')

		all_data = self._iota.get_all()
		all_vector_data = []
		for d in all_data:
			all_vector_data.append(ds.DayData(d=d['date'],
			                                  o=d['open'],
			                                  h=d['high'],
			                                  l=d['low'],
			                                  c=d['close'],
			                                  v=d['volume'],
			                                  mc=d['market_cap']))

		all_vector_data = list(reversed(all_vector_data))
		normalized_all_vector_data = []

		for i, d in enumerate(all_vector_data):
			if i != 0:
				# Previous day.
				pd = all_vector_data[i - 1].vector_data
				# Current day.
				cd = all_vector_data[i].vector_data

				normalized_all_vector_data.append([math.erf(cd[ds.VECTOR_DATA_INDEX_OPEN]       - pd[ds.VECTOR_DATA_INDEX_OPEN]),
				                                   math.erf(cd[ds.VECTOR_DATA_INDEX_HIGH]       - pd[ds.VECTOR_DATA_INDEX_HIGH]),
				                                   math.erf(cd[ds.VECTOR_DATA_INDEX_LOW]        - pd[ds.VECTOR_DATA_INDEX_LOW]),
				                                   math.erf(cd[ds.VECTOR_DATA_INDEX_CLOSE]      - pd[ds.VECTOR_DATA_INDEX_CLOSE]),
				                                   math.erf(cd[ds.VECTOR_DATA_INDEX_VOLUME]     - pd[ds.VECTOR_DATA_INDEX_VOLUME]),
				                                   math.erf(cd[ds.VECTOR_DATA_INDEX_MARKET_CAP] - pd[ds.VECTOR_DATA_INDEX_MARKET_CAP])])

		return normalized_all_vector_data

	def terminate(self):
		"""Terminates the connection to the database."""
		self._db_connection.terminate()

