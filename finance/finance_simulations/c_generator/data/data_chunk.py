# coding=utf-8

"""This module, data_chunk.py, is a utility file for processing data_instances."""

from finance.finance_simulations.c_generator.data.data_instance import *


def convert_price_to_float_string(p):
	"""Utility function."""
	s = str(p)
	while len(s) < 8:
		s = '0' + s
	return '.' + s


def convert_1d_list_to_string(data):
	"""Utility function."""
	s = ''
	for d in data:
		s += str(d) + ','
	return s[:-1]


def convert_2d_list_to_string(data):
	"""Utility function."""
	s = ''
	for row in data:
		c = '{'
		for e in row:
			c += str(e) + ','
		s += c[-1] + '},\n'
	return s[:-2]


class DataChunk(object):
	"""Processes data instances."""

	def __init__(self, data_instances):
		self._data_instances = data_instances

		self._list_of_prices = []

		self._number_of_buy_orders_list    = []
		self._number_of_sell_orders_list   = []

		self._list_of_list_of_buy_prices   = []
		self._list_of_list_of_buy_amounts  = []
		self._list_of_list_of_sell_prices  = []
		self._list_of_list_of_sell_amounts = []

	def set_needed_data(self, model_builder):
		"""Gives needed information to the model builder."""
		needs_price_define = False
		if DATA_REQUIREMENT_FULL_BOOK_ORDER in model_builder.model.type_of_data_needed:
			needs_price_define = True
			model_builder.add_global_data('const int number_of_buy_orders[NUMBER_OF_TIME_INSTANCES] = {ARG};\n'.replace('ARG', convert_1d_list_to_string(self._number_of_buy_orders_list)))
			model_builder.add_global_data('const int number_of_sell_orders[NUMBER_OF_TIME_INSTANCES] = {ARG};\n'.replace('ARG', convert_1d_list_to_string(self._number_of_sell_orders_list)))
			model_builder.add_global_data('const float all_buy_prices[NUMBER_OF_TIME_INSTANCES][50] = {ARG};\n'.replace('ARG', convert_2d_list_to_string(self._list_of_list_of_buy_prices)))
			model_builder.add_global_data('const float all_buy_amounts[NUMBER_OF_TIME_INSTANCES][50] = {ARG}\n;'.replace('ARG', convert_2d_list_to_string(self._list_of_list_of_buy_amounts)))
			model_builder.add_global_data('const float all_sell_prices[NUMBER_OF_TIME_INSTANCES][50] = {ARG};\n'.replace('ARG', convert_2d_list_to_string(self._list_of_list_of_sell_prices)))
			model_builder.add_global_data('const float all_sell_amounts[NUMBER_OF_TIME_INSTANCES][50] = {ARG};\n'.replace('ARG', convert_2d_list_to_string(self._list_of_list_of_sell_amounts)))

		if DATA_KEY_LAST_PRICE in model_builder.model.type_of_data_needed:
			needs_price_define = True
			model_builder.add_global_data('const float prices[NUMBER_OF_TIME_INSTANCES] = {ARG};\n'.replace('ARG', convert_1d_list_to_string(self._list_of_prices)))

		if needs_price_define:
			model_builder.add_define('NUMBER_OF_TIME_INSTANCES', str(len(self._data_instances)))

	def process_data(self):
		"""Processes the data instances."""
		for i in self._data_instances:

			self._list_of_prices.append(convert_price_to_float_string(i.data[DATA_KEY_LAST_PRICE]))
			self._number_of_buy_orders_list.append(i.data[DATA_KEY_NUMBER_OF_BUY_ORDERS])
			self._number_of_sell_orders_list.append(i.data[DATA_KEY_NUMBER_OF_BUY_ORDERS])

			self._list_of_list_of_buy_prices.append([])
			for e in i.data[DATA_KEY_BUY_PRICES]:
				self._list_of_list_of_buy_prices[-1].append(convert_price_to_float_string(e))

			self._list_of_list_of_buy_amounts.append([])
			for e in i.data[DATA_KEY_BUY_AMOUNTS]:
				self._list_of_list_of_buy_amounts[-1].append(e)

			self._list_of_list_of_sell_prices.append([])
			for e in i.data[DATA_KEY_SELL_PRICES]:
				self._list_of_list_of_sell_prices[-1].append(convert_price_to_float_string(e))

			self._list_of_list_of_sell_amounts.append([])
			for e in i.data[DATA_KEY_SELL_AMOUNTS]:
				self._list_of_list_of_sell_amounts[-1].append(e)
