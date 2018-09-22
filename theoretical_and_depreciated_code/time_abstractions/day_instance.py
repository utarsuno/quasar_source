# coding=utf-8

"""This module, day_instance.py, provides an abstraction to time in relation to a day."""

import datetime


TIME_DELTA_DAYS = 1
TIME_TYPE_DAY_CURRENT = 2


class DayInstance(object):
	"""Abstraction to an instance of a day."""

	def __init__(self, day_instance_type):
		self._day_type = day_instance_type

		if self._day_type == TIME_TYPE_DAY_CURRENT:
			now = datetime.datetime.now()
			self._year = now.year
			self._month = now.month
			self._day = now.day

	def __str__(self):
		return str(self._month) + '.' + str(self._day) + '.' + str(self._year)
