# coding=utf-8

"""This module, entity_task.py, represents ToDo tasks."""

from datetime import datetime
from typing import List
from quasar_source_code.entities import entity as e


class EntityTask(e.AbstractEntity):
	"""Represents a task to be completed for an entity."""

	def __init__(self, name, parent_task=None):
		super().__init__()
		self._name              = name
		self._current_iteration = 1 # Default number of iterations is 1.
		self._needed_iterations = 0
		self._due_date          = None
		self._description       = None

		self._sub_tasks         = []
		self._parent_task       = parent_task

	def is_relevant_for_today(self):
		"""Returns a boolean indicating if this task falls within today."""


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
		if len(self._sub_tasks) == 0:
			return self._current_iteration >= self._needed_iterations
		else:
			all_sub_tasks_complete = True
			for st in self._sub_tasks:
				if not st.completed:
					all_sub_tasks_complete = False
					break
			return all_sub_tasks_complete
