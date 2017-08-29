# coding=utf-8

"""This module, entity_time.py, defines time logic for entity objects."""

from enum import Enum
from datetime import datetime


class Day(Enum):
	"""Day values."""
	MONDAY    = 0
	TUESDAY   = 1
	WEDNESDAY = 2
	THURSDAY  = 3
	FRIDAY    = 4
	SATURDAY  = 5
	SUNDAY    = 6


class Month(Enum):
	"""Month values."""
	JANUARY   = (1, 31)
	FEBRUARY  = (2, (28, 29)) # 29 is for leap years.
	MARCH     = (3, 31)
	APRIL     = (4, 30)
	MAY       = (5, 31)
	JUNE      = (6, 30)
	JULY      = (7, 31)
	AUGUST    = (8, 31)
	SEPTEMBER = (9, 30)
	OCTOBER   = (10, 31)
	NOVEMBER  = (11, 30)
	DECEMBER  = (12, 31)


class TimeBlock(object):
	"""Represents a block of time with a state and end time."""

	def __init__(self, start_day: Day=None, start_hour: int=None, start_minute: int=None, end_day: Day=None, end_hour: int=None, end_minute: int=None):
		self._start_day    = start_day
		self._start_hour   = start_hour
		self._start_minute = start_minute
		self._end_day      = end_day
		self._end_hour     = end_hour
		self._end_minute   = end_minute

	def set_start(self, day: Day, hour: int, minute: int):
		"""Sets all the start attributes for this TimeBlock."""
		self._start_day    = day
		self._start_hour   = hour
		self._start_minute = minute

	def set_end(self, day: Day, hour: int, minute: int):
		"""Sets all the end attributes for this TimeBlock."""
		self._end_day    = day
		self._end_hour   = hour
		self._end_minute = minute

	def set_start_day(self, day: Day):
		"""Sets the start day for this time block."""
		self._start_day = day

	def set_end_day(self, day: Day):
		"""Sets the end day for this time block."""
		self._end_day = day

	def set_start_time(self, start_time: str):
		"""Sets the start time for this block of time."""
		self._start_hour   = int(start_time.split(':')[0])
		self._start_minute = int(start_time.split(':')[1])

	def set_end_time(self, end_time: str):
		"""Sets the end time for this block of time."""
		self._end_hour   = int(end_time.split(':')[0])
		self._end_minute = int(end_time.split(':')[1])


class TimeBlocks(object):
	"""Represents a block of time with a start and end time."""

	def __init__(self, date_range_start: datetime.date, date_range_end: datetime.date):
		self._date_range_start = date_range_start
		self._date_range_end   = date_range_end

		self._time_blocks      = []

	def set_date_range_start(self, start: datetime.date):
		"""Sets the start date of when these blocks of time should exist."""
		self._date_range_start = start

	def set_date_range_end(self, end: datetime.date):
		"""Sets the end date of when these blocks of time should exists."""
		self._date_range_end = end

	def add_time_blocks(self, time_blocks):
		"""Adds a list of time blocks that occur for this TimeBlocks object."""
		if type(time_blocks) == TimeBlock:
			self._time_blocks.append(time_blocks)
		else:
			for tb in time_blocks:
				self._time_blocks.append(tb)
