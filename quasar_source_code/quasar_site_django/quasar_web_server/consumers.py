# coding=utf-8

"""This module, consumers.py, is used to handle basic connections between the client and server."""

from channels import Group
from channels.sessions import channel_session
import threading
from quasar_source_code.quasar_site_django.quasar_web_server.virtual_world.quasar_player_server import QuasarPlayerServer


class QuasarServer(object):
	"""Temporary test server code."""

	def __init__(self):
		self._users = []
		self._number_of_connected_users = 0

	def user_joined(self):
		self._number_of_connected_users += 1

	def user_left(self):
		self._number_of_connected_users -= 1

	def run_server(self):
		# Message positions of all players to all players.
		if self._number_of_connected_users > 0:
			y = 2
			#print('Pinging players!')
			#Group('users').send({
			#	"text": 'Pinging the players!',
			#})
		threading.Timer(.5, self.run_server).start()


server = QuasarPlayerServer()

WEB_SOCKET_MESSAGE_TYPE_CONNECTION                  = '|C|'
WEB_SOCKET_MESSAGE_TYPE_CHAT_MESSAGE                = '|M|'
WEB_SOCKET_MESSAGE_TYPE_LOOK_AT_UPDATE              = '|L|'
WEB_SOCKET_MESSAGE_TYPE_POSITION_UPDATE             = '|P|'
WEB_SOCKET_MESSAGE_TYPE_POSITION_AND_LOOK_AT_UPDATE = '|U|'


@channel_session
def ws_connect(message):
	print('Web socket connection!')

	# Accept connection.
	message.reply_channel.send({'accept': True})

	global server
	server.add_web_socket_connection(message.reply_channel)

	Group('users').add(message.reply_channel)


@channel_session
def ws_message(message):
	#print('JUST GOT THE MESSAGE : ' + str(message.content['text']))

	#print(message)
	#print(dict(message))
	#print(message.content['text'])

	global server

	message_text = (message.content['text']).split('|')

	user = message_text[0]
	command = '|' + message_text[1] + '|'
	data = message_text[2]

	if command == WEB_SOCKET_MESSAGE_TYPE_CONNECTION:
		server.player_logged_in(message.reply_channel, data)
	else:
		Group('users').send({
			'text': str(user) + str(command) + str(data),
		})


@channel_session
def ws_disconnect(message):
	print('Web socket disconnected')
	global server
	server.remove_web_socket_connection(message.reply_channel)
	Group('users').discard(message.reply_channel)


def send_message_to_all_user_in_group(message, group_name):
	"""Sends a message to all users in the specified group."""
	Group(group_name).send({'text': message})
