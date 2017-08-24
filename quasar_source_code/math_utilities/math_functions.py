# coding=utf-8

"""This module, math_functions.py, defines universal math functions to use."""

from quasar_source_code.math_utilities import math_classes as mc
import math

a = mc.Point2D(0, 0)
b = mc.Point2D(.5, 1)
aa = mc.Vector(0, 0)
bb = mc.Vector(.5, 1)



def slope(p0: mc.Point2D, p1: mc.Point2D):
	"""Returns the slope between the two points."""
	return (p1.y - p0.y) / (p1.x - p0.x)


def distance(p0: mc.Point2D, p1: mc.Point2D):
	"""Returns the distance between p0 and p1."""
	return math.sqrt((p1.x - p0.x) ** 2 + (p1.y - p0.y) ** 2)


print(slope(a, b))
print(distance(a, b))
print(aa)
print(bb)
