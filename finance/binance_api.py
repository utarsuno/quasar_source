# coding=utf-8

"""This module, binance_api.py, defines an API for accessing Binance cryptocurrency information."""

import requests as r
from quasar_source_code.universal_code import path_manager as pm

from universal_code import useful_file_operations as ufo


class BinanceAPI(object):
	"""API for using obtaining crypto data."""

	def __init__(self):
		self._api_url   = 'https://api.binance.com'
		self._api_key   = ufo.get_ini_section_dictionary(path=pm.get_config_ini(), section_name='binance_api')
		self.s          = None
		self.listen_key = None

	def connect(self):
		"""Creates a session."""
		self.s = r.Session()
		self.s.headers.update({'Accept': 'application/json',
		                  'User-Agent': 'binance/python',
		                  'X-MBX-APIKEY': self._api_key['api_key']})

		self.listen_key = self.s.post(self._api_url + '/api/v1/userDataStream')

	def get_test(self):
		"""Gets current exchange information."""
		print('test start')
		self.test = self.s.get(self._api_url + '/api/v1/trades', params={'symbol': 'IOTABTC'})
		print(self.test.text)

		text = eval(self.test.text.replace('true', 'True').replace('false', 'False'))

		for t in text:
			print(t)

api = BinanceAPI()
api.connect()
api.get_test()

