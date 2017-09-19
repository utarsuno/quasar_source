# coding=utf-8

"""This module, entity_owner.py, holds information for user to entity account management operations."""


class EntityOwner(object):
	"""Represents a unique owner of entities. Note multiple owners can share an entity."""

	def __init__(self):
		self._name       = None
		self._owner_id   = None
		self._manager_id = None
