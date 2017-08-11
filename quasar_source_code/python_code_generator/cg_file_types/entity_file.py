# coding=utf-8

"""This module, entity_file.py, defines the common attributes of *.script, *.library, and *.project files."""

# Contains useful debugging functionality.
from quasar_source_code.universal_code import debugging as dbg


class EntityFile(object):
	"""Defines common features amongst quasar source files."""

	def __init__(self, file_name):
		self._file_name = None
		self.file_name  = file_name

	@property
	def file_name(self) -> str:
		"""Returns the name of this file, not the full path."""
		return self._file_name

	@file_name.setter
	def file_name(self, val):
		"""Sets the name of this file."""
		if type(val) == str:
			self._file_name = val
		else:
			dbg.raise_type_exception('file_name.setter', str, val)
