# coding=utf-8

"""This module, base_entity.py, defines the base object for all Entity objects."""

from typing import List
from enum import Enum


# All the current possible Entity classes.
ENTITY      = 'Entity'
ENTITY_TASK = 'EntityTask'
ENTITY_TIME = 'EntityTime'

ENTITY_PROPERTY_TYPE     = 'ENTITY_PROPERTY_TYPE'
ENTITY_PROPERTY_CHILDREN = 'ENTITY_PROPERTY_CHILDREN'
ENTITY_PROPERTY_PARENTS  = 'ENTITY_PROPERTY_PARENTS'
ENTITY_PROPERTY_ID       = 'ENTITY_PROPERTY_ID'
ENTITY_PROPERTY_ALL      = [ENTITY_PROPERTY_TYPE, ENTITY_PROPERTY_CHILDREN, ENTITY_PROPERTY_PARENTS, ENTITY_PROPERTY_ID]


class Entity(object):
	"""Defines properties of all entities."""

	def __init__(self):
		self._relative_id     = -1
		self._parent_entities = []
		self._child_entities  = []
		self._information     = {}
		self._class_name      = ENTITY

	def is_public_entity(self) -> bool:
		"""Returns a boolean indicating if this entity is a public entity or not."""
		for key in self._information:
			if key == 'public':
				if self._information[key] == 'true':
					return True
		return False

	def get_additional_json_data(self) -> dict:
		"""To be implemented by child classes."""
		return {}

	def get_json_data(self) -> dict:
		"""Returns a dictionary of all the data contained in this Entity."""
		json_data = {ENTITY_PROPERTY_TYPE: self._class_name,
		             ENTITY_PROPERTY_PARENTS: str(self._parent_entities),
		             ENTITY_PROPERTY_CHILDREN: str(self._child_entities),
		             ENTITY_PROPERTY_ID: self._relative_id}

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

	def add_information(self, key, value):
		"""Adds to an internal dictionary. Will most likely get changed in the future."""
		if key not in ENTITY_PROPERTY_ALL:
			self._information[key] = value
		else:
			raise Exception('Can\'t use the default key{' + str(key) + '}!')

	@property
	def relative_id(self) -> int:
		"""Returns the global ID of this Entity."""
		return self._relative_id

	def set_relative_id(self, val):
		"""Set the relative ID of this entity."""
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

	def print_info(self):
		"""Used only for debugging."""
		print(self)
		json_data = self.get_json_data()
		for key in json_data:
			print(str(key) + ' - ' + str(json_data[key]))

	def __str__(self):
		return '[' + str(self._relative_id) + '] - E{' + str(self.get_json_data()) + '}'

	'''  __               __       /     __        __   ___      ___     __   __   ___  __       ___    __        __
		/  ` |__| | |    |  \     /     |__)  /\  |__) |__  |\ |  |     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`    .
		\__, |  | | |___ |__/    /      |    /~~\ |  \ |___ | \|  |     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/    .'''

	# Private utility functions.
	def _add_child(self, entity):
		"""Adds a single child entity to this entity."""
		if entity not in self._child_entities:
			self._child_entities.append(entity)
			# Make sure the child entity has a parent pointer to self.
			if self not in entity.parents:
				entity.add_parents(self)

	def _add_parent(self, entity):
		"""Adds a single parent entity to this entity."""
		if entity not in self._parent_entities:
			self._parent_entities.append(entity)
			# Make sure this parent has this entity as a child.
			if self not in entity.children:
				entity.add_children(self)

	def _remove_child(self, entity):
		"""Removes a single child entity from this entity."""
		if self in entity.parents:
			entity.remove_parent(self)
		if entity in self.children:
			self._child_entities.remove(entity)

	def _remove_parent(self, entity):
		"""Removes a single parent entity from this entity."""
		if self in entity.children:
			entity.remove_child(self)
		if entity in self.parents:
			self._parent_entities.remove(entity)

	# Public functions.

	def remove_parent(self, obj):
		"""Removes the provided parent entity from this entity."""
		if type(obj) == list or type(obj) == tuple:
			for e in obj:
				self._remove_parent(e)
		else:
			self._remove_parent(obj)

	def remove_children(self, obj) -> None:
		"""Removes n child entities from this entity."""
		if type(obj) == list or type(obj) == tuple:
			for e in obj:
				self._remove_child(e)
		else:
			self._remove_child(obj)

	def add_children(self, obj) -> None:
		"""Adds n child entities to this entity."""
		if type(obj) == list or type(obj) == tuple:
			for e in obj:
				self._add_child(e)
		else:
			self._add_child(obj)

	def add_parents(self, obj) -> None:
		"""Adds n parent entities to this entity."""
		if type(obj) == list or type(obj) == tuple:
			for e in obj:
				self._add_parent(e)
		else:
			self._add_parent(obj)
