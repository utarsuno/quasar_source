# coding=utf-8

"""This module, consumers.py, is used to handle basic connections between the client and server."""

from channels.generic.websocket import AsyncWebsocketConsumer
#from channels import Group
from asgiref.sync import async_to_sync
import json
import uuid

_WEB_SOCKET_REQUEST_KEY_REQUEST_TYPE = 'r'
# Client request values.
_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOGIN          = 1
_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_CREATE_ACCOUNT = 2
_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOAD_USER_DATA = 3
_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_LOGOUT         = 4
_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_SAVE_DATA      = 5
_WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_CHAT_MESSAGE   = 6

# Temporary design.
_WEB_SOCKET_KEY_CHAT_CHANNEL = 'cc'
_WEB_SOCKET_KEY_CHAT_MESSAGE = 'cm'
_WEB_SOCKET_KEY_CHAT_USER    = 'cu'

from quasar_site_django.quasar_web_server.web_sockets_server.quasar_web_socket_server import QuasarWebSocketsServerSide

quasar_web_sockets_server = QuasarWebSocketsServerSide()


class ConsumerManager(AsyncWebsocketConsumer):
	"""The initial point of web socket handling."""

	def __init__(self, scope):
		super().__init__(scope)
		global quasar_web_sockets_server
		self._web_socket_server = quasar_web_sockets_server

		self.global_chat = 'global_chat'

		self.groups_for_one_to_one_communication = {}

		self._user_groups = {}

	async def connect(self):
		#print('Just made a websocket connection!')
		#print('Connection ID : ' + self.channel_name)
		self._web_socket_server.add_connection(self.channel_name)

		#print(self.c)

		# One to one communication.
		self.channel_layer.group_add(
			self.channel_name,
			self.channel_name
		)

		# Add the client to the global chat.
		self.channel_layer.group_add(
			self.global_chat,
			self.channel_name
		)

		await self.accept()

	async def disconnect(self, close_code):
		#print('websocket disconnect!')
		#print('Connection ID : ' + self.channel_name)
		self._web_socket_server.remove_connection(self.channel_name)

	async def receive(self, text_data):
		r = json.loads(text_data)
		request_type = r[_WEB_SOCKET_REQUEST_KEY_REQUEST_TYPE]

		await self.send(text_data=json.dumps({
			"text": self._web_socket_server.get_reply(self.channel_name, r),
		}))

		# If the request type was a chat message then also send the chat message.
		if request_type == _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_CHAT_MESSAGE:
			print('Need to send a chat message reply!')

			user = self._web_socket_server.get_username_from_channel_name(self.channel_name)

			await self.channel_layer.group_send(
				self.global_chat,
				{
					'type': 'chat.message',
					'message': {_WEB_SOCKET_KEY_CHAT_CHANNEL: r[_WEB_SOCKET_KEY_CHAT_CHANNEL],
					_WEB_SOCKET_KEY_CHAT_MESSAGE: r[_WEB_SOCKET_KEY_CHAT_MESSAGE],
					_WEB_SOCKET_KEY_CHAT_USER: user}
				}
			)

			#self.send_chat_message(r, self.channel_name)

	async def chat_message(self, e):
		"""Sends the chat message."""
		#c = e[_WEB_SOCKET_KEY_CHAT_CHANNEL]

		print('Trying to send chat message!')
		await self.send(text_data=json.dumps({
			'message':
				{
					_WEB_SOCKET_KEY_CHAT_CHANNEL: e[_WEB_SOCKET_KEY_CHAT_CHANNEL],
					_WEB_SOCKET_KEY_CHAT_MESSAGE: e[_WEB_SOCKET_KEY_CHAT_MESSAGE],
					_WEB_SOCKET_KEY_CHAT_USER   : e[_WEB_SOCKET_KEY_CHAT_USER]
				}
		}))
		print('Sent chat message!')
