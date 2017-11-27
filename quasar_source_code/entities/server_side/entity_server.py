# coding=utf-8

"""This module, entity_server.py, is used to manager a server's memory + cache of entity managers and owners."""

from quasar_source_code.entities.database import entity_database
from quasar_source_code.entities import base_entity as be
from quasar_source_code.entities import entity_owner as eo
from quasar_source_code.entities.server_side import text_reminders as tr

# Needed for sending a simple HttpResponse such as a string response.
from django.http import HttpResponse

from quasar_source_code.universal_code import time_abstraction as ta

import json

from django.http import JsonResponse

from quasar_source_code.entities.database.entity_database import EntityDatabaseAPI


# Utility indexes.
INDEX_OWNER_NAME       = 0
INDEX_OWNER_PASSWORD   = 1
INDEX_OWNER_EMAIL      = 2
INDEX_OWNER_ID         = 3
INDEX_OWNER_MANAGER_ID = 4

# Server response messages.
SERVER_REPLY_INVALID_POST_DATA_ERROR                = HttpResponse('Invalid POST data!')
SERVER_REPLY_INVALID_NUMBER_OF_POST_ARGUMENTS_ERROR = HttpResponse('Invalid number of POST arguments!')
SERVER_REPLY_GENERIC_NO                             = HttpResponse('n')
SERVER_REPLY_GENERIC_YES                            = HttpResponse('y')
SERVER_REPLY_GENERIC_SERVER_ERROR                   = HttpResponse('Server Error!')

# Public entities owner name
PUBLIC_ENTITIES_OWNER = 'public_entities'


class EntityServer(object):
	"""Memory layer for entity managers and owners."""

	def __init__(self):
		self._db_api = EntityDatabaseAPI()

		# TODO : Add the text reminder object here.
		# TODO : Eventually pass in all the current text reminders in order to do a health check.
		# self._text_reminders_manager = tr.TextReminderManager()

	def is_valid_login_info(self, username, password) -> bool:
		"""Returns a boolean indicating if a username and password combination is valid."""
		return self._db_api.is_valid_owner(username, password)

	def is_username_taken(self, username) -> bool:
		"""Returns a boolean indicating if the username is taken."""
		return self._db_api.is_owner_name_taken(username)

	# TODO : delete owner function

	def delete_entity(self, owner_name, entity_id_to_delete):
		"""Deletes an entity."""
		if not self._db_api.is_owner_id_valid(owner_name):
			return HttpResponse('Invalid owner name provided!')
		self._db_api.delete_entity(owner_name, entity_id_to_delete)

	def create_owner(self, owner_data):
		"""Creates an owner. Throws an exception if the required owner keys are not provided."""
		# Required keys passed in check.
		for required_key in eo.OWNER_KEYS_REQUIRED:
			if required_key not in owner_data:
				return HttpResponse('Required key data not provided for creating an owner! Missing at least {' + required_key + '} from the provided {' + str(owner_data) + '}')

		# Username not already taken check.
		if self._db_api.is_owner_name_taken(owner_data[eo.OWNER_KEY_USERNAME]):
			return HttpResponse('The username{' + owner_data[eo.OWNER_KEY_USERNAME] + '} is already taken!')

		# Checks passed, create the owner.
		self._db_api.create_owner(owner_data)
		return SERVER_REPLY_GENERIC_YES

	def update_owner(self, owner_data):
		"""Updates an owner. Throws an exception if the _id key is not provided."""
		# Required keys passed in check.
		if eo.OWNER_KEY_ID not in owner_data:
			return HttpResponse('Required key data not provided for updating an owner! Missing at the _id key from ' + str(owner_data) + '}')

		# Owner ID exists check.
		if not self._db_api.is_owner_id_valid(owner_data[eo.OWNER_KEY_ID]):
			return HttpResponse('The owner ID{' + str(owner_data[eo.OWNER_KEY_ID]) + '} is not valid!')

		self._db_api.update_owner(owner_data)
		return SERVER_REPLY_GENERIC_YES

	def save_or_update_entity(self, owner_name, entity_data):
		"""Creates a new entity or modifies an existing with with the new data."""
		# Update the entity for the owner.
		self._db_api.save_or_update_entity(owner_name, entity_data)

		# TODO : Add text reminder checking logic here

	def get_all_users_entities(self, owner_name, owner_password):
		"""Returns a JSON response containing all the user's entities."""
		# Check for valid username and password.
		if not self._db_api.is_valid_owner(owner_name, owner_password):
			return HttpResponse('Invalid username and password!')

		#print('GET ALL USER ENTITIES RESPONSE IS ')
		response = self._db_api.get_all_entities_from_owner_as_json(owner_name)

		return JsonResponse(response)

	def get_all_public_entities(self):
		"""Returns all the public entities."""
		return JsonResponse(self._db_api.get_all_entities_from_owner_as_json(PUBLIC_ENTITIES_OWNER))

	def print_full_status(self):
		"""Temporary debugging function."""
		return self._db_api.get_data_on_all_owners()

	def get_managers_cache_report(self):
		"""Return the current status of the managers cache."""
		return self._db_api.get_pretty_print_data_on_all_owners()
