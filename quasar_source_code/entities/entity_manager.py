# coding=utf-8

"""This module, entity_manager.py, contains management code and a class for dealing with entities."""

from quasar_source_code.entities import base_entity as be
from quasar_source_code.universal_code import time_abstraction as ta

from lazyme.string import color_print


class EntityManager(object):
	"""Defines management operations for Entities."""

	def __init__(self):
		self.entities = []

	def get_number_of_entities(self) -> int:
		"""Returns the number of entities that this EntityManager has."""
		return len(self.entities)

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

	def get_pretty_print_all_entities(self):
		"""Prints condensed information of all the entities."""
		#print('Printing condensed information on the entities!')
		pretty = ''
		for e in self.entities:
			pretty += e.get_pretty_print() + '\n'
		#print('------------------------------------------')
		return pretty

	def print_entities(self):
		"""Prints the information of all the entities."""
		print('Printing information on the entities!')
		for e in self.entities:
			print(str(e))
		print('------------------------------------------')

	def get_largest_entity_id(self) -> int:
		"""Returns the largest entity ID found, -1 if there are no entities."""
		largest_id = -1
		for e in self.entities:
			if int(e.relative_id) > largest_id:
				largest_id = int(e.relative_id)
		return largest_id

	def get_entity_by_id(self, entity_id):
		"""Returns an entity."""
		for e in self.entities:
			if e.relative_id == entity_id:
				return e
		return None

	def get_all_entities(self):
		"""Returns all the entities of this manager."""
		return self.entities

	def print_all_entities(self):
		"""Prints information for all entities and any linked entities."""
		print('Printing information on the entities and all linked entities!')
		for e in self.entities:
			print(str(e))
			for e_child in e.all_children:
				print(str(e_child))
		print('------------------------------------------')

	def _add_entity(self, e):
		"""Adds an entity but ensures that an entity with that relative ID doesn't first already exist."""
		if self.get_entity_by_id(e.relative_id) is None:
			self.entities.append(e)
		else:
			color_print('Tried to add entity {' + str(e) + '} but an entity with the same ID already exists!', color='red', bold=True)
			# TODO : Start making exit codes and their statues.
			exit(-5)

	def add_entities(self, e):
		"""Adds an entity to be managed."""
		if type(e) == list or type(e) == tuple:
			for _e in e:
				self.entities.append(_e)
		else:
			self.entities.append(e)

	def save_or_update_entity(self, entity_data):
		"""Creates a new entity or updates with the data provided."""
		create_a_brand_new_entity = False
		entity_match              = None

		data_has_relative_id = be.ENTITY_DEFAULT_PROPERTY_RELATIVE_ID in entity_data
		if not data_has_relative_id:
			create_a_brand_new_entity = True
		else:
			entity_match      = self.get_entity_by_id(entity_data[be.ENTITY_DEFAULT_PROPERTY_RELATIVE_ID])
			relative_id_found = entity_match is not None
			if not relative_id_found:
				create_a_brand_new_entity = True

		if create_a_brand_new_entity:
			new_entity_relative_id = self.get_largest_entity_id() + 1
			new_entity = be.Entity()
			new_entity.initialize_from_data(new_entity_relative_id, entity_data)
			self.add_entities(new_entity)
		else:
			# Performing an update instead.
			entity_match.update_values(entity_data)

	def get_all_entities_as_dictionary(self) -> dict:
		"""Returns all the entities represented in a single dictionary."""
		#print('get_all_entities_as_dictionary')
		all_entities = {}
		#print()
		for e in self.entities:
			#print(e)
			all_entities[str(e.relative_id)] = e.get_json_data()
		#print()
		return all_entities

	def delete_entity(self, entity_id):
		"""Deletes the entity with an ID match."""
		entity_to_remove = None
		for e in self.entities:
			if int(e.relative_id) == int(entity_id):
				entity_to_remove = e
		if entity_to_remove is not None:
			#print('Before the remove there were ' + str(len(self.entities)) + ' entities!')
			a = self.get_all_entities_as_dictionary()
			#print(self.entities)
			self.entities.remove(entity_to_remove)
			b = self.get_all_entities_as_dictionary()
			#print(self.entities)
			#print('There are now ' + str(len(self.entities)) + ' entities!')

			#print(len(a))
			#print(len(b))
		else:
			print('ERROR DID NOT FIND THE ENTITY TO DELETE ! ' + str(entity_id))

	def get_entity_owner(self):
		"""Returns the Entity that represents the EntityOwner. Returns None if no entity owner found."""
		for e in self.entities:
			if e.get_value(be.ENTITY_DEFAULT_PROPERTY_TYPE) == be.ENTITY_TYPE_OWNER:
				return e
		return None

	def ensure_entity_owner_exists(self, owner_data, owner_server_id) -> bool:
		"""Creates the owner entity if it does not yet exist. Returns a boolean, True indicates an owner was created."""
		if self.get_entity_owner() is not None:
			return False

		data = {}
		data[be.ENTITY_PROPERTY_CREATED_AT_DATE] = str(ta.get_now())
		data[be.ENTITY_DEFAULT_PROPERTY_TYPE]    = be.ENTITY_TYPE_OWNER
		data[be.ENTITY_PROPERTY_SERVER_ID]       = owner_server_id
		data[be.ENTITY_PROPERTY_USERNAME]        = owner_data[be.ENTITY_PROPERTY_USERNAME]
		data[be.ENTITY_PROPERTY_PASSWORD]        = owner_data[be.ENTITY_PROPERTY_PASSWORD]
		data[be.ENTITY_PROPERTY_EMAIL]           = owner_data[be.ENTITY_PROPERTY_EMAIL]
		self.save_or_update_entity(data)

		return True
