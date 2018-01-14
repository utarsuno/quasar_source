# coding=utf-8

"""This module, local_testing.py, defines universal math functions to use."""

from z_code_archive.math_utilities.math_classes import Vector
import math

'''
camera_direction = Vector(3, 3, 3)
camera_direction.normalize()
print('Camera direction : ' + str(camera_direction))

ground_normal = Vector(0, 1, 0)
print('Ground normal : ' + str(ground_normal))


print(camera_direction.project_onto_plane(ground_normal))
'''


a = Vector(20, 300, 40)


c = Vector(a.elements[0], 0, a.elements[2])
c = c.normalized


a = a.normalized


b = Vector(0, 1, 0)

print(a.cross(b).normalized)
print(b.cross(a).normalized)

print()

print(c.cross(b).normalized)
print(b.cross(c).normalized)

print()

print(c)

