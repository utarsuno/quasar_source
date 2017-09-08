# coding=utf-8

"""Documentation TODO :"""

from channels.routing import route
from quasar_web_server.routing import ws_connect, ws_disconnect

channel_routing = [
	route('websocket.connect', ws_connect),
	route('websocket.disconnect', ws_disconnect),
]
