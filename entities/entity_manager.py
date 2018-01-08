# coding=utf-8

"""This module, entity_manager.py, contains management code and a class for dealing with entities."""

from entities import base_entity as be
from universal_code import time_abstraction as ta
from universal_code import debugging as dbg


class EntityManager(object):
	"""Defines management operations for Entities."""

	def __init__(self):
		self._entities = []

	def add_entity(self, entity):
		"""Adds an entity to this EntityManager."""
		# If the entity being added has no relative_id then assign it one.
		if not entity.has_property(be.ENTITY_DEFAULT_PROPERTY_RELATIVE_ID):
			entity.set_property_and_value(be.ENTITY_DEFAULT_PROPERTY_RELATIVE_ID, self.get_largest_entity_id() + 1)
		self._entities.append(entity)

	def replace_entity(self, new_entity):
		"""Replaces an existing with the provided entity based off of relative ID match."""
		entity_to_remove = None
		for e in self._entities:
			if str(e.relative_id) == str(new_entity.relative_id):
				entity_to_remove = e
				break
		if entity_to_remove is None:
			dbg.raise_exception('Entity to remove does not exist! TODO : Have this logged be transmitted via a server response, not exception.')
		else:
			self._entities.remove(entity_to_remove)
			self._entities.append(new_entity)

	def update_entity(self, entity_data):
		"""Updates, adds, or create an entity based off the entity data provided."""
		raw_entity = be.Entity()
		for key in entity_data:
			#print('key : ' + str(key) + ' {' + str(type(key)) + '}')
			#print('value : ' + str(entity_data[key]) + '{' + str(type(entity_data[key])) + '}')
			raw_entity.set_property_and_value(key, entity_data[key])

		# If the entity data doesn't have a relative ID then we can create a new entity based off the data.
		if raw_entity.has_property(be.ENTITY_DEFAULT_PROPERTY_RELATIVE_ID):
			self.add_entity(raw_entity)
		else:
			# The entity has an ID so check if the cache already contains a match by entity ID.
			entity_match = self.get_entity_by_id(raw_entity.get_value(be.ENTITY_DEFAULT_PROPERTY_RELATIVE_ID))

			if entity_match is None:
				self.add_entity(raw_entity)
			else:
				self.replace_entity(raw_entity)

		return raw_entity

	def remove_entity_by_id(self, relative_id):
		"""Removes an Entity object by the relative ID."""
		entity_to_remove = None
		for e in self._entities:
			if str(e.relative_id) == str(relative_id):
				entity_to_remove = entity_to_remove
				break
		if entity_to_remove is not None:
			self._entities.remove(entity_to_remove)
		else:
			print('\nThe entity to remove was not found {' + str(relative_id) + '}\n')
			print('\nPrinting all the current entities.\n')
			for e in self._entities:
				print(e)
			print('\n')
			dbg.raise_exception('The entity to remove was not found!')

		# TODO : Decide if this should automatically remove other Entities based off of child/parent relationships.

	'''__   ___ ___ ___  ___  __   __
	  / _` |__   |   |  |__  |__) /__`
	  \__> |___  |   |  |___ |  \ .__/ '''
	def get_entity_by_id(self, relative_id):
		"""Returns an Entity object or None if the match doesn't exist."""
		for e in self._entities:
			if str(e.relative_id) == str(relative_id):
				return e
		return None

	def get_all_entities(self):
		"""Returns all the entities of this manager."""
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

