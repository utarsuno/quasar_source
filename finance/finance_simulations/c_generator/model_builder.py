# coding=utf-8

"""This document, model_builder.py, builds the base for a c model source file."""

from finance.finance_simulations import data_instance


class ModelBuilder(object):
	"""Builds the base of a model c program file."""

	def __init__(self, model, save_path):
		self._model = model
		self._save_path = save_path + self._model.file_name
		self._libraries = []
		self._define_statements = []
		self._required_data = []

		self._lines = []

		if data_instance.DATA_REQUIREMENT_FULL_BOOK_ORDER in self._required_data:
			self.add_required_data(data_instance.DATA_KEY_NUMBER_OF_BUY_ORDERS)
			self.add_required_data(data_instance.DATA_KEY_NUMBER_OF_SELL_ORDERS)
			self.add_required_data(data_instance.DATA_KEY_BUY_PRICES)
			self.add_required_data(data_instance.DATA_KEY_BUY_AMOUNTS)
			self.add_required_data(data_instance.DATA_KEY_SELL_PRICES)
			self.add_required_data(data_instance.DATA_KEY_SELL_AMOUNTS)
		if data_instance.DATA_KEY_LAST_PRICE in self._required_data:
			self.add_required_data(data_instance.DATA_KEY_LAST_PRICE)

	def add_library(self, library):
		"""Adds a library to this model."""
		self._libraries.append(library)

	def add_define(self, d, v):
		"""Adds a define statement."""
		self._define_statements.append([str(d), str(v)])

	def add_required_data(self, required_data):
		"""Adds a required data type."""
		self._required_data.append(required_data)

	def generate_base_file(self):
		"""Generates the base file."""
		for l in self._libraries:
			print(l)
			print(type(l))
			self.add_line('#include "' + l + '"')
		for ds in self._define_statements:
			self.add_line('#define ' + ds[0] + ' ' + ds[1])

		#for rq in self._required_data:



		with open(self._save_path, 'r')	as file_handler:
			for l in self._lines:
				file_handler.write(l + '\n')


	def add_line(self, s: str):
		"""Adds a line of c code."""
		if '\n' not in s:
			s += '\n'
		self._lines.append(s)

	def add_lines(self, s):
		"""Adds lines of c code."""
		if type(s) == str:
			s = s.split('\n')
		for l in s:
			self.add_line(l)

	#######

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