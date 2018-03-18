# coding=utf-8

"""This module, c_code_file.py, represents a single c source code file."""

from universal_code import terminal_api
from universal_code import useful_file_operations as ufo


class CFile(object):
	"""Represents a single C code file."""

	C_FILE_TYPE_OBJECT_FILE = '.o'
	C_FILE_TYPE_HEADER      = '.h'
	C_FILE_TYPE_SOURCE_CODE = '.c'
	C_FILE_TYPE_EXECUTABLE  = ''

	def __init__(self, source_file):
		self._source_file = source_file
		self._file_name   = ufo.get_file_basename(self._source_file)
		self._directory   = self._source_file.replace(self._file_name, '')
		file_ending = ufo.get_file_last_extension(self._source_file)
		if file_ending == '.c':
			self._file_type = CFile.C_FILE_TYPE_SOURCE_CODE
		elif file_ending == '.h':
			self._file_type = CFile.C_FILE_TYPE_HEADER
		self._raw_file_name = self._file_name.replace(file_ending, '')

	@property
	def directory(self) -> str:
		"""Returns the directory that this file resides in."""
		return self._directory

	@property
	def raw_file_name(self) -> str:
		"""Returns the raw file name of this C file."""
		return self._raw_file_name

	@property
	def full_file_path(self) -> str:
		"""Returns the full file path of this C file."""
		return self._source_file

	@property
	def file_name(self) -> str:
		"""Returns the file name of this C file."""
		return self._file_name
