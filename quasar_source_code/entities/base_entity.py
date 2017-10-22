# coding=utf-8

"""This module, base_entity.py, defines the base object for all Entity objects."""

from typing import List
from enum import Enum


# All the current possible Entity classes.
ENTITY      = 'Entity'
ENTITY_TASK = 'EntityTask'
ENTITY_TIME = 'EntityTime'


class Entity(object):
	"""Defines properties of all entities."""

	def __init__(self, entity_name):
		self._relative_id     = 0

		self._name            = entity_name
		self._parent_entities = []
		self._child_entities  = []

		self._information     = {}

		self._class_name      = ENTITY

	def get_additional_json_data(self) -> dict:
		"""To be implemented by child classes."""
		return {}

	def get_json_data(self) -> dict:
		"""Returns a dictionary of all the data contained in this Entity."""
		json_data = {'ENTITY_PROPERTY_NAME'      : self._name,
					 'ENTITY_PROPERTY_TYPE': self._class_name,
		             'ENTITY_PROPERTY_PARENTS': str(self._parent_entities),
		             'ENTITY_PROPERTY_CHILDREN': str(self._child_entities),
		             'ENTITY_PROPERTY_ID': self._relative_id
		             }
		#'ENTITY_PROPERTY_INFORMATION': str(self._information)

		for key in self._information:
			json_data[key] = self._information[key]

		return {**json_data, **self.get_additional_json_data()}

	@property
	def class_name(self) -> str:
		"""Returns the class name of this Entity."""
		return self._class_name

	def set_entity_type(self, val):
		"""TODO:"""
		self._class_name = val

	def get_all_information_relevant_for_date(self, date):
		"""Gathers relevant information for the date provided."""
		#sub_set = self.all_children + [self]
		sub_set = self.all_children
		info = []
		for e in sub_set:

			# TODO : CHECK FOR tasks as they contain coloring information!

			if e.class_name == ENTITY_TIME:
				data = e.get_all_relevant_events_for_date(date)
				if len(data) > 0:
					info.append(data)
		return info

	def add_information(self, key, value):
		"""Adds to an internal dictionary. Will most likely get changed in the future."""
		self._information[key] = value

	def remove_children(self, obj) -> None:
		"""Removes n child entities from this entity."""
		# TODO : ...
		y = 2

	def add_children(self, obj) -> None:
		"""Adds n child entities to this entity."""
		if type(obj) == list or type(obj) == tuple:
			for e in obj:
				if e not in self._child_entities:
					self._child_entities.append(e)
					# Make sure those child entities have a parent pointer to self.
					if self not in e.parents:
						e.add_parents(self)
		else:
			if obj not in self._child_entities:
				self._child_entities.append(obj)
				# Make sure the child entity has a parent pointer to self.
				if self not in obj.parents:
					obj.add_parents(self)

	def add_parents(self, obj) -> None:
		"""Adds n parent entities to this entity."""
		if type(obj) == list or type(obj) == tuple:
			for e in obj:
				if e not in self._parent_entities:
					self._parent_entities.append(e)
					# Make sure this parent has this entity as a child.
					if self not in e.children:
						e.add_children(self)
		else:
			if obj not in self._parent_entities:
				self._parent_entities.append(obj)
				# Make sure this parent has this entity as a child.
				if self not in obj.children:
					obj.add_children(self)

	@property
	def relative_id(self) -> int:
		"""Returns the global ID of this Entity."""
		return self._relative_id

	def set_relative_id(self, val):
		###TODO:"""
		self._relative_id = val

	@property
	def is_child(self) -> bool:
		"""Returns a boolean indicating if this entity has parent entities and no child entities."""
		return len(self._child_entities) == 0 and len(self._parent_entities) > 0

	@property
	def is_parent(self) -> bool:
		"""Returns a boolean indicating if this entity has any child entities."""
		return len(self._child_entities) > 0

	@property
	def parents(self) -> list:
		"""Returns a list of parent entities relative to this entity."""
		return self._parent_entities

	@property
	def all_parents(self) -> list:
		"""Returns a list of ALL parent entities relative to this entity."""
		if len(self._parent_entities) == 0:
			return [self]
		parent_entities = []
		for pe in self._parent_entities:
			parent_entities += pe.all_parents
		return parent_entities

	@property
	def children(self) -> list:
		"""Returns a list of child entities relative to this entity."""
		return self._child_entities

	@property
	def all_children(self) -> list:
		"""Returns a list of ALL child entities relative to this entity."""
		if len(self._child_entities) == 0:
			return []
		child_entities = [] + self._child_entities
		for ce in self._child_entities:
			child_entities += ce.all_children
		return child_entities

	@property
	def name(self) -> str:
		"""Returns the name of this entity."""
		return self._name

	def __str__(self):
		return '[' + str(self._relative_id) + '] - E{' + self._name + '}'
