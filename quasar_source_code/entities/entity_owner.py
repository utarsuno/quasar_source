# coding=utf-8

"""This module, entity_owner.py, holds information for user to entity account management operations."""


class EntityOwner(object):
	"""Represents a unique owner of entities. Note multiple owners can share an entity."""

	# Database column names.
	DB_NAME     = 'name'
	DB_ENTITIES = 'entities'

	def __init__(self):
		self._name = None
		self._entities   = []

	def get_save_info(self) -> dict:
		"""Returns a dictionary containing all the data needed to save this Entity."""
		entity_ids = []
		for e in self._entities:
			entity_ids.append(e.global_id)
		return {EntityOwner.DB_NAME: self._name, EntityOwner.DB_ENTITIES: self._entities}
