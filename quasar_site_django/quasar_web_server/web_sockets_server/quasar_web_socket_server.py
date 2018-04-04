# coding=utf-8

"""This module, quasar_web_socket_server.py, provides an abstraction to handling server-side web-socket requests."""


class QuasarConnectedClient(object):
	"""Represents a single connected Quasar client."""

	def __init__(self, web_socket_id):
		self.web_socket_id = web_socket_id
		self.logged_in     = False


class QuasarWebSocketsServerSide(object):
	"""Handles web socket server side requests."""

	def __init__(self):
		self.players = []

	def add_connection(self, channel_name):
		"""Adds a new connection."""
		self.players.append(QuasarConnectedClient(channel_name))

	def remove_connection(self, channel_name):
		"""Removes a connection."""
		p = self._get_player_by_channel_name(channel_name)
		if p is not None:
			self.players.remove(p)

	def _get_player_by_channel_name(self, channel_name):
		"""Returns a player by provided channel name."""
		for p in self.players:
			if p.web_socket_id == channel_name:
				return p
		return None
