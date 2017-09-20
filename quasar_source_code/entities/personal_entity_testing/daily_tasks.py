# coding=utf-8

"""This module, daily_tasks.py, is a temporary location for creating and testing daily Entity tasks."""

from quasar_source_code.entities import base_entity as be
from quasar_source_code.entities.properties import entity_task as etask
from quasar_source_code.entities.properties import entity_time as etime
from quasar_source_code.universal_code import time_abstraction as ta

daily_todos = be.Entity('Daily todos :')

daily_meditation = etask.EntityTask('Daily 10 minute meditation')
daily_meditation.description = 'Meditate for 10 minutes.'
daily_meditation.set_due_date_and_description(ta.Day.EVERYDAY, description='Meditate for 10 minutes.')


# SOON GOAL : have the network also transfer other player's camera direction
# SOON GOAL : create the entity database layer.

# Finish studying on Django channels.
# https://channels.readthedocs.io/en/stable/binding.html

# Add 2d chat/text capabilities. Use enter to toggle chat view and typing.

# Implement double jump activiating fly mode.

# Implement fly mode.

# Fix the current movement system.

# Future goal : add client/server interpolation of player movements.




# Need to do lots of linear algebra studying before doing the above.

