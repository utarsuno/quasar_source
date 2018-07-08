# coding=utf-8

"""This module, routing.py, provides channels routing."""

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from applications.nexus.local.nexus_local.websockets import consumers
from django.conf.urls import url

application = ProtocolTypeRouter({
    # Empty for now (http->django views is added by default)
	'websocket': AuthMiddlewareStack(
		URLRouter(
			[
				url(r'^ws/$', consumers.NexusWebsocketConsumer),
			]
		)
	),
})






####



'''
#from channels.routing import route
from django.conf.urls import url
from applications.quasar_nexus.nexus_local.nexus_local_front_end import consumers

#channel_routing = [
#	route('websocket.connect', ws_connect),
#	route('websocket.receive', ws_message),
#	route('websocket.disconnect', ws_disconnect),
#]

websocket_url_patterns = [
	url(r'^ws/$', consumers.ConsumerManager)
]

'''