# coding=utf-8

"""This module, data_instance.py, defines a class that represents a single data point."""

from universal_code import useful_file_operations as ufo


class DataInstance(object):
	"""Represents a single data instance."""

	def __init__(self, raw_data):
		self.unix_timestamp = ufo.get_file_basename(raw_data[0].flags[0])
		print(self.unix_timestamp)

		print('rest of the data is')
		self.data = raw_data[1].split('|')

		self._last_price            = self.data[0]
		self._price_24h_change      = self.data[1]
		self._volume_24h            = self.data[2]
		self._number_of_buy_orders  = self.data[3]
		self._number_of_sell_orders = self.data[4]

		self._buy_prices = []
		self._buy_amounts = []
		self._sell_prices = []
		self._sell_amounts = []

		data_index = 5
		i = 0
		while i < self._number_of_buy_orders:
			self._buy_prices.append(self.data[data_index + i])
			i += 1
		data_index += self._number_of_buy_orders
		i = 0
		while i < self._number_of_buy_orders:
			self._buy_amounts.append(self.data[data_index + i])
			i += 1
		data_index += self._number_of_buy_orders
		i = 0
		while i < self._number_of_sell_orders:
			self._sell_prices.append(self.data[data_index + i])
			i += 1
		data_index += self._number_of_sell_orders
		i = 0
		while i < self._number_of_sell_orders:
			self._sell_amounts.append(self.data[data_index + i])
			i += 1

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