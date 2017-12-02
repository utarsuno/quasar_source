# coding=utf-8

"""This module, local_testing.py, defines universal math functions to use."""

from quasar_source_code.math_utilities.math_classes import Vector
import math

camera_direction = Vector(3, 3, 3)
camera_direction.normalize()
print('Camera direction : ' + str(camera_direction))

ground_normal = Vector(0, 1, 0)
print('Ground normal : ' + str(ground_normal))


print(camera_direction.project_onto_plane(ground_normal))



