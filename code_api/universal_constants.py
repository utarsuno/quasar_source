# coding=utf-8

"""This module, universal_constants.py, is an abstraction to constant variables that should have the same key-values between all code including cross-language."""


class UniversalConstant(object):
	"""Represents a global key-value to sync across the entire code base."""

	def __init__(self, name, value):
		self._name  = name
		self._value = value


class UniversalConstantGroup(object):
	"""Represents a common group of UniversalConstant objects."""

	def __init__(self, key_name_start_token, description):
		self._start_token		  = key_name_start_token
		self._description         = description
		self._universal_constants = []

	def add_universal_constant(self, key, value):
		"""Adds a universal constant object to this group."""
		self._universal_constants.append(UniversalConstant(self._start_token + key, value))
