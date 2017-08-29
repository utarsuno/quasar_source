# coding=utf-8

"""This module, entity.py, defines the outline for entities."""

from datetime import datetime
from quasar_source_code.universal_code import time_abstraction as ta
from enum import Enum
from typing import List


class Entity(object):
	"""Abstract representation to Entities."""

	def __init__(self, entity_name):
		self.name          = entity_name
		self._information  = {}
		self._entities     = []
		self._parent_entity = None

		self._created_date = ta.get_now()

		self._time_blocks = None

	def add_entities(self, e):
		"""Adds n entities."""
		if type(e) == Entity:
			self._entities.append(e)
			e._parent_entity = self
		elif type(e) == List or type(e) == tuple:
			for _e in e:
				self._entities.append(_e)
				_e._parent_entity = self

	def add_time_blocks(self, time_blocks):
		"""Adds a TimeBlocks object to this entity."""
		if self._time_blocks is None:
			self._time_blocks = []
		if type(time_blocks) == List:
			for tb in time_blocks:
				self._time_blocks.append(tb)
		else:
			self._time_blocks.append(time_blocks)

	def add_information(self, key, value):
		"""Adds key-pair information to keep track of."""
		self._information[key] = value


class EntityTask(object):
	"""Represents a task to be completed for an entity."""

	def __init__(self):
		self._current_iteration = -1
		self._needed_iterations = 0

	@property
	def completed(self) -> bool:
		"""Returns a boolean indicating if this task has been completed or not."""
		return self._current_iteration >= self._needed_iterations


class EntityManager(object):
	"""Defines management operations for Entities."""

	def __init__(self):
		self._entities = []

	def add_entities(self, e):
		"""Adds an entity to be managed."""
		if type(e) == list or type(e) == tuple:
			for _e in e:
				self._entities.append(_e)
		else:
			self._entities.append(e)

	def print_todays_relevant_information(self):
		"""Temporary debugging function."""

		for entity in self._entities:

			entity_sub_set = [entity]
			# Get all child entities of this entity as well.
			for e in entity._entities:
				entity_sub_set.append(e)

			#