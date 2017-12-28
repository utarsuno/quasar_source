# coding=utf-8

"""This module, data_scraper.py, gathers historical data for crypto-currencies."""

from universal_code import debugging as dbg
from universal_code.time_abstraction import time_abstraction as ta
import requests as r

CRYPTO_CURRENCY_IOTA = 'iota'
CRYPTO_CURRENCY_ALL = [CRYPTO_CURRENCY_IOTA]

COINS = {CRYPTO_CURRENCY_IOTA : ['20130428']}
INDEX_START_DATE = 0


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
		return data

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
				                            self.parse_out_data_from_html_line(data_lines[i + 2]),
				                            self.parse_out_data_from_html_line(data_lines[i + 3]),
				                            self.parse_out_data_from_html_line(data_lines[i + 4]),
				                            self.parse_out_data_from_html_line(data_lines[i + 5]),
				                            self.parse_out_data_from_html_line(data_lines[i + 6]),
				                            self.parse_out_data_from_html_line(data_lines[i + 7])))

		return all_day_data

