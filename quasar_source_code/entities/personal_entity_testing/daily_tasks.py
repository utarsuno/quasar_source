# coding=utf-8

"""This module, daily_tasks.py, is a temporary location for creating and testing daily Entity tasks."""

from quasar_source_code.entities import base_entity as be
from quasar_source_code.entities.properties import entity_task as etask
from quasar_source_code.entities.properties import entity_time as etime

daily_todos = be.Entity('Daily todos :')

daily_meditation = etask.EntityTask('Daily 10 minute meditation')
daily_meditation.description = 'Meditate for 10 minutes.'
daily_meditation.
