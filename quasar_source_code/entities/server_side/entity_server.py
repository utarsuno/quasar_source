# coding=utf-8

"""This module, entity_server.py, is used to manager a server's memory + cache of entity managers and owners."""

from quasar_source_code.entities.database import entity_database
from quasar_source_code.entities import base_entity as be
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

# Entity properties.
ENTITY_PROPERTY_ID       = 'ENTITY_PROPERTY_ID'
ENTITY_PROPERTY_TYPE     = 'ENTITY_PROPERTY_TYPE'
ENTITY_PROPERTY_POSITION = 'ENTITY_PROPERTY_POSITION'
ENTITY_PROPERTY_LOOK_AT  = 'ENTITY_PROPERTY_LOOK_AT'
ENTITY_PROPERTY_NAME     = 'ENTITY_PROPERTY_NAME'

# Entity types.
ENTITY_TYPE_TASK            = 'EntityTask'
ENTITY_TYPE_TIME            = 'EntityTime'
ENTITY_TYPE_BASE            = 'Entity'
ENTITY_TYPE_WALL            = 'EntityWall'
ENTITY_TYPE_OWNER           = 'EntityOwner'
ENTITY_TYPE_TEXT_REMINDER   = 'EntityTextReminder'
ENTITY_TYPE_NO_SPECIAL_TYPE = 'EntityNoSpecialType'


class EntityServer(object):
	"""Memory layer for entity managers and owners."""

	def __init__(self):
		self._db_api = EntityDatabaseAPI()

	def is_valid_login_info(self, username, password) -> bool:
		"""Returns a boolean indicating if a username and password combination is valid."""
		return self._db_api.is_valid_owner(username, password)

	def create_owner(self, owner_data):
		"""Creates an owner."""
		self._db_api.create_owner(owner_data)
