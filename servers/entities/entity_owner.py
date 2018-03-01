# coding=utf-8

"""This module, entity_owner.py, is a cache abstraction to the server/database hosting of entity owner objects."""

from entities import base_entity as be
from entities import entity_manager as em

# All pre-defined account types.
ACCOUNT_TYPE_NOT_VERIFIED = 'not_verified'
ACCOUNT_TYPE_INTERNAL     = 'internal'
ACCOUNT_TYPE_DEFAULT      = 'default'
ACCOUNT_TYPE_ADMIN        = 'admin'
ACCOUNT_TYPE_SUDO         = 'sudo'


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
					raw_entity = be.Entity()
					for p in self._entities[id_num]:
						raw_entity.set_property_and_value(p, self._entities[id_num][p])
					self._entity_manager.add_entity(raw_entity)

	def set_entity_owner_account_type(self, account_type):
		"""Sets the Entity Owner's account type."""
		self._entity_manager.get_owner_entity().set_property_and_value(be.ENTITY_PROPERTY_OWNER_ACCOUNT_TYPE, account_type)

	def create_initial_entities(self):
		"""Creates the initial entities that this EntityOwner needs."""
		# Add the owner entity.
		owner_entity = be.Entity()

		owner_entity.set_property_and_value(be.ENTITY_DEFAULT_PROPERTY_TYPE, be.ENTITY_TYPE_OWNER)
		owner_entity.set_property_and_value(be.ENTITY_PROPERTY_USERNAME, self._username)
		owner_entity.set_property_and_value(be.ENTITY_PROPERTY_EMAIL, self._email)
		owner_entity.set_property_and_value(be.ENTITY_PROPERTY_PASSWORD, self._password)
		owner_entity.set_property_and_value(be.ENTITY_PROPERTY_OWNER_ACCOUNT_TYPE, ACCOUNT_TYPE_NOT_VERIFIED)
		self._entity_manager.add_entity(owner_entity)

		# Add the created worlds manager.
		dynamic_worlds_manager = be.Entity()
		dynamic_worlds_manager.set_property_and_value(be.ENTITY_DEFAULT_PROPERTY_TYPE, be.ENTITY_TYPE_DYNAMIC_WORLDS_MANAGER)
		self._entity_manager.add_entity(dynamic_worlds_manager)

		# Add the dynamic worlds manager.
		static_worlds_manager = be.Entity()
		static_worlds_manager.set_property_and_value(be.ENTITY_DEFAULT_PROPERTY_TYPE, be.ENTITY_TYPE_STATIC_WORLDS_MANAGER)
		self._entity_manager.add_entity(static_worlds_manager)

		# Add the 3 static worlds.
		static_world_home = be.Entity()
		static_world_home.set_property_and_value(be.ENTITY_DEFAULT_PROPERTY_TYPE, be.ENTITY_TYPE_STATIC_WORLD)
		static_world_home.set_property_and_value(be.ENTITY_PROPERTY_NAME, be.ENTITY_STATIC_WORLD_HOME)
		self._entity_manager.add_entity(static_world_home)
		#static_worlds_manager.add_children(static_world_home)

		static_world_settings = be.Entity()
		static_world_settings.set_property_and_value(be.ENTITY_DEFAULT_PROPERTY_TYPE, be.ENTITY_TYPE_STATIC_WORLD)
		static_world_settings.set_property_and_value(be.ENTITY_PROPERTY_NAME, be.ENTITY_STATIC_WORLD_SETTINGS)
		self._entity_manager.add_entity(static_world_settings)
		#static_worlds_manager.add_children(static_world_settings)

		static_world_admin = be.Entity()
		static_world_admin.set_property_and_value(be.ENTITY_DEFAULT_PROPERTY_TYPE, be.ENTITY_TYPE_STATIC_WORLD)
		static_world_admin.set_property_and_value(be.ENTITY_PROPERTY_NAME, be.ENTITY_STATIC_WORLD_ADMIN)
		self._entity_manager.add_entity(static_world_admin)
		#static_worlds_manager.add_children(static_world_admin)

		# TODO : THIS IS A TEMPORARY MESURE. Eventually fix up the architecture to not require this work-around.
		static_worlds_manager._child_entities = '[' + static_world_home.relative_id + ',' + static_world_settings.relative_id + ',' + static_world_admin.relative_id + ']'
		static_world_home._parent_entities = '[' + static_worlds_manager.relative_id + ']'
		static_world_settings._parent_entities = '[' + static_worlds_manager.relative_id + ']'
		static_world_admin._parent_entities = '[' + static_worlds_manager.relative_id + ']'

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
