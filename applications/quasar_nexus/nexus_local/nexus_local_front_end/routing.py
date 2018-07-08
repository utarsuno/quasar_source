# coding=utf-8

"""Documentation TODO :"""

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
