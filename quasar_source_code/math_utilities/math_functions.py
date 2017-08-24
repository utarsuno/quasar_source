# coding=utf-8

"""This module, math_functions.py, defines universal math functions to use."""

from quasar_source_code.math_utilities import math_classes as mc
import math

a = mc.Vector(0, 0)
b = mc.Vector(.5, 1)

print(a.unit_vector_to(b))

