# coding=utf-8

"""This module, data_instance_to_c_code.py, converts DataInstance into usable prepared C code."""

from finance.finance_simulations.data_instance import *


class CCode(object):
	"""Represents a collection of c code."""
	def __init__(self):
		self._lines = []

	def add_line(self, s: str):
		"""Adds a line of c code."""
		self._lines.append(s)

	def add_lines(self, s):
		"""Adds lines of c code."""
		if type(s) == str:
			s = s.split('\n')
		for l in s:
			self.add_line(l + '\n')

	def add_define_statement(self, d, v):
		"""Adds a define statement."""
		self.add_line('#define ' + str(d) + ' ' + str(v) + '\n')

	def add_defined_1d_list_of_numbers(self, list_declaration, list_of_numbers):
		"""Utility function."""
		numbers = ''
		for n in list_of_numbers:
			numbers += str(n) + ','
		numbers = numbers[:-1]
		self.add_line(list_declaration.replace('ARG', numbers))

	def add_defined_2d_list_of_numbers(self, list_declaration, list_of_list_of_numbers):
		"""Utility function."""
		code_text = ''
		for row in list_of_list_of_numbers:
			single_row = '{'
			for n in row:
				single_row += str(n) + ','
			single_row = single_row[:-1] + '},\n'
			code_text += single_row
		self.add_lines(list_declaration.replace('ARG', code_text[:-2]))

	def __str__(self):
		s = ''
		for l in self._lines:
			s += l
		return s


def convert_price_to_float_string(p):
	"""Utility function."""
	s = str(p)
	while len(s) < 8:
		s = '0' + s
	return '.' + s


def get_c_code_from_list_of_data_instances(data_instances, finance_model):
	"""Returns a text containing c_code that represents the data instances."""
	c_code = CCode()

	if DATA_REQUIREMENT_FULL_BOOK_ORDER in finance_model.type_of_data_needed and DATA_KEY_LAST_PRICE in finance_model.type_of_data_needed:
		c_code.add_define_statement('NUMBER_OF_TIME_INSTANCES', len(data_instances))

		list_of_prices = []

		number_of_buy_orders_list = []
		number_of_sell_orders_list = []

		list_of_list_of_buy_prices = []
		list_of_list_of_buy_amounts = []
		list_of_list_of_sell_prices = []
		list_of_list_of_sell_amounts = []

		for i in data_instances:
			#print(str(i))

			list_of_prices.append(convert_price_to_float_string(i.data[DATA_KEY_LAST_PRICE]))
			number_of_buy_orders_list.append(i.data[DATA_KEY_NUMBER_OF_BUY_ORDERS])
			number_of_sell_orders_list.append(i.data[DATA_KEY_NUMBER_OF_BUY_ORDERS])

			list_of_list_of_buy_prices.append([])
			for e in i.data[DATA_KEY_BUY_PRICES]:
				list_of_list_of_buy_prices[-1].append(convert_price_to_float_string(e))

			list_of_list_of_buy_amounts.append([])
			for e in i.data[DATA_KEY_BUY_AMOUNTS]:
				list_of_list_of_buy_amounts[-1].append(e)

			list_of_list_of_sell_prices.append([])
			for e in i.data[DATA_KEY_SELL_PRICES]:
				list_of_list_of_sell_prices[-1].append(convert_price_to_float_string(e))

			list_of_list_of_sell_amounts.append([])
			for e in i.data[DATA_KEY_SELL_AMOUNTS]:
				list_of_list_of_sell_amounts[-1].append(e)

		# Include statements needed.
		c_code.add_line('#include <stdio.h>\n')
		c_code.add_line('#include <stdlib.h>\n')

		# Program arguments for the weights to run the simulation on.
		c_code.add_define_statement('ARGUMENT_INDEX_WEIGHT_0', '1')
		c_code.add_define_statement('ARGUMENT_INDEX_WEIGHT_1', '2')
		c_code.add_define_statement('ARGUMENT_INDEX_WEIGHT_2', '3')
		c_code.add_define_statement('ARGUMENT_INDEX_WEIGHT_3', '4')

		# All the pre-defined data for the program.
		c_code.add_defined_1d_list_of_numbers('const float prices[NUMBER_OF_TIME_INSTANCES] = {ARG};\n', list_of_prices)
		c_code.add_defined_1d_list_of_numbers('const int number_of_buy_orders[NUMBER_OF_TIME_INSTANCES] = {ARG};\n', number_of_buy_orders_list)
		c_code.add_defined_1d_list_of_numbers('const int number_of_sell_orders[NUMBER_OF_TIME_INSTANCES] = {ARG};\n', number_of_sell_orders_list)
		c_code.add_defined_2d_list_of_numbers('const float all_buy_prices[NUMBER_OF_TIME_INSTANCES][50] = {ARG};\n', list_of_list_of_buy_prices)
		c_code.add_defined_2d_list_of_numbers('const float all_buy_amounts[NUMBER_OF_TIME_INSTANCES][50] = {ARG};\n', list_of_list_of_buy_amounts)
		c_code.add_defined_2d_list_of_numbers('const float all_sell_prices[NUMBER_OF_TIME_INSTANCES][50] = {ARG};\n', list_of_list_of_sell_prices)
		c_code.add_defined_2d_list_of_numbers('const float all_sell_amounts[NUMBER_OF_TIME_INSTANCES][50] = {ARG};\n', list_of_list_of_sell_amounts)

		return str(c_code)

	else:
		print('SUPPORT THIS KIND OF DATA MODEL!!!')


