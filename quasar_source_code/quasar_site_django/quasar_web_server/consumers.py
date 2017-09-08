# coding=utf-8

"""This module, consumers.py, is used to handle basic connections between the client and server."""

from channels import Group
from channels.sessions import channel_session


import threading


class QuasarServer(object):
	"""Temporary test server code."""

	def __init__(self):
		self._users = []

	def run_server(self):
		# Message positions of all players to all players.
		print('Pinging players!')
		Group('users').send({
			"text": 'Pinging the players!',
		})
		threading.Timer(5, self.run_server).start()


server = QuasarServer()
server.run_server()


@channel_session
def ws_connect(message):

	# Accept connection.
	message.reply_channel.send({'accept': True})

	print(message.reply_channel)
	print(message)

	Group('users').add(message.reply_channel)


@channel_session
def ws_message(message):
	print('JUST GOT THE MESSAGE : ' + str(message))
	Group('users').send({
		"text": "[user] %s" % message.content['text'],
	})


@channel_session
def ws_disconnect(message):
	Group('users').discard(message.reply_channel)







