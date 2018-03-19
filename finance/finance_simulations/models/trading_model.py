# coding=utf-8

"""This module, trading_model.py, represents a trading model used in both training and testing."""


FINANCE_MODEL_TYPE_M0 = 'm0_net_resistance'


class FinanceModel(object):
	"""Represents a financial model that can be both trained and tested."""

	def __init__(self, model_type, types_of_data_needed):
		self._model_type = model_type
		self._types_of_data_needed = types_of_data_needed
		self._weights = []

		self._required_libraries = []
		self._required_defines   = []

	def add_required_library(self, l):
		"""Adds a required library."""
		self._required_libraries.append(l)

	def add_required_define_statement(self, d, v):
		"""Adds a required define statement."""
		self._required_defines.append(d, v)

	@property
	def required_libraries(self):
		"""Returns the required libraries of this model."""
		return self._required_libraries

	@property
	def required_define_statements(self):
		"""Returns the required define statements of this model."""
		return self._required_defines
	
	@property
	def model_name(self) -> str:
		"""Returns the name of this model."""
		return self._model_type

	@property
	def file_name(self) -> str:
		"""Returns the file name of this model."""
		return self._model_type + '.c'

	@property
	def type_of_data_needed(self):
		"""Returns the type of data this model needs."""
		return self._types_of_data_needed
