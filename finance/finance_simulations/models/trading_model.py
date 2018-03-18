# coding=utf-8

"""This module, trading_model.py, represents a trading model used in both training and testing."""


FINANCE_MODEL_M0 = 'm0_net_resistance'


class FinanceModel(object):
	"""Represents a financial model that can be both trained and tested."""

	def __init__(self, model_type, types_of_data_needed):
		self._model_type = model_type
		self._types_of_data_needed = types_of_data_needed
		self._weights = []

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
