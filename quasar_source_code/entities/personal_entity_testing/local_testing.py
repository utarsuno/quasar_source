# coding=utf-8

"""temp local testing"""

from quasar_source_code.entities.personal_entity_testing import math220 as m
from quasar_source_code.entities.entity_manager import EntityManager
from quasar_source_code.entities.database.entity_database import EntityDatabaseAPI
from quasar_source_code.entities import base_entity as be
from quasar_source_code.entities.properties import entity_task as etask
from quasar_source_code.entities.properties import entity_time as etime
from quasar_source_code.universal_code import time_abstraction as ta

#

manager = EntityManager(manager_id=1)
entity_db = EntityDatabaseAPI()
# Load the manager.

manager = entity_db.get_entity_manager(manager.manager_id)

print('Printing Manager info :')
#print(manager)
#manager.print_all_entities()
#manager.print_information_for_this_week()

# INFORMATION TO GET SAVED.

# Info set 0.
#'''
#manager.add_entities(m.math220)
#'''

# Info set 1.
'''
daily_todos = be.Entity('Daily todos :')
daily_meditation = etask.EntityTask('Daily 10 minute meditation', daily_todos)
daily_meditation.description = 'Meditate for 10 minutes.'
daily_meditation.set_due_date_and_description(ta.Day.EVERYDAY, description='Meditate for 10 minutes.')
manager.add_entities(daily_todos)
'''

# ---------------------------------------------------------------

'''
some_todos = be.Entity('Daily todos :')
tasks = etask.EntityTask('361 hw', some_todos)
tasks.description = 'Actual: Start 361 homework!'
tasks.set_due_date_and_description(ta.get_specific_day(year=2017, month='sep', day=30), description='Start 361 homework!')

tasks = etask.EntityTask('361 hw', some_todos)
tasks.description = 'Actual: Finish 361 homework!'
tasks.set_due_date_and_description(ta.get_specific_day(year=2017, month='oct', day=1), description='Finish 361 homework!')
manager.add_entities(some_todos)
'''

#'''
global_todos = be.Entity('Global todos')
global_tasks = etask.EntityTask('global task 1', global_todos)
global_tasks.set_due_date_and_description(ta.get_specific_day(year=2017, month='sep', day=29), description='Say hello hello')

#manager.add_entities(global_todos)
#'''

print('Printing Manager info :')
#print(manager)
#manager.print_all_entities()
print()
manager.print_information_for_this_week()

# Now save any changes if we want to.

#entity_db.save_entity_manager(manager)
