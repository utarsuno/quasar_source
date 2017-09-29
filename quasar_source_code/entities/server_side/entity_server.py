# coding=utf-8

"""This module, entity_server.py, is used to manager a server's memory + cache of entity managers and owners."""

from quasar_source_code.entities.database import entity_database

# Needed for sending a simple HttpResponse such as a string response.
from django.http import HttpResponse

from quasar_source_code.universal_code import time_abstraction as ta

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


class EntityServer(object):
	"""Memory layer for entity managers and owners."""

	def __init__(self):
		self._db_api   = entity_database.EntityDatabaseAPI(debug=True)
		self._owners   = self._db_api.get_all_owners()
		# Managers are loaded as needed.
		self._managers = {}

	def _update_owners(self):
		"""Updates the owners list."""
		self._owners = self._db_api.get_all_owners()

	def _is_username_taken(self, username) -> bool:
		"""Returns a boolean indicating if a username is taken."""
		for o in self._owners:
			if o[INDEX_OWNER_NAME] == username:
				return True
		return False

	def is_valid_login_info(self, username, password) -> bool:
		"""Returns a boolean indicating if a username and password combination is valid."""
		for o in self._owners:
			if o[INDEX_OWNER_NAME] == username and o[INDEX_OWNER_PASSWORD] == password:
				return SERVER_REPLY_GENERIC_YES
		return HttpResponse('Username or password is not valid!')

	def create_owner(self, owner_name, owner_email, owner_password):
		"""Creates an owner."""
		self._update_owners()
		if self._is_username_taken(owner_name):
			return HttpResponse('Username is taken!')
		else:
			# TODO : other checks here too.
			self._db_api.create_owner(name=owner_name, email=owner_email, password=owner_password)
			return SERVER_REPLY_GENERIC_YES

	def load_entity_manager(self, owner_name):
		"""Loads an entity_manager through the reference of an owner name."""
		for o in self._owners:
			if o[INDEX_OWNER_NAME] == owner_name:
				manager = self._db_api.get_entity_manager(manager_id=o[INDEX_OWNER_MANAGER_ID])
				self._managers[owner_name] = manager
				return SERVER_REPLY_GENERIC_YES
		return HttpResponse('Internal server error 555')

	def get_entities_for_day(self, day, username):
		"""Gets the entities for the day provided."""
		day = day.replace('117', '2017')
		print('NEED TO GET ENTITIES FOR THIS DAY : for usr{' + str(username) + '}')
		print(day)

		parts = day.split('/')
		specific_day = ta.get_specific_day(year=int(parts[2]), month=int(parts[0]), day=int(parts[1]))

		data = self._managers[username].get_information_for_specific_day(specific_day)

		return HttpResponse(data)
