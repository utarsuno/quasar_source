# coding=utf-8

"""This module, local_testing.py, defines universal math functions to use."""

from quasar_source_code.math_utilities import math_classes as mc
import math

a = mc.Vector(0, 0)
b = mc.Vector(.5, 1)

a_to_b_unit_vector = a.unit_vector_to(b)
a_to_b_distance    = a.distance(b)

#print(a_to_b_unit_vector)
#print(a_to_b_distance)
#print(a_to_b_unit_vector * (a_to_b_distance / 2))


c = mc.Vector(-7, 6)
d = mc.Vector(8, -5)
print(str(c.normalized))
print(c + d)
print(d + c)
