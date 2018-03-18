# coding=utf-8

"""This module, c_library.py, is an abstraction to a custom made C library."""

from subprocess import Popen, PIPE
from universal_code import terminal_api


class CLibrary(object):
	"""Represents a collection of c files that create a single executable."""

	def __init__(self, c_source_file, output_directory):
		self._c_source_file    = c_source_file
		self._output_directory = output_directory

	def compile_library(self):
		"""Compiles the library given the input source code directory and the output directory."""
		self.c_process = Popen('gcc -c ' + self._c_source_file.full_file_path + ' -o ' + self._output_directory + self._c_source_file.raw_file_name + '.o', shell=True, stdin=PIPE, stdout=PIPE, stderr=PIPE)
		self.c_process.wait()
		self.output_stdout, self.output_stderr = self.c_process.communicate()
