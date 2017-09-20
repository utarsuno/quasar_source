# coding=utf-8

"""temp local testing"""

from quasar_source_code.entities.personal_entity_testing import math220 as m
from quasar_source_code.entities.entity_manager import EntityManager
from quasar_source_code.entities.database.entity_database import EntityDatabaseAPI


# New
manager = EntityManager()

entity_db = EntityDatabaseAPI()
manager.add_entities(m.math220)

print(manager)

#manager.load_entities_from_database()

#manager.print_information_for_this_week()


entity_db.save_entity_manager(manager)

manager = entity_db.get_entity_manager(manager.manager_id)

print(manager)

#manager.print_entities()
