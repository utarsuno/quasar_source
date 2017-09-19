# coding=utf-8

"""Temporary file"""
import math

full_circle = 2.0 * math.pi
step_size = full_circle / 7.0
current_angle = 0.0

points = []

s = 0
while current_angle <= 2.0 * math.pi:
	points.append([math.cos(current_angle), math.sin(current_angle)])
	current_angle += step_size
	s += 1

points = points[:-1]
for p in points:
	print(p)
