# coding=utf-8

"""This module, math_classes.py, defines Math concept abstractions."""

import math
from fractions import Fraction


class Vector(object):
	"""Represents a n-dimensional vector.
		A vector is a quantity that has both a magnitude and direction."""

	def __init__(self, *args):
		self.elements = []
		if (type(args) == list or type(args) == tuple) and len(args) == 1:
			for value in args[0]:
				self.elements.append(value)
		else:
			for value in args:
				self.elements.append(value)
		self.dimensions = len(args)

	@property
	def normalized(self):
		"""Returns a new Vector object that has the normalized values of this Vector."""
		elements = []
		magnitude = self.magnitude
		for e in self.elements:
			elements.append(e / magnitude)
		return Vector(elements)

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
		self.ensure_dimensionality(other, 2)
		return (other.elements[1] - self.elements[1]) / (other.elements[0] - self.elements[0])

	# TODO : expand this later to do more than just scalar multiplication
	def __mul__(self, other):
		elements = []
		for e in self.elements:
			elements.append(e * other)
		return Vector(elements)

	# ------------------------------------------------------------------------
	def dot(self, other):
		"""Returns a Vector representing the dot product between this vector and the vector provided."""
		elements = []
		for i, e in enumerate(self.elements):
			elements.append(e * other.elements[i])
		return Vector(elements)

	# ------------------------------------------------------------------------
	def __abs__(self):
		sums = 0
		for e in self.elements:
			sums += e ** 2
		return math.sqrt(sums)

	@property
	def magnitude(self):
		"""Returns the magnitude of this Vector. Also known as the length of the vector."""
		return abs(self)

	@property
	def length(self):
		"""Returns the length of this Vector. Also known as the magnitude of the vector."""
		return abs(self)
	# ------------------------------------------------------------------------

	def __sub__(self, other):
		"""Returns a Vector object that is this vector subtracted with the provided vector."""
		self.ensure_dimensionality(other)
		elements = []
		for i, e in enumerate(self.elements):
			elements.append(e - other.elements[i])
		return Vector(elements)

	def __add__(self, other):
		"""Returns a Vector object that is this vector added with the provided vector."""
		self.ensure_dimensionality(other)
		elements = []
		for i, e in enumerate(self.elements):
			elements.append(e + other.elements[i])
		return Vector(elements)

	def __repr__(self):
		elements = ''
		for e in self.elements:
			elements += str(e) + ', '
		elements = elements[:-2]
		return 'Vector(' + elements + ')'

	# ------------------------------------------------------------------------
	def ensure_dimensionality(self, other, number_of_dimensions=None):
		"""Raises an exception if this vector and the provided vector do not have the same number of dimensions."""
		if self.dimensions != other.dimensions:
			raise RuntimeError('Both vectors must have the same number of dimensions!')
		if number_of_dimensions is not None:
			if self.dimensions != number_of_dimensions or other.dimensions != number_of_dimensions:
				raise RuntimeError('Both vectors must be ' + str(number_of_dimensions) + ' dimensions!')
