# coding=utf-8

"""This module, consumers.py, is used to handle basic connections between the client and server."""

from channels import Group
from channels.sessions import channel_session


import threading


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


server = QuasarServer()
server.run_server()

WEB_SOCKET_MESSAGE_TYPE_CHAT_MESSAGE                = '|M|'
WEB_SOCKET_MESSAGE_TYPE_LOOK_AT_UPDATE              = '|L|'
WEB_SOCKET_MESSAGE_TYPE_POSITION_UPDATE             = '|P|'
WEB_SOCKET_MESSAGE_TYPE_POSITION_AND_LOOK_AT_UPDATE = '|U|'


@channel_session
def ws_connect(message):

	# Accept connection.
	message.reply_channel.send({'accept': True})

	server.user_joined()

	print('USER JOINED!')
	print(message.reply_channel)
	print(message)

	Group('users').add(message.reply_channel)


@channel_session
def ws_message(message):
	#print('JUST GOT THE MESSAGE : ' + str(message.content['text']))

	global server


	message = (message.content['text']).split('|')
	# TODO : Get the username here!!!!
	user = message[0]
	command = message[1]
	data = message[2]

	# message.content['text']





	Group('users').send({
		"text": str(user) + '|' + str(command) + '|' + str(data),
	})


@channel_session
def ws_disconnect(message):


	print('User just left!' + str(message))
	server.user_left()

	Group('users').discard(message.reply_channel)



