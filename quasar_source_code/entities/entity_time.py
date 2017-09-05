# coding=utf-8

"""This module, entity_time.py, defines time logic for entity objects."""

from enum import Enum
from datetime import datetime
from quasar_source_code.universal_code import time_abstraction as ta
from typing import List


class TimeBlocks(object):
	"""Represents a block of time with a start and end time."""

	def __init__(self, date_range_start, date_range_end):
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

	def set_date_range_start(self, start):
		"""Sets the start date of when these blocks of time should exist."""
		self._date_range_start = start

	def set_date_range_end(self, end):
		"""Sets the end date of when these blocks of time should exists."""
		self._date_range_end = end

	def add_time_blocks(self, time_blocks):
		"""Adds a list of time blocks that occur for this TimeBlocks object."""
		if type(time_blocks) == ta.DateRange:
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

	# TODO : get all relevant time blocks for datetime OR generic day time
