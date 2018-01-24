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

# UNIVERSAL_CONSTANTS_START : POST URLs for client-server communication.
POST_URL_DELETE_ENTITY         = r'delete_entity'
POST_URL_SAVE_ENTITY           = r'save_entity'
POST_URL_GET_USER_ENTITIES     = r'get_user_entities'
POST_URL_CREATE_ACCOUNT        = r'create_account'
POST_URL_LOGIN                 = r'login'
POST_URL_GET_DATABASE_DATA     = r'get_database_data'
POST_URL_GET_SERVER_LOGS       = r'get_server_logs'
POST_URL_SUDO_COMMAND          = r'sudo_command'
# UNIVERSAL_CONSTANTS_END

urlpatterns = [
    url(r'web_socket', v.GET_web_socket),

    url(POST_URL_CREATE_ACCOUNT       , v.POST_create_owner),
    url(POST_URL_LOGIN                , v.POST_login),
    url(POST_URL_GET_USER_ENTITIES    , v.POST_get_user_entities),
    url(POST_URL_SAVE_ENTITY          , v.POST_save_entity),
    url(POST_URL_DELETE_ENTITY        , v.POST_delete_entity),
    url(POST_URL_SUDO_COMMAND         , v.POST_sudo_command),

    url(r'dev', v.GET_quasar_dev),
    url(r'qa' , v.GET_quasar_qa),
    url(r''   , v.GET_quasar_prod),
]
