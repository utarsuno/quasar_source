# coding=utf-8

"""This module, consumers.py, is used to handle basic connections between the client and server."""

from channels.generic.websocket import AsyncWebsocketConsumer
#from channels import Group
from asgiref.sync import async_to_sync
import json
import uuid

from quasar_site_django.quasar_web_server.web_sockets_server.quasar_web_socket_server import QuasarWebSocketsServerSide

quasar_web_sockets_server = QuasarWebSocketsServerSide()


class ConsumerManager(AsyncWebsocketConsumer):
	"""The initial point of web socket handling."""

	def __init__(self, scope):
		super().__init__(scope)
		global quasar_web_sockets_server
		self._web_socket_server = quasar_web_sockets_server

		self.groups_for_one_to_one_communication = {}

		self._user_groups = {}

	async def connect(self):
		#print('Just made a websocket connection!')
		#print('Connection ID : ' + self.channel_name)
		self._web_socket_server.add_connection(self.channel_name)

		#print(self.c)

		self.channel_layer.group_add(
			self.channel_name,
			self.channel_name
		)

		await self.accept()

	async def disconnect(self, close_code):
		#print('websocket disconnect!')
		#print('Connection ID : ' + self.channel_name)
		self._web_socket_server.remove_connection(self.channel_name)

	async def receive(self, text_data):
		await self.send(text_data=json.dumps({
			"text": self._web_socket_server.get_reply(self.channel_name, text_data),
		}))
