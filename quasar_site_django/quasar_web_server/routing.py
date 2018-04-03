# coding=utf-8

"""Documentation TODO :"""

#from channels.routing import route
from django.conf.urls import url

from quasar_site_django.quasar_web_server import consumers

#channel_routing = [
#	route('websocket.connect', ws_connect),
#	route('websocket.receive', ws_message),
#	route('websocket.disconnect', ws_disconnect),
#]

websocket_url_patterns = [
	url(r'^ws/$', consumers.ConsumerManager)
]
