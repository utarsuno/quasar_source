# coding=utf-8

"""This module, entity_owner_cache.py, defines operations and abstractions to EntityOwners as cached objects."""


class EntityOwner(object):
	"""Represents a single EntityOwner."""

	def __init__(self):
		self._needs_to_be_saved = False


