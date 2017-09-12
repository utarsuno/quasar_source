# coding=utf-8

"""This module, base_entity.py, defines the base object for all Entity objects."""

from typing import List
from enum import Enum

global_id = 0


# All the current possible Entity classes.
ENTITY      = 'Entity'
ENTITY_TASK = 'EntityTask'
ENTITY_TIME = 'EntityTime'


class Entity(object):
	"""Defines properties of all entities."""

	CLASS_NAME = ENTITY

	# Database column names.
	DB_GLOBAL_ID       = 'global_id'
	DB_CLASS_NAME      = 'class_name'
	DB_ENTITY_NAME     = 'entity_name'
	DB_PARENT_ENTITIES = 'parent_entities'
	DB_CHILD_ENTITIES  = 'child_entities'
	DB_INFORMATION     = 'information'

	def __init__(self, entity_name):
		global global_id
		# TODO : Global id should be generated through a different method.
		self._global_id       = global_id
		global_id += 1

		self._owner_id        = 0 # TODO : Have this get set!

		self._name            = entity_name
		self._parent_entities = []
		self._child_entities  = []

		self._class_name      = Entity.CLASS_NAME

		self._information     = {}

	def get_all_information_relevant_for_date(self, date):
		"""Gathers relevant information for the date provided."""
		#sub_set = self.all_children + [self]
		sub_set = self.all_children
		info = []
		for e in sub_set:
			# TODO : If it doesn't work first check this spot by printing out e
			if e.class_name == ENTITY_TIME:
				data = e.get_all_relevant_events_for_date(date)
				if len(data) > 0:
					info.append(data)
		return info

	def add_information(self, key, value):
		"""Adds to an internal dictionary. Will most likely get changed in the future."""
		self._information[key] = value

	@property
	def class_name(self) -> str:
		"""Returns the name of this class' entity Class."""
		return self._class_name

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
	def global_id(self) -> int:
		"""Returns the global ID of this Entity."""
		return self._global_id

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

	def get_additional_needed_save_info(self) -> dict:
		"""Returns a dictionary containing class instance information that a regular base Entity does not contain."""
		return {}

	def get_save_info(self) -> dict:
		"""Returns a dictionary containing all the data needed to save this Entity."""
		parent_ids = []
		for p in self._parent_entities:
			parent_ids.append(p.global_id)
		child_ids = []
		for c in self._child_entities:
			child_ids.append(c.global_id)
			# Returns the generated dictionary merged with the additional needed save info dictionary.
		return dict({Entity.DB_GLOBAL_ID: self._global_id,
		        Entity.DB_CLASS_NAME: self._class_name,
		        Entity.DB_ENTITY_NAME: self._name,
		        Entity.DB_PARENT_ENTITIES: parent_ids,
		        Entity.DB_CHILD_ENTITIES: child_ids,
		        Entity.DB_INFORMATION: self._information}, **self.get_additional_needed_save_info())

	def __str__(self):
		return 'E{' + self._name + '}'

