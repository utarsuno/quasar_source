# coding=utf-8

"""This module, math_classes.py, defines Math concept abstractions."""

import math


class Vector(object):
	"""Represents a n-dimensional vector.
		A vector is a quantity that has both a magnitude and direction."""

	def __init__(self, *args):
		self.elements = []
		for value in args:
			self.elements.append(value)
		self.dimensions = len(args)

	# ------------------------------------------------------------------------
	def __abs__(self):
		sums = 0
		for e in self.elements:
			sums += e ** 2
		return math.sqrt(sums)

	def magnitude(self):
		"""Returns the magnitude of this Vector. Also known as the length of the vector."""
		return abs(self)

	def length(self):
		"""Returns the length of this Vector. Also known as the magnitude of the vector."""
		return abs(self)
	# ------------------------------------------------------------------------

	def __repr__(self):
		elements = ''
		for e in self.elements:
			elements += str(e) + ', '
		elements = elements[:-2]
		return 'Vector(' + elements + ')'
