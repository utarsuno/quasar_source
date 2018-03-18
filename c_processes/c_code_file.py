# coding=utf-8

"""This module, c_code_file.py, represents a single c source code file."""


class CCodeFile(object):
	"""Represents a single C code file."""
	def __init__(self, file_name):
		self._file_name = file_name

	@property
	def file_name(self) -> str:
		"""Returns the file name of this C code file."""
		return self._file_name


