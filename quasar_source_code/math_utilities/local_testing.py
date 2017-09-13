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
#print(str(c.normalized))
#print(c + d)
#print(d + c)

# --------------------

x = 0.0
y = 1.0
h = 0.1
while x <= 1.1:
	dy_dx = h * (1.0 + (x * x))
	#dy_dx = h * ((1 / (x * x)) - y / x - (y * y))
	y += dy_dx
	x += h
	print(str(round(x, 3)) + ' | dy/dx:' + str(round(dy_dx, 4)) + '\ty:' + str(round(y, 4)))
	print()
