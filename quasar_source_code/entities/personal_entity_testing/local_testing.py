# coding=utf-8

"""temp local testing"""

from quasar_source_code.entities.personal_entity_testing import math220 as m
from quasar_source_code.entities import entity as e



math220 = m.math220

manager = e.EntityManager()
manager.add_entities(math220)

manager.print_information_for_this_week()
