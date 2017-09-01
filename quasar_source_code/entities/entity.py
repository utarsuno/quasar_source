# coding=utf-8

"""This module, entity.py, defines the outline for entities."""

from datetime import datetime
from quasar_source_code.universal_code import time_abstraction as ta
from enum import Enum
from typing import List
from datetime import datetime


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
		else:
			for _e in e:
				self._entities.append(_e)
				_e._parent_entity = self

	def get_all_relevant_time_blocks(self) -> List:
		"""Returns a list of time blocks that today's date is apart of."""
		if self._time_blocks is not None:
			time_blocks = []
			for tb in self._time_blocks:
				time_blocks_to_add = tb.get_all_relevant_time_blocks_for_today()
				for tbta in time_blocks_to_add:
					time_blocks.append(tbta)
			for e in self._entities:
				extra_time_blocks = e.get_all_relevant_time_blocks()
				for etb in extra_time_blocks:
					time_blocks.append(etb)

			return time_blocks
		return []

	def add_time_blocks(self, time_blocks):
		"""Adds a TimeBlocks object to this entity."""
		if self._time_blocks is None:
			self._time_blocks = []
		if type(time_blocks) == list or type(time_blocks) == tuple:
			for tb in time_blocks:
				tb.parent_entity = self
				self._time_blocks.append(tb)
		else:
			time_blocks.parent_entity = self
			self._time_blocks.append(time_blocks)

	def add_information(self, key, value):
		"""Adds key-pair information to keep track of."""
		self._information[key] = value

	def __str__(self):
		return 'Entity : ' + self.name


class EntityTask(object):
	"""Represents a task to be completed for an entity."""

	def __init__(self, name, parent_task=None):
		self._name              = name
		self._current_iteration = -1
		self._needed_iterations = 0
		self._due_date          = None
		self._description       = None

		self._sub_tasks         = []
		self._parent_task       = parent_task

	def iterate(self):
		"""Completes an iteration for this task."""
		self._current_iteration += 1

	@property
	def description(self):
		"""Returns the description of this entity task."""
		return self._description

	@description.setter
	def description(self, val):
		"""Sets the description of this task."""
		self._description = val

	@property
	def due_date(self) -> datetime:
		"""Returns the datetime that this task is due on."""
		return self._due_date

	@due_date.setter
	def due_date(self, val: datetime):
		"""Sets the due date for this Entity task."""
		self._due_date = val

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

			# Get time blocks relevant for today.
			today_time_blocks = []

			# Now go through all entities associated for this entity.
			for e in entity_sub_set:
				today_time_blocks_to_add = e.get_all_relevant_time_blocks()
				for ttbta in today_time_blocks_to_add:
					today_time_blocks.append(ttbta)

			for tb in today_time_blocks:
				print(tb)
