"""quasar_site URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""

from django.conf.urls import url

#from quasar_web_server import views as v
#from quasar_source_code.quasar_site_django.quasar_web_server import views as v

# Ignore the IDE error marking.
#from quasar_site_django.quasar_web_server import views as v
from quasar_web_server import views as v


urlpatterns = [
    url(r'log_formulas', v.GET_log_formulas),
    #url(r'quick_info', v.GET_quick_info),
    url(r'math220', v.GET_math_220),
    url(r'math310', v.GET_math_310),
    url(r'cs361', v.GET_cs_361),
    url(r'cs425', v.GET_cs_425),
    url(r'web_socket', v.GET_web_socket),
    url(r'', v.GET_hello_world),
]
