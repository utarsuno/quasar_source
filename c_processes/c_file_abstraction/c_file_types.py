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

	def __init__(self, source_file, file_type):
		self._source_file = source_file
		self._file_name   = ufo.get_file_basename(self._source_file)
		self._type        = file_type

	@property
	def full_file_path(self) -> str:
		"""Returns the full file path of this C code file."""
		return self._source_file

	@property
	def file_name(self) -> str:
		"""Returns the file name of this C code file."""
		return self._file_name

	def compile_file(self, input_directory, output_directory):
		"""Compiles this file."""
		print('Compile file test!')
		print(terminal_api.run_terminal_command(['gcc', input_directory + self._file_name]))


class CSourceCodeFile(CFile):
	"""Represents a single C source code file."""
	def __init__(self, file_name):
		super().__init__(file_name, CFile.C_FILE_TYPE_SOURCE_CODE)


class CHeaderFile(CFile):
	"""Represents a single C header file."""
	def __init__(self, file_name):
		super().__init__(file_name, CFile.C_FILE_TYPE_HEADER)

