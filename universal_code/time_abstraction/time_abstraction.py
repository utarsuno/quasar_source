# coding=utf-8

"""This module, time_abstraction.py, provides several abstractions to concepts of time."""

from datetime import datetime


THIS_DAY = 'this_day'

DELTA_DAYS   = 'delta_days'
DELTA_MONTHS = 'delta_months'
DELTA_YEARS  = 'delta_years'


class TimeInstance(object):
	"""Represents a specific instance in time."""
	# TODO :


class DayInstance(object):
	"""Represents a specific day."""

	def __init__(self, date_base):
		if date_base == THIS_DAY:
			self._d = datetime.now()
		else:
			self._d = date_base

	def to_string_format(self, f):
		"""Returns a presentation of this day instance in the provided format."""
		return f.replace('YYYY', str(self.get_year())).replace('MM', str(self.get_month_number())).replace('DD', str(self.get_day_number()))

	def get_year(self):
		"""Returns the year of this day instance."""
		return self._d.year

	def get_month_number(self):
		"""Returns the month number."""
		return self._d.month

	def get_day_number(self):
		"""Returns the day number."""
		return self._d.day

