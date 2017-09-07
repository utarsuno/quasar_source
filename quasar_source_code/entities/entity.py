# coding=utf-8

"""This module, entity.py, defines the outline for entities."""

from datetime import datetime
from quasar_source_code.universal_code import time_abstraction as ta
from enum import Enum
from typing import List
from datetime import datetime


class AbstractEntity(object):
	"""Contains data that all entity objects must have."""

	def __init__(self):
		self._global_id         = None
		self._entity_properties = None


class Entity(AbstractEntity):
	"""Abstract representation to Entities."""

	# NOTE : Going through refactorings.

	def __init__(self, entity_name):
		super().__init__()
		self.name          = entity_name
		self._information  = {}
		self._entities     = []
		self._parent_entity = None

		self._properties = []

	def get_all_information_relevant_for_date(self, date):
		sub_set = self.get_entity_with_children()
		info = []
		for e in sub_set:
			entity_time_sub_set = e.get_all_property_objects_of_type('entity_time')

			print('Printing time sub set for entity : ' + str(e))
			for t in entity_time_sub_set:

				print(t.get_all_relevant_events_for_date(date))
				print(t)

	def get_all_property_objects_of_type(self, property_name) -> List:
		"""Returns a list of property objects of the specified property name. Empty list is returned if none were found."""
		objs = []
		for p in self._properties:
			if p.name == property_name:
				objs.append(p)
		return objs

	def get_property_info(self, property_name):
		info = []
		for p in self._properties:
			if p.name == property_name:
				info.append(str(p))
		return info

	def get_entity_with_children(self) -> List:
		"""Returns a list of entities which are this entity and all its children."""
		sub_set = [self]
		for e in self._entities:
			sub_set.append(e)
		return sub_set

	@property
	def entities(self) -> List:
		"""Returns a list of all entities in this entitiy."""
		return self._entities

	def add_property(self, entity_property) -> None:
		"""Adds an entity property to this entity."""
		self._properties.append(entity_property)

	def has_property(self, property_name) -> bool:
		"""Returns true if the property specified is found."""
		for prop in self._properties:
			if prop.name == property_name:
				return True
		return False

	def has_property_deep_search(self, property_name) -> bool:
		"""Returns true if this entity has the specified property or if any of it's child entities do."""
		sub_set = self.get_entity_with_children()
		for e in sub_set:
			if e.has_property(property_name):
				return True
		return False

	def get_property_deep_search(self, property_name):
		"""TODO : """
		sub_set = self.get_entity_with_children()
		info = []
		for e in sub_set:
			if e.has_property(property_name):
				info.append(e.get_property_info(property_name))
		return info

	def add_entities(self, e):
		"""Adds n entities."""
		if type(e) == Entity:
			self._entities.append(e)
			e._parent_entity = self
		else:
			for _e in e:
				self._entities.append(_e)
				_e._parent_entity = self

	def add_information(self, key, value):
		"""Adds key-pair information to keep track of."""
		self._information[key] = value

	def __str__(self):
		if self._parent_entity is not None:
			return 'Entity : ' + self.name + ', child of : ' + self._parent_entity.name
		return 'Entity : ' + self.name


# TODO : The manager should be able to print between either days of the week or by entities.
class EntityManager(AbstractEntity):
	"""Defines management operations for Entities."""

	def __init__(self):
		super().__init__()
		self.entities = []

	def add_entities(self, e):
		"""Adds an entity to be managed."""
		if type(e) == list or type(e) == tuple:
			for _e in e:
				self.entities.append(_e)
		else:
			self.entities.append(e)

	def print_information_for_specific_day(self, day_obj):
		"""Prints information relevant to the specific day passed in."""
		print('Printing information for ' + ta.Day(ta.get_day_of_the_week_number_from_datetime(day_obj)).name + ' : ' + str(day_obj))

		# Go through all entities.
		for parent_entity in self.entities:
			entity_list = parent_entity.get_entity_with_children()

			# Go through that entities list of entities and itself :
			for e in entity_list:

				# Print all relevant time information.
				if e.has_property_deep_search('entity_time'):
					print(e.get_all_information_relevant_for_date(day_obj))

	def print_information_for_this_week(self):
		"""Prints all information relevant to this week."""
		self.print_information_for_specific_day(ta.get_day_object_from_current_weeks_day(ta.Day.MONDAY))
		print()
		self.print_information_for_specific_day(ta.get_day_object_from_current_weeks_day(ta.Day.TUESDAY))
		print()
		self.print_information_for_specific_day(ta.get_day_object_from_current_weeks_day(ta.Day.WEDNESDAY))
		print()
		self.print_information_for_specific_day(ta.get_day_object_from_current_weeks_day(ta.Day.THURSDAY))
		print()
		self.print_information_for_specific_day(ta.get_day_object_from_current_weeks_day(ta.Day.FRIDAY))
		print()
		self.print_information_for_specific_day(ta.get_day_object_from_current_weeks_day(ta.Day.SATURDAY))
		print()
		self.print_information_for_specific_day(ta.get_day_object_from_current_weeks_day(ta.Day.SUNDAY))
		print()

	def print_information_by_entities(self):
		"""Prints information sorted by entities."""
		y = 2 # TODO : This function

