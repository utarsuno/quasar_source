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
from quasar_source_code.quasar_site_django.quasar_web_server import views as v


urlpatterns = [
    url(r'log_formulas', v.GET_log_formulas),
    url(r'web_socket', v.GET_web_socket),

    url(r'create_account'           , v.POST_create_owner),
    url(r'login'                    , v.POST_login),
    url(r'get_all_public_entities'  , v.POST_load_all_public_entities),
    url(r'get_all_entities_for_user', v.POST_load_all_entities_for_user),
    url(r'save_entity'              , v.POST_save_entity),
    url(r'delete_entity'            , v.POST_delete_entity),

    url(r'dev', v.GET_quasar_dev),
    url(r'qa', v.GET_quasar_qa),
    url(r'', v.GET_quasar_prod),
]
