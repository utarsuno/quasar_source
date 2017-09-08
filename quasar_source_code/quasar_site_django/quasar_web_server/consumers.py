# coding=utf-8

"""This module, consumers.py, is used to handle basic connections between the client and server."""

from channels import Group


def ws_connect(message):
	Group('users').add(message.reply_channel)


def ws_message(message):
	print('JUST GOT THE MESSAGE : ' + str(message))


def ws_disconnect(message):
	Group('users').discard(message.reply_channel)






