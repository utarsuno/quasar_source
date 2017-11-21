# coding=utf-8

"""This module, entity_manager.py, contains management code and a class for dealing with entities."""

from quasar_source_code.universal_code import time_abstraction as ta


class EntityManager(object):
	"""Defines management operations for Entities."""

	def __init__(self, manager_id=-1, owner_id=-1):
		super().__init__()
		self.entities             = []
		self._owner_id            = owner_id
		self._manager_id          = manager_id

	def delete_all_children_of_entity_that_do_not_have_other_parents(self, entity):
		"""Does what the function name states c:."""
		for c in entity.children:
			# Remove this child's reference of this entity as a parent. This will automatically remove the entity provided child links as well.
			c.remove_parents(self)

			# TODO : Eventually check for external references as well.
			# If the child entity has no more parents then remove it.
			if len(c.parents) == 0:
				self.remove_entity(c)

	def remove_entity(self, entity):
		"""Removes the entity provided."""
		if entity in self.entities:
			self.delete_all_children_of_entity_that_do_not_have_other_parents(entity)
			self.entities.remove(entity)

	@property
	def manager_id(self) -> int:
		"""Returns the manager_id of this manager, -1 if error."""
		return self._manager_id

	def print_entities(self):
		"""Prints the information of all the entities."""
		print('Printing information on the entities!')
		for e in self.entities:
			print(str(e))
		print('------------------------------------------')

	def get_entity_by_id(self, entity_id):
		"""Returns an entity."""
		for e in self.entities:
			if e.relative_id == entity_id:
				return e
		return None

	def get_all_entities(self):
		"""Returns all the entities of this manager."""
		all_entities = []
		for e in self.entities:
			all_entities.append(e)
			for e_child in e.all_children:
				all_entities.append(e_child)
		return all_entities

	def print_all_entities(self):
		"""Prints information for all entities and any linked entities."""
		print('Printing information on the entities and all linked entities!')
		for e in self.entities:
			print(str(e))
			for e_child in e.all_children:
				print(str(e_child))
		print('------------------------------------------')

	def add_entities(self, e):
		"""Adds an entity to be managed."""
		if type(e) == list or type(e) == tuple:
			for _e in e:
				self.entities.append(_e)
		else:
			self.entities.append(e)

	def __str__(self):
		return 'EntityManager - owner_id{' + str(self._owner_id) + '}, manager_id{' + str(self.manager_id) + '}, entities{' + str(self.entities) + '}'
