# coding=utf-8

"""This module, entity_task.py, represents ToDo tasks."""

from datetime import datetime
from typing import List
from quasar_source_code.entities import entity as e
from quasar_source_code.universal_code import time_abstraction as ta
from quasar_source_code.entities.properties import entity_time_properties as etp


class EntityTask(e.AbstractEntity):
	"""Represents a task to be completed for an entity."""

	def __init__(self, name, parent_task=None):
		super().__init__()
		self._name              = name
		self._current_iteration = 1 # Default number of iterations is 1.
		self._needed_iterations = 0
		self._description       = None

		self._due_date_property = etp.EntityTime()

		self._sub_tasks         = []
		self._parent_task       = parent_task

	def get_task_and_sub_tasks(self):
		"""Returns a list of this task plus all sub tasks attached to it."""
		all_tasks = [self]
		for t in self._sub_tasks:
			all_tasks.append(t)
		return all_tasks

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

	def set_due_date_and_description(self, val: datetime.date, description):
		"""Sets the due date for this Entity task."""
		self._description = description
		self._due_date_property.add_one_time_event(time_range_or_single_day=val, event=self._description)

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

	def __str__(self):
		return 'ETask{' + self._name + '}'
