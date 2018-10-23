# coding=utf-8

"""This module, flags.py, provides an OOP abstraction to flags."""

class Flags:
	"""Provides an API to using flags."""

	def __init__(self):
		self._flags = {}

	def flag_set(self, key: str, value) -> None:
		"""Sets the flag's value."""
		self._flags[key] = value

	def flag_does_exist(self, key: str) -> bool:
		"""Returns a boolean indicating if the provided key exists as a flag."""
		return key in self._flags

	def flag_add_value(self, key:str, value) -> None:
		"""Adds a value to a flag whose value is treated as a list."""
		if key not in self._flags:
			self._flags[key] = []
		self._flags[key].append(value)

	def flag_get(self, key: str):
		"""Returns the flag's value."""
		return self._flags[key]

