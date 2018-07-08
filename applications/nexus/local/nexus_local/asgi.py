# coding=utf-8

"""TODO : Document this module."""

import channels
import os

import django
from channels.routing import get_default_application


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nexus_local.settings")
#channel_layer = channels.asgi.get_channel_layer()

django.setup()
application = get_default_application()



#import os
#import django
#from channels.routing import get_default_application
#os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
#django.setup()
#application = get_default_application()
