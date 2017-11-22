# coding=utf-8

"""This module, entity_manager.py, contains management code and a class for dealing with entities."""

ENTITY_PROPERTY_TYPE     = 'ENTITY_PROPERTY_TYPE'
ENTITY_PROPERTY_CHILDREN = 'ENTITY_PROPERTY_CHILDREN'
ENTITY_PROPERTY_PARENTS  = 'ENTITY_PROPERTY_PARENTS'
ENTITY_PROPERTY_ID       = 'ENTITY_PROPERTY_ID'
ENTITY_PROPERTY_ALL      = [ENTITY_PROPERTY_TYPE, ENTITY_PROPERTY_CHILDREN, ENTITY_PROPERTY_PARENTS, ENTITY_PROPERTY_ID]


class EntityManager(object):
	"""Defines management operations for Entities."""

	def __init__(self):
		super().__init__()
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

	def update_entity(self, entity_data):
		"""Updates an entity with the data provided."""
		for e in self.entities:
			if str(e.relative_id) == entity_data[ENTITY_PROPERTY_ID]:
				for key in entity_data:
					value = entity_data[key]
					if key == ENTITY_PROPERTY_TYPE:
						e.set_entity_type(value)
					else:
						e.add_information(str(key), str(value))

	def get_all_entities_as_dictionary(self) -> dict:
		"""Returns all the entities represented in a single dictionary."""
		all_entities = {}
		for e in self.entities:
			all_entities[str(e.relative_id)] = e.get_json_data()
