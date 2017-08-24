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

	def unit_vector_to(self, other):
		"""Returns a unit vector pointing from this point to the point provided."""
		distance = self.distance(other)
		elements = []
		for i, e in enumerate(self.elements):
			elements.append((other.elements[i] - e) / distance)
		return Vector(elements)

	def distance(self, other):
		"""Returns the distance from this vector to the provided vector."""
		self.ensure_dimensionality(other)
		local_sum = 0
		for i, e in enumerate(self.elements):
			local_sum += (other.elements[i] - e) ** 2
		return math.sqrt(local_sum)

	def slope(self, other):
		"""Returns the slope between two 2D points."""
		if self.dimensions != 2 or other.dimensions != 2:
			raise RuntimeError('Slope must be calculated from 2 dimensional vectors.')
		return (other.elements[1] - self.elements[1]) / (other.elements[0] - self.elements[0])

	# TODO : expand this later to do more than just scalar multiplication
	def __mul__(self, other):
		elements = []
		for e in self.elements:
			elements.append(e * other)
		return Vector(elements)

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

	# ------------------------------------------------------------------------
	def ensure_dimensionality(self, other):
		"""Raises an exception if this vector and the provided vector do not have the same number of dimensions."""
		if self.dimensions != other.dimensions:
			raise RuntimeError('Both vectors must have the same number of dimensions!')
