# coding=utf-8

"""temp local testing"""

from quasar_source_code.entities.personal_entity_testing import math220 as m
from quasar_source_code.entities.entity_manager import EntityManager


# New
manager = EntityManager()
#manager.add_entities(m.math220)

manager.load_entities_from_database()

#manager.print_information_for_this_week()
#manager.save_entities()


manager.print_entities()
