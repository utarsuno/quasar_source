# coding=utf-8

"""This module, entity_owner.py, is a cache abstraction to the server/database hosting of entity owner objects."""

from entities import base_entity as be
from entities import entity_manager as em


class EntityOwner(object):
	"""Represents a single unique EntityOwner."""

	def __init__(self, raw_data):
		self._needs_to_be_saved = False
		self._entity_manager    = em.EntityManager()

		for key in raw_data:
			if key == be.ENTITY_PROPERTY_EMAIL:
				self._email = raw_data[be.ENTITY_PROPERTY_EMAIL]
			elif key == be.ENTITY_PROPERTY_PASSWORD:
				self._password = raw_data[be.ENTITY_PROPERTY_PASSWORD]
			elif key == be.ENTITY_PROPERTY_USERNAME:
				self._username = raw_data[be.ENTITY_PROPERTY_USERNAME]
			elif key == 'entities':
				self._entities = raw_data['entities']

	def create_initial_entities(self):
		"""Creates the initial entities that this EntityOwner needs."""
		owner_entity = be.Entity()
		owner_entity.set_property_and_value(be.ENTITY_DEFAULT_PROPERTY_TYPE, be.ENTITY_TYPE_OWNER)
		self._entity_manager.add_entity(owner_entity)

	def _set_entities(self):
		"""Utility function."""
		entities = self._entity_manager.get_all_entities()

		print('Printing all the entities!')
		for e in entities:
			print(e)

	'''__   ___ ___ ___  ___  __   __
	  / _` |__   |   |  |__  |__) /__`
	  \__> |___  |   |  |___ |  \ .__/ '''

	def needs_to_be_saved(self) -> bool:
		"""Returns a boolean indicating if this entity owner needs to be saved on the database."""
		return self._needs_to_be_saved

	@property
	def username(self) -> str:
		"""Returns the username of this EntityOwner."""
		return self._username

	@property
	def email(self) -> str:
		"""Returns the email of this EntityOwner."""
		return self._email

	@property
	def password(self) -> str:
		"""Returns the password of this EntityOwner."""
		return self._password
