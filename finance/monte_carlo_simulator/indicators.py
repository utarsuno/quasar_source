# coding=utf-8

"""This module, indicators.py, provides an abstraction to technical indicators."""


class Indicator(object):
	"""An outline of a technical indicator."""
	def __init__(self, name, dynamic_variables):
		self._name              = name
		self._dynamic_variables = dynamic_variables

	@property
	def name(self) -> str:
		"""Returns the name of this indicator."""
		return self._name

	@property
	def dynamic_variables(self) -> list:
		"""Returns a list of the dynamic variable names."""
		return self._dynamic_variables


class SimpleMovingAverage(Indicator):
	"""The simple moving average indicator."""

	def __init__(self):
		super().__init__('simple_moving_average', ['day_range'])
