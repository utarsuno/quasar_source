# coding=utf-8

"""This module, urls.py, will define URL entry points for back-end and front-end."""

from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'hello_world', views.TEMPLATE_HELLO_WORLD, name='hello_world'),
]
