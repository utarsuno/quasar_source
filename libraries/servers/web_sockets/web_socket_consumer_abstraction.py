# coding=utf-8

"""This module, web_socket_consumer_abstraction.py, provides an abstraction to AsyncWebsocketConsumer."""

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import sys


class WebSocketConsumerAbstract(AsyncJsonWebsocketConsumer):
	"""Handles sending and receiving of web socket messages."""

	_WEB_SOCKET_KEY_TYPE    = 't'
	_WEB_SOCKET_KEY_ID      = 'm'
	_WEB_SOCKET_KEY_SUCCESS = 's'
	_WEB_SOCKET_KEY_DATA    = 'd'

	_WEB_SOCKET_RESPONSE_VALUE_SUCCESS_TRUE  = 1
	_WEB_SOCKET_RESPONSE_VALUE_SUCCESS_FALSE = 0

	def __init__(self, scope):
		super().__init__(scope)
		self._debug_mode   = False
		self._clients      = {}
		self._client_id    = 0

		#self.channel_global           = 'channelGlobal'

	def add_client(self, channel_name):
		"""Adds a new client connection."""
		self._clients[channel_name] = str(self._client_id)
		self._client_id += 1

	def print_logging(self, m, flush=True):
		"""Prints a message."""
		if self._debug_mode:
			print(m)
			if flush:
				sys.stdout.flush()

	async def connect(self):
		self.print_logging('Websocket {' + str(self.channel_name) + '} connected!')

		self.add_client(self.channel_name)

		# One to one communication.
		await self.channel_layer.group_add(
			self._clients[self.channel_name],
			self.channel_name
		)

		# Add the client to the global chat.
		#await self.channel_layer.group_add(
		#	self.channel_global,
		#	self.channel_name
		#)

		await self.accept()

	async def disconnect(self, close_code):
		self.print_logging('Websocket {' + str(self.channel_name) + '} disconnected!')

		await self.channel_layer.group_discard(
			self._clients[self.channel_name],
			self.channel_name
		)

		del self._clients[self.channel_name]

	async def receive_json(self, content, **kwargs):
		self.print_logging('Received the following JSON message {' + str(content) + '}')
		await self.on_message_received(content, self.channel_name)

	async def send_message_to_individual(self, message, channel):
		"""Sends a message to the provided channel."""
		self.print_logging('TRYING TO SEND A MESSAGE!!!!')
		channel_layer = get_channel_layer()
		await channel_layer.group_send(self._clients[channel], {
			'type': 'send.message.to.single.client',
			'content': message
		})

	async def send_message_to_single_client(self, content):
		"""Sends a message to a single client."""
		self.print_logging('SENDING THE FOLLOWING SINGLE MESSAGE {' + str(content) + '}')
		await self.send_json(content['content'])
