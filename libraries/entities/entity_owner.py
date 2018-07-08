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
				if type(self._entities) == str:
					self._entities = eval(self._entities)

				for id_num in self._entities:
					self._entity_manager.add_entity_from_raw_data(self._entities[id_num])

	def set_entity_owner_account_type(self, account_type):
		"""Sets the Entity Owner's account type."""
		self._entity_manager.get_owner_entity().set_property_and_value(be.ENTITY_PROPERTY_OWNER_ACCOUNT_TYPE, account_type)

	def create_initial_entities(self):
		"""Creates the initial entities that this EntityOwner needs."""
		# Add the owner entity.
		owner_entity = self._entity_manager.add_entity({be.ENTITY_DEFAULT_PROPERTY_TYPE      : be.ENTITY_TYPE_OWNER,
		                                                be.ENTITY_PROPERTY_USERNAME          : self._username,
		                                                be.ENTITY_PROPERTY_EMAIL             : self._email,
		                                                be.ENTITY_PROPERTY_PASSWORD          : self._password,
		                                                be.ENTITY_PROPERTY_OWNER_ACCOUNT_TYPE: be.ACCOUNT_TYPE_NOT_VERIFIED})
		# Add the created worlds manager.
		dynamic_worlds_manager = self._entity_manager.add_entity({be.ENTITY_DEFAULT_PROPERTY_TYPE: be.ENTITY_TYPE_DYNAMIC_WORLDS_MANAGER})

		# Add the dynamic worlds manager.
		static_worlds_manager = self._entity_manager.add_entity({be.ENTITY_DEFAULT_PROPERTY_TYPE: be.ENTITY_TYPE_STATIC_WORLDS_MANAGER})

		# Add the 3 static worlds.
		static_world_home = self._entity_manager.add_entity({be.ENTITY_DEFAULT_PROPERTY_TYPE: be.ENTITY_TYPE_STATIC_WORLD,
		                                                     be.ENTITY_PROPERTY_NAME        : be.ENTITY_STATIC_WORLD_HOME})
		static_world_settings = self._entity_manager.add_entity({be.ENTITY_DEFAULT_PROPERTY_TYPE: be.ENTITY_TYPE_STATIC_WORLD,
		                                                         be.ENTITY_PROPERTY_NAME        : be.ENTITY_STATIC_WORLD_SETTINGS})
		static_world_admin = self._entity_manager.add_entity({be.ENTITY_DEFAULT_PROPERTY_TYPE: be.ENTITY_TYPE_STATIC_WORLD,
		                                                      be.ENTITY_PROPERTY_NAME        : be.ENTITY_STATIC_WORLD_ADMIN})

		static_worlds_manager.add_children(static_world_home)
		static_worlds_manager.add_children(static_world_settings)
		static_worlds_manager.add_children(static_world_admin)

	def update_entity(self, entity_data):
		"""Updates the entity with the provided entity data (or adds a new one if that entity does not exist)."""
		return self._entity_manager.update_entity(entity_data)

	def remove_entity(self, relative_id):
		"""Removes the entity by id."""
		self._entity_manager.remove_entity_by_id(relative_id)

	'''__   ___ ___ ___  ___  __   __
	  / _` |__   |   |  |__  |__) /__`
	  \__> |___  |   |  |___ |  \ .__/ '''
	def get_account_name_and_type(self):
		"""Returns the account name and account type."""
		entity_owner_entity = self._entity_manager.get_owner_entity()
		return entity_owner_entity.get_value(be.ENTITY_PROPERTY_USERNAME), entity_owner_entity.get_value(be.ENTITY_PROPERTY_OWNER_ACCOUNT_TYPE)

	def get_entity_manager(self):
		"""Returns the entity manager of this EntityOwner."""
		return self._entity_manager

	def get_all_entities(self):
		"""Returns all the entities in this EntityOwner."""
		return self._entity_manager.get_all_entities()

	def get_data_for_database(self):
		"""Returns the data in database savable format."""
		json_data = {be.ENTITY_PROPERTY_EMAIL: self._email,
		             be.ENTITY_PROPERTY_PASSWORD: self._password,
		             be.ENTITY_PROPERTY_USERNAME: self._username}

		entities_data = {}
		all_entities = self._entity_manager.get_all_entities()

		for e in all_entities:
			entities_data[str(e.relative_id)] = e.properties

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
