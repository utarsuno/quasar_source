# coding=utf-8

"""This module, modules.py, defines Django database object models."""

from django.db import models
from django.utils import timezone

'''
class Message(models.Model):
    handle    = models.TextField()
    message   = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
'''


class Message(models.Model):
	ip = models.TextField()
	message = models.TextField()
