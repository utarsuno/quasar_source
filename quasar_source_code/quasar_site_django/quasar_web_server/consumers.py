# coding=utf-8

"""This module, consumers.py, is used to handle basic connections between the client and server."""

from channels import Group
from channels.sessions import channel_session


@channel_session
def ws_connect(message):
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






