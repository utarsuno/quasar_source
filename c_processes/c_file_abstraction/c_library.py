# coding=utf-8

"""This module, c_library.py, is an abstraction to a custom made C library."""


from universal_code import terminal_api


class CLibrary(object):
	"""Represents a collection of c files that create a single executable."""

	def __init__(self, c_source_file, output_directory):
		self._c_source_file    = c_source_file
		self._output_directory = output_directory

	def compile_library(self, output_directory):
		"""Compiles the library given the input source code directory and the output directory."""
		print('Compile file test!')
		print(terminal_api.run_terminal_command(['gcc', '-c', self._c_source_file.full_file_path, '-o', output_directory + self._c_source_file.raw_file_name]))

