# coding=utf-8

"""Documentation TODO :"""

from django.conf.urls import url
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from quasar_micro_applications.quasar_nexus.nexus_local.nexus_local_front_end import routing
from quasar_micro_applications.quasar_nexus.nexus_local.nexus_local_front_end import consumers

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter(
            [
                url(r'^ws/$', consumers.ConsumerManager)
            ]
        )
    ),
})

