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
				#print('NEED TO SET FROM THE FOLLOWING DATA :!!!!')

				if type(self._entities) == str:
					self._entities = eval(self._entities)

				for id_num in self._entities:
					raw_entity = be.Entity()
					print(id_num)
					print(type(id_num))
					for p in self._entities[id_num]:
						raw_entity.set_property_and_value(p, self._entities[id_num][p])
					self._entity_manager.add_entity(raw_entity)
				#print(self._entities)

	def create_initial_entities(self):
		"""Creates the initial entities that this EntityOwner needs."""
		owner_entity = be.Entity()
		owner_entity.set_property_and_value(be.ENTITY_DEFAULT_PROPERTY_TYPE, be.ENTITY_TYPE_OWNER)
		owner_entity.set_property_and_value(be.ENTITY_PROPERTY_USERNAME, self._username)
		owner_entity.set_property_and_value(be.ENTITY_PROPERTY_EMAIL, self._email)
		owner_entity.set_property_and_value(be.ENTITY_PROPERTY_PASSWORD, self._password)
		self._entity_manager.add_entity(owner_entity)

	'''__   ___ ___ ___  ___  __   __
	  / _` |__   |   |  |__  |__) /__`
	  \__> |___  |   |  |___ |  \ .__/ '''
	def get_all_entities(self):
		"""Returns all the entities in this EntityOwner."""
		return self._entity_manager.get_all_entities()

	def get_data_for_database(self):
		"""Returns the data in database saveable format."""
		json_data = {be.ENTITY_PROPERTY_EMAIL: self._email,
		             be.ENTITY_PROPERTY_PASSWORD: self._password,
		             be.ENTITY_PROPERTY_USERNAME: self._username}

		entities_data = {}
		all_entities = self._entity_manager.get_all_entities()

		for e in all_entities:
			entities_data[str(e.relative_id)] = e.get_json_data()

		json_data['entities'] = str(entities_data)
		return json_data

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
