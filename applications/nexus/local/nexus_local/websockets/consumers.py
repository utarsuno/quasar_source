# coding=utf-8

"""This module, consumers.py, handles web-socket requests."""

# chat/consumers.py
#from channels.generic.websocket import WebsocketConsumer
#from channels.generic.websocket import AsyncJsonWebsocketConsumer
from libraries.servers.web_sockets.web_socket_consumer_abstraction import WebSocketConsumerAbstract
from libraries.universal_code.system_abstraction import shell_command_runner as bash
import sys


class WebsocketServer(object):
    """Represents server logic for websocket channels."""

    def __init__(self, debug_mode):
        self._debug_mode = debug_mode
        self._clients    = {}

    def connection_add(self, channel_name):
        """Adds a connection."""
        self._clients[channel_name] = None

    def connection_remove(self, channel_name):
        """Remove a connection."""
        del self._clients[channel_name]


class NexusWebsocketConsumer(WebSocketConsumerAbstract):
    """Handles sending and receiving of web socket messages."""

    _WEB_SOCKET_TYPE_MESSAGE_CHAT = 'm0'
    _WEB_SOCKET_TYPE_REQUEST_CMD  = 'm1'

    def __init__(self, scope):
        super().__init__(scope)
        self._debug_mode = True

        self._response_mapping = {NexusWebsocketConsumer._WEB_SOCKET_TYPE_REQUEST_CMD: self._get_response_cmd,
                                  NexusWebsocketConsumer._WEB_SOCKET_TYPE_MESSAGE_CHAT: self._get_response_chat}

    def _get_response_chat(self, request):
        """Provides a dictionary respond for a chat request."""
        return self._get_response_dict(request, '...')

    def _get_response_cmd(self, request):
        """Provides a dictionary response for a CMD request."""
        cmd = request[NexusWebsocketConsumer._WEB_SOCKET_KEY_DATA].strip().split()

        run_command = bash.BashCommandRunner(cmd, require_input=False)

        result, output = run_command.run()

        return self._get_response_dict(request, output)

    def _get_response_dict(self, request, data):
        """Provides a dictionary response for a request."""
        response = {NexusWebsocketConsumer._WEB_SOCKET_KEY_ID: request[NexusWebsocketConsumer._WEB_SOCKET_KEY_ID],
                    NexusWebsocketConsumer._WEB_SOCKET_KEY_SUCCESS: NexusWebsocketConsumer._WEB_SOCKET_RESPONSE_VALUE_SUCCESS_TRUE,
                    NexusWebsocketConsumer._WEB_SOCKET_KEY_DATA: data}
        return response

    async def on_message_received(self, json_message, channel):
        """Handles incoming messages."""
        #self.print_logging('ON MESSAGE RECEIVED!!!!!!!!!!')
        #print(str(json_message))
        #print(type(json_message))
        #sys.stdout.flush()

        message_type = json_message[WebSocketConsumerAbstract._WEB_SOCKET_KEY_TYPE]

        if message_type in self._response_mapping:
            await self.send_message_to_individual(self._response_mapping[message_type](json_message), channel)


