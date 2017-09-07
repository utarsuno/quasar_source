# coding=utf-8

"""This module, entity_task.py, represents ToDo tasks."""

from datetime import datetime
from typing import List
from quasar_source_code.entities.base_entity import Entity
from quasar_source_code.universal_code import time_abstraction as ta
from quasar_source_code.entities.properties import entity_time_properties as etp


class EntityTask(Entity):
	"""Represents a task to be completed for an entity."""

	CLASS_NAME = 'EntityTask'

	def __init__(self, name, parent_task=None):
		super().__init__(name)
		self._current_iteration = 1 # Default number of iterations is 1.
		self._needed_iterations = 0
		self._description       = None
		self._due_date          = None

		if parent_task is not None:
			if self not in parent_task.children:
				self.add_parents(parent_task)

		self._class_name = EntityTask.CLASS_NAME

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
		if self._due_date is None:
			self._due_date = etp.EntityTime('due_date for : {' + description + '}', self)
			self.add_children(self._due_date)
		self._description = description
		self._due_date.add_one_time_event(time_range_or_single_day = val, event=self._description)

	@property
	def completed(self) -> bool:
		"""Returns a boolean indicating if this task has been completed or not."""
		# TODO : Fix the method
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
