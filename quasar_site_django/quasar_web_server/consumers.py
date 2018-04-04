# coding=utf-8

"""This module, consumers.py, is used to handle basic connections between the client and server."""

from channels.generic.websocket import AsyncWebsocketConsumer
#from channels import Group
from asgiref.sync import async_to_sync
import json
import uuid

from quasar_site_django.quasar_web_server.web_sockets_server.quasar_web_socket_server import QuasarWebSocketsServerSide


# TODO : Move this
#server = QuasarPlayerServer()

WEB_SOCKET_MESSAGE_TYPE_CONNECTION                  = '|C|'
WEB_SOCKET_MESSAGE_TYPE_DISCONNECTED                = '|D|'
WEB_SOCKET_MESSAGE_TYPE_CHAT_MESSAGE                = '|M|'
WEB_SOCKET_MESSAGE_TYPE_LOOK_AT_UPDATE              = '|L|'
WEB_SOCKET_MESSAGE_TYPE_POSITION_UPDATE             = '|P|'
WEB_SOCKET_MESSAGE_TYPE_POSITION_AND_LOOK_AT_UPDATE = '|U|'

'''
@channel_session
def ws_connect(message):
	print('Web socket connection!')
	print(message)
	print(dict(message))

	# Accept connection.
	message.reply_channel.send({'accept': True})

	#global server
	#server.add_web_socket_connection(message.reply_channel)

	#Group('users').add(message.reply_channel)


@channel_session
def ws_message(message):
	print('JUST GOT THE MESSAGE : ' + str(message.content['text']))
	print(message)
	print(dict(message))

	#print(message)
	#print(dict(message))
	#print(message.content['text'])

	#global server

	#message_text = (message.content['text']).split('|')

	#user = message_text[0]
	#command = '|' + message_text[1] + '|'
	#data = message_text[2]

	#server.parse_message(user, command, data, message.reply_channel)


@channel_session
def ws_disconnect(message):
	print('Web socket disconnected')
	#global server
	#server.remove_web_socket_connection(message.reply_channel)
	#Group('users').discard(message.reply_channel)
'''


quasar_web_sockets_server = QuasarWebSocketsServerSide()


class ConsumerManager(AsyncWebsocketConsumer):

	def __init__(self, scope):
		super().__init__(scope)
		global quasar_web_sockets_server
		self._web_socket_server = quasar_web_sockets_server

		self.groups_for_one_to_one_communication = {}

		self._user_groups = {}

	async def connect(self):
		print('Just made a websocket connection!')
		print('Connection ID : ' + self.channel_name)
		self._web_socket_server.add_connection(self.channel_name)

		self.channel_layer.group_add(
			self.channel_name,
			self.channel_name
		)

		await self.accept()

	async def disconnect(self, close_code):
		print('websocket disconnect!')
		print('Connection ID : ' + self.channel_name)
		self._web_socket_server.remove_connection(self.channel_name)

	async def receive(self, text_data):
		print('GOT THIS MESSAGE')
		print(text_data)
		print()

		#async_to_sync(self.channel_layer.group_send)(
		#)

		#self.channel_layer.group_send(
		#	self.channel_name,
		#	self._web_socket_server.get_reply(self.channel_name, text_data)
		#)

		self.channel_layer.send(self.channel_name, {
			'type': 'single.reply',
			'text': text_data
		})

		'''
		self.channel_layer.group_send(
			self.channel_name,
			{
				'type': 'single.reply',
				'text': text_data
			}
		)
		'''

		#self.send({
		#	'type' : 'websocket.send',
		#	'text' : self._web_socket_server.get_reply(self.channel_name, text_data)
		#})
		#self.send(text_data=self._web_socket_server.get_reply(self.channel_name, text_data))

	async def single_reply(self, message):
		"""Test."""
		#m = message['message']
		print('Trying to send a single reply!')
		self.send(text_data=self._web_socket_server.get_reply(self.channel_name, message))
