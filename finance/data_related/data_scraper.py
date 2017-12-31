# coding=utf-8

"""This module, data_scraper.py, gathers historical data for crypto-currencies."""

import struct
from universal_code import debugging as dbg
from universal_code.time_abstraction import time_abstraction as ta
import requests as r

KEY_DATE       = 'date'
KEY_OPEN       = 'open'
KEY_HIGH       = 'high'
KEY_LOW        = 'low'
KEY_CLOSE      = 'close'
KEY_VOLUME     = 'volume'
KEY_MARKET_CAP = 'market_cap'

CRYPTO_CURRENCY_IOTA = 'iota'
CRYPTO_CURRENCY_ALL = [CRYPTO_CURRENCY_IOTA]

COINS = {CRYPTO_CURRENCY_IOTA : ['20130428']}
INDEX_START_DATE = 0

VECTOR_DATA_INDEX_OPEN       = 0
VECTOR_DATA_INDEX_HIGH       = 1
VECTOR_DATA_INDEX_LOW        = 2
VECTOR_DATA_INDEX_CLOSE      = 3
VECTOR_DATA_INDEX_VOLUME     = 4
VECTOR_DATA_INDEX_MARKET_CAP = 5


class DayData(object):
	"""Represents a single instance of a coin's day data."""

	def __init__(self, d, o, h, l, c, v, mc):
		self.date       = d
		self.open       = o
		self.high       = h
		self.low        = l
		self.close      = c
		self.volume     = v
		self.market_cap = mc
		self._json      = {KEY_DATE       : self.date,
					       KEY_OPEN       : self.open,
					       KEY_HIGH       : self.high,
					       KEY_LOW        : self.low,
					       KEY_CLOSE      : self.close,
					       KEY_VOLUME     : self.volume,
					       KEY_MARKET_CAP : self.market_cap}

	@property
	def json(self):
		"""Get database friendly data of this DayData."""
		return self._json

	@property
	def vector_data(self) -> list:
		"""Get data needed for a neural network."""
		return [float(self.open.replace(',', '')), float(self.high.replace(',', '')), float(self.low.replace(',', '')), float(self.close.replace(',', '')), float(self.volume.replace(',', '')), float(self.market_cap.replace(',', ''))]

	def field_to_c_binary(self, field):
		"""Returns a c compatible binary representation of this DayData field's value."""
		return bytearray(struct.pack('f', self.json[field]))

	def __str__(self):
		return str(self.date) + '|' + str(self.open) + '|' + str(self.high) + '|' + str(self.low) + '|' + str(self.close) + '|' + str(self.volume) + '|' + str(self.market_cap)


class DataScraper(object):
	"""An API for scraping crypto-currency historical data."""

	def __init__(self):
		self._historical_data_url = 'https://coinmarketcap.com/currencies/TICKER/historical-data/?start=START&end=END'
		self.today = ta.DayInstance(ta.THIS_DAY)

	def parse_out_data_from_html_line(self, html_line):
		"""Returns the data found in the html line provided."""
		if '</td>' not in html_line:
			dbg.raise_exception('Invalid HTML line to parse provided! = {' + str(html_line) + '}')
		data = ''
		in_data = False
		for c in html_line:
			if in_data:
				if c == '<':
					break
				data += c
			if c == '>':
				in_data = True
		# ',' Only applies the the MARKET_CAP value.
		return data.replace(',', '')

	def get_all_day_data_for(self, coin):
		"""Retrieves a list of DayData objects for the provided crypto coin."""
		if coin not in CRYPTO_CURRENCY_ALL:
			dbg.raise_exception('Not valid crypto coin passed in!')

		data_url = self._historical_data_url.replace('TICKER', coin).replace('START', COINS[coin][INDEX_START_DATE]).replace('END', self.today.to_string_format('YYYYMMDD'))

		response = r.get(data_url)
		if response.status_code != 200:
			dbg.raise_exception('Could not load data url! + {' + data_url + '}')

		# Parse the data from the HTML
		all_day_data = []

		lines = response.text.split('\n')
		in_data = False
		data_lines = []
		for l in lines:
			if in_data:
				if l.strip() == '</div>':
					break
				data_lines.append(l)
			if l.strip() == '<div class="table-responsive">':
				in_data = True

		for i, l in enumerate(data_lines):
			if l.strip() == '<tr class="text-right">':
				all_day_data.append(DayData(self.parse_out_data_from_html_line(data_lines[i + 1]),
				                            float(self.parse_out_data_from_html_line(data_lines[i + 2])),
				                            float(self.parse_out_data_from_html_line(data_lines[i + 3])),
				                            float(self.parse_out_data_from_html_line(data_lines[i + 4])),
				                            float(self.parse_out_data_from_html_line(data_lines[i + 5])),
				                            float(self.parse_out_data_from_html_line(data_lines[i + 6])),
				                            float(self.parse_out_data_from_html_line(data_lines[i + 7]))))

		return all_day_data

