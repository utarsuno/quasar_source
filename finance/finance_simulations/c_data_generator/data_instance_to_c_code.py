# coding=utf-8

"""This module, data_instance_to_c_code.py, converts DataInstance into usable prepared C code."""

from finance.finance_simulations.data_instance import *


class CCode(object):
	"""Represents a collection of c code."""
	def __init__(self):
		self._lines = []

	def add_line(self, s : str):
		"""Adds a line of c code."""
		self._lines.append(s)

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

	def __str__(self):
		s = ''
		for l in self._lines:
			s += l
		return s


def get_c_code_from_list_of_data_instances(data_instances, finance_model):
	"""Returns a text containing c_code that represents the data instances."""
	c_code = CCode()

	if finance_model.type_of_data_needed == DATA_REQUIREMENT_FULL_BOOK_ORDER:
		c_code.add_define_statement('NUMBER_OF_TIME_INSTANCES', len(data_instances))

		number_of_buy_orders_list = []
		number_of_sell_orders_list = []


		# Things to keep track of :
		# 0x0 - Number of time instances.                  {{int number_of_time_segments}}
		# 0x1 - Number of buy orders per time instance.    {{int number_of_buy_orders[number_of_time_segments]}}
		# 0x2 - Number of sell orders per time instance.   {{int number_of_sell_orders[number_of_time_segments]}}
		# 0x3 - Buy prices per time instance.              {{unsigned short buy_prices[number_of_time_segments][number_of_buy_orders[i]]}}
		# 0x3 - Buy amounts per time instance.             {{unsigned short buy_amounts[number_of_time_segments][number_of_buy_orders[i]]}}
		# 0x3 - Sell prices per time instance.             {{unsigned short sell_prices[number_of_time_segments][number_of_sell_orders[i]]}}
		# 0x3 - Sell amounts per time instance.            {{unsigned short buy_amounts[number_of_time_segments][number_of_sell_orders[i]]}}

		for i in data_instances:
			number_of_buy_orders_list.append(i.data[DATA_KEY_NUMBER_OF_BUY_ORDERS])
			number_of_sell_orders_list.append(i.data[DATA_KEY_NUMBER_OF_BUY_ORDERS])
			#print(i)

		c_code.add_defined_1d_list_of_numbers('const int number_of_buy_orders[NUMBER_OF_TIME_INSTANCES] = {ARG};\n', number_of_buy_orders_list)
		c_code.add_defined_1d_list_of_numbers('const int number_of_sell_orders[NUMBER_OF_TIME_INSTANCES] = {ARG};\n', number_of_sell_orders_list)


		return str(c_code)

	else:
		print('SUPPORT THIS KIND OF DATA MODEL!!!')
