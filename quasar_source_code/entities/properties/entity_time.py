# coding=utf-8

"""This module, entity_time.py, defines time properties for Entities."""

from quasar_source_code.entities.properties import entity_properties as ep
from quasar_source_code.entities import base_entity as be
from datetime import datetime
from quasar_source_code.universal_code import time_abstraction as ta


class EntityTime(be.Entity):
	"""Represents all forms of time logic for entities."""

	def __init__(self, entity_name, parent_entity):
		super().__init__(entity_name)
		self._one_time_events    = []
		self._event_range        = None
		self._event_range_events = []

		self.add_parents(parent_entity)
		self._class_name = be.ENTITY_TIME

	def get_additional_needed_save_info(self) -> dict:
		"""Returns a dictionary containing class instance information that a regular base Entity does not contain."""
		one_time_events_string = '[]'
		event_range_string = 'None'
		event_range_events_string = '[]'
		if len(self._one_time_events) > 0:
			one_time_events_string = ''
			for ote in self._one_time_events:
				one_time_events_string += '[' + str(ote[0]) + ',' + str(ote[1]) + '],'
			one_time_events_string = '[' + one_time_events_string[0:-1] + ']'
		if self._event_range is not None:
			event_range_string = '[' + str(self._event_range[0]) + ',' + str(self._event_range[1]) + ']'
		if len(self._event_range_events) > 0:
			event_range_events_string = ''
			for ere in self._event_range_events:
				event_range_events_string += '[' + str(ere[0]) + ',' + str(ere[1]) + ']'
			event_range_events_string = '[' + event_range_events_string[:-1] + ']'
		return {'one_time_events': one_time_events_string,
		        'event_range': event_range_string,
		        'event_range_events': event_range_events_string}

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

			#print('Checking event : ' + str(ote))

			if type(ote[0]) == ta.Weekday:
				if date.weekday() == ote[0].day_of_the_week:
					events.append(ote[1])
			else:
				if str(type(ote[0])) == "<class 'datetime.date'>":
					if ote[0].day == date.day and ote[0].month == date.month:
						events.append(ote[1])
				else:
					# We are working with a time range.
					if ote[0].is_date_within_range(date):
						events.append(ote[1])

		# Now check for any events that fall within the event range if the date provided falls within the event range.
		if self._event_range is not None:

			#print('Does {' + str(self._event_range[0]) + '} contain{' + str(date) + '}? ' + str(self._event_range[0].is_date_within_range(date)))

			if self._event_range[0].is_date_within_range(date):
				# Now check each sub time-ranges.
				for event in self._event_range_events:

					#print('Checking event : ' + str(event))

					if event[0].is_date_within_range(date):
						events.append(event[1])

		return events

	def __str__(self):
		return 'EntityTime instance{' + self.name + '}, child of ' + str(self.parents[0])
