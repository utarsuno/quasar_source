# coding=utf-8

"""This module, entity_time_properties.py, defines time properties for Entities."""

from quasar_source_code.entities.properties import entity_properties as ep
from datetime import datetime
from quasar_source_code.universal_code import time_abstraction as ta


class EntityTime(ep.EntityProperty):
	"""Represents all forms of time logic for entities."""

	def __init__(self, parent_entity=None):
		super().__init__('entity_time')
		self._one_time_events    = []
		self._event_range        = None
		self._event_range_events = []
		if parent_entity is not None:
			parent_entity.add_property(self)
		self._parent_entity = parent_entity

	def add_one_time_event(self, time_range_or_single_day, event):
		"""Adds a time event that only occurs once."""
		self._one_time_events.append([time_range_or_single_day, event])

	def set_event_range(self, time_range, range_name):
		"""Sets the event range that occurs weekly-repeating events."""
		self._event_range = [time_range, range_name]

	def add_event_to_event_range(self, time_range, event):
		"""Adds a weekly repeating event to the specified event range."""
		self._event_range_events.append([time_range, event])

	def get_all_relevant_events_for_date(self, date):
		"""Returns a list of all relevant events for the date passed in."""

		#print('Checking : ' + str(date))


		events = []
		# First check for any one time events that fall into this date.
		for ote in self._one_time_events:

			print('Checking event : ' + str(ote))

			if type(ote[0]) == ta.Weekday:
				if date.weekday() == ote[0].day_of_the_week:
					events.append(ote[1])
			else:
				# We are working with a time range.
				if ote[0].is_date_within_range(date):
					events.append(ote[1])

		# Now check for any events that fall within the event range if the date provided falls within the event range.
		if self._event_range is not None:

			print('Does {' + str(self._event_range[0]) + '} contain{' + str(date) + '}? ' + str(self._event_range[0].is_date_within_range(date)))

			if self._event_range[0].is_date_within_range(date):
				# Now check each sub time-ranges.
				for event in self._event_range_events:

					#print('Checking event : ' + str(event))

					if event[0].is_date_within_range(date):
						events.append(event[1])

		return events

	def __str__(self):
		return 'EntityTime instance, child of ' + str(self._parent_entity)
