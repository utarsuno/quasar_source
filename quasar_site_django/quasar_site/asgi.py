import channels 
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "quasar_site.settings")
channel_layer = channels.asgi.get_channel_layer()



#os.environ.setdefault("DJANGO_SETTINGS_MODULE", "quasar_site.settings")