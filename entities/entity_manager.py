# coding=utf-8

"""This module, entity_manager.py, contains management code and a class for dealing with entities."""

from entities import base_entity as be
from universal_code import debugging as dbg


class EntityManager(object):
	"""Defines management operations for Entities."""

	def __init__(self):
		self._entities = []

	def add_entity_from_raw_data(self, raw_data):
		"""Adds an entity from raw_data."""
		entity_type = raw_data[be.ENTITY_DEFAULT_PROPERTY_TYPE]
		entity_id   = raw_data[be.ENTITY_DEFAULT_PROPERTY_RELATIVE_ID]
		entity      = be.Entity(entity_id, entity_type)
		for p in raw_data:
			if p != be.ENTITY_DEFAULT_PROPERTY_TYPE and p != be.ENTITY_DEFAULT_PROPERTY_RELATIVE_ID:
				entity.set_property_and_value(raw_data[p], False)
		self._entities.append(entity)

	def add_entity(self, entity_data):
		"""Adds an entity to this EntityManager."""
		entity_id = self.get_largest_entity_id() + 1
		entity_type = be.ENTITY_TYPE_BASE
		if be.ENTITY_DEFAULT_PROPERTY_TYPE in entity_data:
			entity_type = entity_data[be.ENTITY_DEFAULT_PROPERTY_TYPE]
		entity = be.Entity(entity_id, entity_type)
		self._entities.append(entity)
		return entity

	def update_entity(self, entity_data):
		"""Updates an entity."""
		entity = self.get_entity_by_id(entity_data[be.ENTITY_DEFAULT_PROPERTY_RELATIVE_ID])
		for key in entity_data:
			entity.set_property_and_value(key, entity_data[key])

	def remove_entity_by_id(self, relative_id):
		"""Removes an Entity object by the relative ID."""
		entity_to_remove = None
		for e in self._entities:
			if str(e.relative_id) == str(relative_id):
				entity_to_remove = e
				break
		if entity_to_remove is not None:
			self._entities.remove(entity_to_remove)
		else:
			print('\nThe entity to remove was not found {' + str(relative_id) + '}\n')
			print('\nPrinting all the current entities.\n')
			for e in self._entities:
				print(e)
			print('\n')
			#dbg.raise_exception('The entity to remove was not found!')

		# TODO : Decide if this should automatically remove other Entities based off of child/parent relationships.

	'''__   ___ ___ ___  ___  __   __
	  / _` |__   |   |  |__  |__) /__`
	  \__> |___  |   |  |___ |  \ .__/ '''
	def get_owner_entity(self):
		"""Returns the Entity that represents the Entity Owner."""
		for e in self._entities:
			if e.get_value(be.ENTITY_DEFAULT_PROPERTY_TYPE) == be.ENTITY_TYPE_OWNER:
				return e
		dbg.raise_exception('Entity owner not found!')

	def get_entity_by_id(self, relative_id):
		"""Returns an Entity object or None if the match doesn't exist."""
		for e in self._entities:
			if str(e.relative_id) == str(relative_id):
				return e
		return None

	def get_all_entities(self):
		"""Returns all the entities (and their children) of this manager."""
		return self._entities

	def get_largest_entity_id(self) -> int:
		"""Returns the largest entity ID found, -1 if there are no entities."""
		largest_id = -1
		for e in self._entities:
			if int(e.relative_id) > largest_id:
				largest_id = int(e.relative_id)
		return largest_id

	def __len__(self):
		return len(self._entities)

