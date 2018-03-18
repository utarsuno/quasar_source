# coding=utf-8

"""This module, data_instance_to_c_code.py, converts DataInstance into usable prepared C code."""

from finance.finance_simulations.data_instance import *


def get_c_code_from_list_of_data_instances(data_instances, finance_model):
	"""Returns a text containing c_code that represents the data instances."""

	print(finance_model.type_of_data_needed)
	print(DATA_REQUIREMENT_FULL_BOOK_ORDER)
	print(finance_model.type_of_data_needed == DATA_REQUIREMENT_FULL_BOOK_ORDER)

	if finance_model.type_of_data_needed == DATA_REQUIREMENT_FULL_BOOK_ORDER:
		for i in data_instances:
			print(i)
	else:
		print('SUPPORT THIS KIND OF DATA MODEL!!!')
