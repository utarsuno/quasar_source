# coding=utf-8

"""This module, c_project.py, represents a collection of C files that all together form a single executable."""

from c_processes.c_compiler import create_executable


# TODO : EVENTUALLY EXPAND FROM JUST A SINGLE C SOURCE FILE
class CProject(object):
	"""Represents a single C project that forms a single executable."""

	def __init__(self, c_source_file, libraries_needed, output_directory):
		self._libraries_needed = libraries_needed
		self._c_source_file = c_source_file
		self._output_directory = output_directory
		self._exectuable_file_path = self._output_directory + self._c_source_file.raw_file_name

	def build_project(self):
		"""Compiles this project."""
		return create_executable(self._c_source_file.full_file_path, self._libraries_needed, self._exectuable_file_path)

	@property
	def exectuable_file_path(self) -> str:
		"""Returns a string representation of the executable file made from this project."""
		return self._exectuable_file_path