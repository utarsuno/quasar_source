# coding=utf-8

"""This module, web_socket_consumer_abstraction.py, provides an abstraction to AsyncWebsocketConsumer."""

from channels.generic.websocket import AsyncWebsocketConsumer
import json


class WebSocketConsumerAbstract(AsyncWebsocketConsumer):
	"""Handles sending and receiving of web socket messages."""

	WEB_SOCKET_KEY_MESSAGE_TYPE = 't'

	def __init__(self, scope):
		super().__init__(scope)

		self.channel_global           = 'channelGlobal'
		self.channel_individual_users = []
		self._server_logic            = None

	def set_server_logic(self, server_logic):
		"""Provides the response logic for this web-socket consumer."""
		self._server_logic = server_logic

	async def connect(self):
		print('Just made a websocket connection!')
		print('Connection ID : ' + self.channel_name)
		#self._server_logic.add_connection(self.channel_name)
		self.channel_individual_users.append(self.channel_name)

		#print(self.c)

		# One to one communication.
		#await self.channel_layer.group_add(
		#	self.channel_name,
		#	self.channel_name
		#)

		# Add the client to the global chat.
		await self.channel_layer.group_add(
			self.channel_global,
			self.channel_name
		)

		await self.accept()

	async def disconnect(self, close_code):
		print('websocket disconnect!')
		print('Connection ID : ' + self.channel_name)
		#self._server_logic.remove_connection(self.channel_name)
		self.channel_individual_users.remove(self.channel_name)
		await self.channel_layer.group_discard(
			self.channel_global,
			self.channel_name
		)

	async def receive(self, text_data):
		print('received the following message : { ' + str(text_data) + '}')

		r = json.loads(text_data)
		#request_type = r[WebSocketConsumerAbstract.WEB_SOCKET_KEY_MESSAGE_TYPE]

		#await self.send(text_data=json.dumps({
		#	"text": self._server_logic.get_reply(self.channel_name, r),
		#}))

		await self.send(text_data=json.dumps({
			"text": "{'hi':'hi'}",
		}))

		'''
		# If the request type was a chat message then also send the chat message.
		if request_type == _WEB_SOCKET_REQUEST_VALUE_REQUEST_TYPE_CHAT_MESSAGE:

			user = self._web_socket_server.get_username_from_channel_name(self.channel_name)

			await self.channel_layer.group_send(
				self.global_chat,
				{
					'type': 'chat.message',
					_WEB_SOCKET_KEY_CHAT_CHANNEL: r[_WEB_SOCKET_KEY_CHAT_CHANNEL],
					_WEB_SOCKET_KEY_CHAT_MESSAGE: r[_WEB_SOCKET_KEY_CHAT_MESSAGE],
					_WEB_SOCKET_KEY_CHAT_USER   : user
				}
			)
		'''


	'''

	async def chat_message(self, event):
		"""Sends the chat message."""
		await self.send(text_data=json.dumps({
			'text':
				{
					_WEB_SOCKET_KEY_CHAT_CHANNEL: event[_WEB_SOCKET_KEY_CHAT_CHANNEL],
					_WEB_SOCKET_KEY_CHAT_MESSAGE: event[_WEB_SOCKET_KEY_CHAT_MESSAGE],
					_WEB_SOCKET_KEY_CHAT_USER   : event[_WEB_SOCKET_KEY_CHAT_USER],
					_WEB_SOCKET_RESPONSE_KEY_MESSAGE_TYPE: _WEB_SOCKET_RESPONSE_VALUE_MESSAGE_TYPE_CHAT_MESSAGE
				}
		}))

	'''