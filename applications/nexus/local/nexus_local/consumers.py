# coding=utf-8

"""This module, consumers.py, handles web-socket requests."""

# chat/consumers.py
from channels.generic.websocket import WebsocketConsumer
import json


class NexusWebsocketConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

        self.send(text_data=json.dumps({
            'message': {'hello': 'world'}
        }))

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        self.send(text_data=json.dumps({
            'message': message
        }))

