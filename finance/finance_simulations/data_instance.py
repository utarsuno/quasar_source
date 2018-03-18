# coding=utf-8

"""This module, data_instance.py, defines a class that represents a single data point."""

from universal_code import useful_file_operations as ufo


class DataInstance(object):
	"""Represents a single data instance."""

	DATA_KEY_UNIX_TIMESTAMP        = 'a'
	DATA_KEY_LAST_PRICE            = 'b'
	DATA_KEY_PRICE_24H_CHANGE      = 'c'
	DATA_KEY_VOLUME_24H            = 'd'
	DATA_KEY_NUMBER_OF_BUY_ORDERS  = 'e'
	DATA_KEY_NUMBER_OF_SELL_ORDERS = 'f'
	DATA_KEY_BUY_PRICES            = 'g'
	DATA_KEY_BUY_AMOUNTS           = 'h'
	DATA_KEY_SELL_PRICES           = 'i'
	DATA_KEY_SELL_AMOUNTS          = 'j'

	DATA_REQUIREMENT_FULL_BOOK_ORDER = 'z0'

	def __init__(self, raw_data):
		self.data = {}

		self.data[DataInstance.DATA_KEY_UNIX_TIMESTAMP] = ufo.get_file_basename(raw_data[0].flags[0])

		data = raw_data[1].split('|')

		self.data[DataInstance.DATA_KEY_LAST_PRICE]            = int(data[0])
		self.data[DataInstance.DATA_KEY_PRICE_24H_CHANGE]      = float(data[1])
		self.data[DataInstance.DATA_KEY_VOLUME_24H]            = float(data[2])
		self.data[DataInstance.DATA_KEY_NUMBER_OF_BUY_ORDERS]  = int(data[3])
		self.data[DataInstance.DATA_KEY_NUMBER_OF_SELL_ORDERS] = int(data[4])

		self.data[DataInstance.DATA_KEY_BUY_PRICES]            = []
		self.data[DataInstance.DATA_KEY_BUY_AMOUNTS]           = []
		self.data[DataInstance.DATA_KEY_SELL_PRICES]           = []
		self.data[DataInstance.DATA_KEY_SELL_AMOUNTS]          = []

		data_index = 5
		i = 0
		while i < self.data[DataInstance.DATA_KEY_NUMBER_OF_BUY_ORDERS]:
			self.data[DataInstance.DATA_KEY_BUY_PRICES].append(int(data[data_index + i]))
			i += 1
		data_index += self.data[DataInstance.DATA_KEY_NUMBER_OF_BUY_ORDERS]
		i = 0
		while i < self.data[DataInstance.DATA_KEY_NUMBER_OF_BUY_ORDERS]:
			self.data[DataInstance.DATA_KEY_BUY_AMOUNTS].append(float(data[data_index + i]))
			i += 1
		data_index += self.data[DataInstance.DATA_KEY_NUMBER_OF_BUY_ORDERS]
		i = 0
		while i < self.data[DataInstance.DATA_KEY_NUMBER_OF_SELL_ORDERS]:
			self.data[DataInstance.DATA_KEY_SELL_PRICES].append(int(data[data_index + i]))
			i += 1
		data_index += self.data[DataInstance.DATA_KEY_NUMBER_OF_SELL_ORDERS]
		i = 0
		while i < self.data[DataInstance.DATA_KEY_NUMBER_OF_SELL_ORDERS]:
			self.data[DataInstance.DATA_KEY_SELL_AMOUNTS].append(float(data[data_index + i]))
			i += 1











'''
		print(self._last_price)
		print(self._price_24h_change)
		print(self._volume_24h)
		print(self._number_of_buy_orders)
		print(self._number_of_sell_orders)

		print()

		print(str(len(self._buy_prices)))
		print(str(len(self._buy_amounts)))
		print(str(len(self._sell_prices)))
		print(str(len(self._sell_amounts)))

		print()

		print(self._buy_prices)
		print(self._buy_amounts)
		print(self._sell_prices)
		print(self._sell_amounts)

		print()
'''