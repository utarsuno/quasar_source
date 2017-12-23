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


a = Vector(-40, -20, -150)
b = Vector(-40, -20, 40)
c = Vector(80, -20, 150)


line_a = a - b
line_b = b - c
print(line_a)
print(line_b)

print(line_a.cross(line_b))




