# coding=utf-8

"""This module, quasar_world_server.py, defines the class and operations for running the QuasarWorldServer."""

from channels import Group
from channels.sessions import channel_session


WEB_SOCKET_MESSAGE_TYPE_CONNECTION                  = '|C|'
WEB_SOCKET_MESSAGE_TYPE_CHAT_MESSAGE                = '|M|'
WEB_SOCKET_MESSAGE_TYPE_LOOK_AT_UPDATE              = '|L|'
WEB_SOCKET_MESSAGE_TYPE_POSITION_UPDATE             = '|P|'
WEB_SOCKET_MESSAGE_TYPE_POSITION_AND_LOOK_AT_UPDATE = '|U|'
#str(user) + str(command) + str(data),

SERVER_USER_ID = 's'


def send_message_to_all_user_in_group(message, group_name):
	"""Sends a message to all users in the specified group."""
	Group(group_name).send({"text": message})


def send_chat_message_to_all_logged_in_users(chat_message):
	"""Sends a global server meesage to everyone currently logged in."""
	Group('users').send({'text': SERVER_USER_ID + WEB_SOCKET_MESSAGE_TYPE_CHAT_MESSAGE + chat_message})


class QuasarPlayer(object):
	"""Represents a single logged in user."""

	def __init__(self, reply_channel_key):
		self._reply_channel_key = reply_channel_key
		self._player_name       = None

	@property
	def web_socket_key(self):
		"""Returns the unique web socket key that this player currently has."""
		return self._reply_channel_key

	@property
	def player_name(self):
		"""Returns the name of the player."""
		return self._player_name

	@player_name.setter
	def player_name(self, val):
		"""Sets the player name for this object."""
		self._player_name = val


class QuasarPlayerServer(object):
	"""Handles the multi-player logic."""

	def __init__(self):
		self._clients = []

	def add_web_socket_connection(self, reply_channel_key):
		"""Adds an initial web socket connection."""
		self._clients.append(QuasarPlayer(reply_channel_key))

	def player_logged_in(self, reply_channel_key, player_name):
		"""This message gets sent after the web socket connection."""
		player_match_found = False

		for c in self._clients:
			if str(c.web_socket_key) == str(reply_channel_key):
				print(player_name + ' is now logged in!')
				c.player_name = player_name
				send_chat_message_to_all_logged_in_users(player_name + ' has logged in!')
				player_match_found = True

		if not player_match_found:
			print('Did not find a player match for : ' + player_name + ' - ' + str(reply_channel_key))
			for c in self._clients:
				print(c.web_socket_key)

	def remove_web_socket_connection(self, reply_channel_key):
		"""Removes a web socket connection."""
		object_to_remove = None
		for c in self._clients:
			if str(c.web_socket_key) == str(reply_channel_key):
				object_to_remove = c
		if object_to_remove is not None:
			send_chat_message_to_all_logged_in_users(object_to_remove.player_name + ' has logged out!')
			self._clients.remove(object_to_remove)
		else:
			print('Did not find a player match for : ' + reply_channel_key)
			for c in self._clients:
				print(c.web_socket_key)
