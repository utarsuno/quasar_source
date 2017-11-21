# coding=utf-8

"""This module, entity_task.py, represents ToDo tasks."""

from datetime import datetime
from typing import List
from quasar_source_code.entities import base_entity as be
from quasar_source_code.universal_code import time_abstraction as ta
from quasar_source_code.entities.properties import entity_time as etp


class EntityTask(be.Entity):
	"""Represents a task to be completed for an entity."""

	def __init__(self, parent_task=None):
		super().__init__()
		self._current_iteration = 0
		self._needed_iterations = 1 # Default number of iterations is 1.
		self._description       = None
		self._due_date          = None

		# These values are not being worked with yet.
		self._importance        = None
		self._time_needed       = None
		self._difficulty        = None

		if parent_task is not None:
			if self not in parent_task.children:
				self.add_parents(parent_task)

		self._class_name = be.ENTITY_TASK

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
	def needed_iterations(self) -> int:
		"""Returns the number of iterations needed for completion. Default value is 1."""
		return self._needed_iterations

	@needed_iterations.setter
	def needed_iterations(self, val):
		"""Sets the number of needed iterations."""
		self._needed_iterations = val

	def set_due_date_and_description(self, val, description):
		"""Sets the due date for this Entity task."""
		if self._due_date is None:
			self._due_date = etp.EntityTime(self)
			self.add_children(self._due_date)
		self._description = description
		self._due_date.add_one_time_event(time_range_or_single_day=val, event=self._description)

	@property
	def completed(self) -> bool:
		"""Returns a boolean indicating if this task has been completed or not."""
		return self._current_iteration >= self._needed_iterations

	def __str__(self):
		return 'ETask{' + self._name + '}'

	def get_additional_json_data(self) -> dict:
		"""To be implemented by child classes."""
		return {'CURRENT_ITERATION': self._current_iteration,
		        'NEEDED_ITERATIONS': self._needed_iterations,
		        'DESCRIPTION'      : str(self._description),
		        'DUE_DATE_ENTITY'  : str(self._due_date),
		        'IMPORTANCE'       : str(self._importance),
		        'TIME_NEEDED'      : str(self._time_needed),
		        'DIFFICULTY'       : str(self._difficulty)}

