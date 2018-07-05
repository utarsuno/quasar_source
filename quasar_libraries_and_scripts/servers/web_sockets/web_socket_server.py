# coding=utf-8

"""This module, web_socket_server.py, provides an abstraction to handling web-socket messages, logic wise."""




class NexusLocalWebSocketsServerSide(object):
	"""Handles web socket server side requests."""

	def __init__(self):
		self._quasar_server = qs.QuasarServer()
		self._quasar_server.connect()

		self.players = {}


