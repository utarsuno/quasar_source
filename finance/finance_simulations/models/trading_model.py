# coding=utf-8

"""This module, trading_model.py, represents a trading model used in both training and testing."""


class FinanceModel(object):
	"""Represents a financial model that can be both trained and tested."""

	def __init__(self, types_of_data_needed):
		self._types_of_data_needed = types_of_data_needed

	@property
	def type_of_data_needed(self):
		"""Returns the type of data this model needs."""
		return self._types_of_data_needed
