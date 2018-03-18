# coding=utf-8

"""This module, c_library.py, is an abstraction to a custom made C library."""

from subprocess import Popen, PIPE
from universal_code.shell_abstraction.shell_command_runner import run_shell_command_and_get_results
from c_processes.c_compiler import create_object_file


class CLibrary(object):
	"""Represents a collection of c files that create a single executable."""

	def __init__(self, c_source_file, output_directory):
		self._c_source_file    = c_source_file
		self._output_directory = output_directory
		self._object_file_path = self._output_directory + self._c_source_file.raw_file_name + '.o'

	def compile_library(self):
		"""Compiles the library given the input source code directory and the output directory."""
		return create_object_file(self._c_source_file.full_file_path, self._object_file_path)

	@property
	def path_to_object_file(self) -> str:
		"""Returns the path of this libraries object file."""
		return self._object_file_path