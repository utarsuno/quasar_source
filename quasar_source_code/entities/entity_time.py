# coding=utf-8

"""This module, entity_time.py, defines time logic for entity objects."""

from enum import Enum
from datetime import datetime
from quasar_source_code.universal_code import time_abstraction as ta
from typing import List




class TimeBlock(object):
	"""Represents a block of time with a state and end time."""

	def __init__(self, start_day: ta.Day=None, start_hour: int=None, start_minute: int=None, end_day: ta.Day=None, end_hour: int=None, end_minute: int=None):
		self._start_day    = start_day
		self._start_hour   = start_hour
		self._start_minute = start_minute
		self._end_day      = end_day
		self._end_hour     = end_hour
		self._end_minute   = end_minute

		self.parent_entity = None

	def _zero_front_padding(self, n):
		if len(str(n)) == 1:
			return '0' + str(n)
		else:
			return str(n)

	def _zero_back_padding(self, n):
		if len(str(n)) == 1:
			return str(n) + '0'
		else:
			return str(n)

	@property
	def start_time(self) -> str:
		"""Returns the start time as a human readable string."""
		return self._zero_front_padding(self._start_hour) + ':' + self._zero_back_padding(self._start_minute)

	@property
	def end_time(self) -> str:
		"""Returns the end time as a human readable string."""
		return self._zero_front_padding(self._end_hour) + ':' + self._zero_back_padding(self._end_minute)

	def __str__(self):
		if self._start_day == self._end_day:
			return self._start_day.name + '[' + self.start_time + ' - ' + self.end_time + '] for super entity : ' + self.parent_entity.name
		else:
			return self._start_day.name + '[' + self.start_time + '] to ' + self._end_day.name + '[' + self.end_time + '] for super entity : ' + self.parent_entity.name

	def is_relevant_for_today(self) -> bool:
		"""Returns a boolean indicating if today's date falls within this time blocks range."""
		start_day = self._start_day.value
		end_day   = self._end_day.value
		if start_day < end_day:
			if start_day <= ta.get_current_day_of_the_week_number() <= end_day:
				return True
		elif end_day < start_day:
			if end_day <= ta.get_current_day_of_the_week_number() <= start_day:
				return True
		else:
			if start_day == end_day == ta.get_current_day_of_the_week_number():
				return True
		return False

	def is_relevant_for_now(self) -> bool:
		"""Returns a boolean indicating if the current time falls within this time blocks range."""
		y = 2
		# TODO :

	# TODO : is relevant for datetime object

	def set_start(self, day: ta.Day, hour: int, minute: int):
		"""Sets all the start attributes for this TimeBlock."""
		self._start_day    = day
		self._start_hour   = hour
		self._start_minute = minute

	def set_end(self, day: ta.Day, hour: int, minute: int):
		"""Sets all the end attributes for this TimeBlock."""
		self._end_day    = day
		self._end_hour   = hour
		self._end_minute = minute

	def set_start_day(self, day: ta.Day):
		"""Sets the start day for this time block."""
		self._start_day = day

	def set_end_day(self, day: ta.Day):
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

		self._parent_entity     = None

	@property
	def parent_entity(self):
		"""Returns the super parent of this time block."""
		return self._parent_entity

	@parent_entity.setter
	def parent_entity(self, val):
		"""Sets the super parent of this time block as well as all contained sub time blocks."""
		for tb in self._time_blocks:
			tb.parent_entity = val
		self._parent_entity = val

	def set_date_range_start(self, start: datetime.date):
		"""Sets the start date of when these blocks of time should exist."""
		self._date_range_start = start

	def set_date_range_end(self, end: datetime.date):
		"""Sets the end date of when these blocks of time should exists."""
		self._date_range_end = end

	def add_time_blocks(self, time_blocks):
		"""Adds a list of time blocks that occur for this TimeBlocks object."""
		if type(time_blocks) == TimeBlock:
			time_blocks.parent_entity = self.parent_entity
			self._time_blocks.append(time_blocks)
		else:
			for tb in time_blocks:
				tb.parent_entity = self.parent_entity
				self._time_blocks.append(tb)

	def get_all_relevant_time_blocks_for_today(self) -> List:
		"""Returns a list of time blocks relevant for today"""
		relevant_time_blocks = []
		for tb in self._time_blocks:
			if tb.is_relevant_for_today():
				relevant_time_blocks.append(tb)
		return relevant_time_blocks

	# TODO : get all relevant time blocks for datetime
