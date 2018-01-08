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

	def update_entity(self, entity_data):
		"""Updates the entity with the provided entity data (or adds a new one if that entity does not exist)."""
		print('Printing all the entities before doing an entity update')
		for e in self._entity_manager.get_all_entities():
			print(e)
		result = self._entity_manager.update_entity(entity_data)
		print('Printing all the entities after doing an entity update')
		for e in self._entity_manager.get_all_entities():
			print(e)
		return result

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



'''
class EntityOwner(object):
	"""Represents an Entity owner in the database."""

	def __init__(self, owner_data, entity_database_api):
		self._entity_database_api = entity_database_api
		self._data     = {}
		# self._entities is only used for the initial data population.
		self._entities = {}
		for key in owner_data:
			if str(key).isdigit():
				self._entities[int(key)] = owner_data[key]
			else:
				self._data[key] = owner_data[key]

		self._entity_manager = EntityManager()
		self._populate_entities()

	@property
	def entity_manager(self):
		"""Returns the entity manager object of this EntityOwner."""
		return self._entity_manager

	def get_pretty_print_entities(self):
		"""Temporary"""
		return self._entity_manager.get_pretty_print_all_entities()

	def print_entities(self):
		"""Temporary debugging function."""
		self._entity_manager.print_entities()

	def get_entities_as_string_lines(self):
		"""TODO : Document"""
		lines = []
		entities = self._entity_manager.get_all_entities()
		for e in entities:
			lines.append(str(e.get_full_info()))
		return lines

	def save_to_database(self, perform_replace=False):
		"""Utility function to send changes to the database."""

		# TODO : In the future only save the data that has been changed!!

		save_data = {}
		for key in self._data:
			save_data[key] = self._data[key]

			#print('Adding the following save data!?')
			#print(str(key) + '\t' + str(self._data[key]))
			#print('@@@@')

		entities_as_a_dictionary = self._entity_manager.get_all_entities_as_dictionary()
		for key in entities_as_a_dictionary:
			#print('Adding the following to the entities dictionary')
			#print(key)
			#print(entities_as_a_dictionary[key])
			save_data[key] = entities_as_a_dictionary[key]

		if not perform_replace:
			self._entity_database_api.update_owner_for_database(save_data)
		else:
			self._entity_database_api.replace_owner_for_database(save_data)

		#print('Here is the save data!!')
		#print(save_data)
		#print()

	def delete_entity_with_id(self, entity_id):
		"""Deletes the specified entity."""
		self._entity_manager.delete_entity(entity_id)

	def save_or_update_entity(self, entity_data):
		"""Updates the entity."""
		self._entity_manager.save_or_update_entity(entity_data)
		self.save_to_database()

	def get_entity_manager(self):
		"""Returns the EntityManager object holding this EntityOwner's entities."""
		return self._entity_manager

	def get_owner_name(self) -> str:
		"""Returns the name of this EntityOwner."""
		if be.ENTITY_PROPERTY_USERNAME not in self._data:
			return 'NO_OWNER_NAME_SET'
		return self._data[be.ENTITY_PROPERTY_USERNAME]

	def get_owner_password(self) -> str:
		"""Returns the password of this EntityOwner."""
		return self._data[be.ENTITY_PROPERTY_PASSWORD]

	def get_owner_id(self):
		"""Returns the _id of this EntityOwner."""
		return self._data[be.ENTITY_PROPERTY_SERVER_ID]

	def _populate_entities(self):
		"""Gives the entity data to the EntityManager."""
		for e in self._entities:
			base_entity = be.Entity()
			base_entity.set_relative_id(int(e))
			for key in self._entities[e]:
				value = self._entities[e][key]
				if key == be.ENTITY_DEFAULT_PROPERTY_TYPE:
					base_entity.set_entity_type(value)
				elif key == be.ENTITY_DEFAULT_PROPERTY_CHILD_IDS:
					base_entity._children_entities = ast.literal_eval(value)
				elif key == be.ENTITY_DEFAULT_PROPERTY_PARENT_IDS:
					base_entity._parent_entities = ast.literal_eval(value)
				elif key == be.ENTITY_DEFAULT_PROPERTY_RELATIVE_ID:
					base_entity.set_relative_id(int(value))
				else:
					base_entity.add_information(str(key), str(value))

			self._entity_manager.add_entities(base_entity)

		# In case owner entity was made, but eventually make this operation faster.
		#self._save_to_database()

	def get_number_of_entities(self) -> int:
		"""Returns the number of entities that this EntityOwner has."""
		return self._entity_manager.get_number_of_entities()

	def get_largest_entity_key(self) -> int:
		"""Returns the largest integer key found or -1 if none found."""
		return self._entity_manager.get_largest_entity_id()

	def does_entity_id_exist(self, entity_id) -> bool:
		"""Returns a boolean indicating if the entity ID exists for this owner."""
		for e in self._entities:
			if int(e) == entity_id:
				return True
		return False

	def __str__(self):
		return 'EntityOwner{' + str(self.get_owner_name()) + '} (has ' + str(self.get_number_of_entities()) + ' entities)'

'''