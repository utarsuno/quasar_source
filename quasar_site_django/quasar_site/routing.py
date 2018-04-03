# coding=utf-8

"""Documentation TODO :"""

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

from quasar_site_django.quasar_web_server import routing

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter(
            routing.websocket_url_patterns
        )
    ),
})

