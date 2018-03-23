# coding=utf-8

"""This module, code_directory.py, provides an abstraction to directories in code projects."""

from code_api.code_abstraction.code_chunk import CodeChunk
from code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory


class ShellDirectory(CodeDirectory):
	"""Represents a code directory that only contains shell code files."""

	def __init__(self, directory_path):
		super().__init__(directory_path)
		self._required_shell_safety_checks = []
		self._required_shell_libraries     = []
		self._required_variable_setters    = []

	def add_shell_required_variable_setters(self, variable_setters):
		"""Adds a required variable setters for all shell scripts in this directory."""
		self._required_variable_setters.append(variable_setters)

	def add_shell_required_safety_check(self, safety_check):
		"""Adds a required safety check for all shell scripts in this directory."""
		self._required_shell_safety_checks.append(safety_check)

	def add_shell_required_library(self, required_library):
		"""Adds a required library for all shell scripts in this directory."""
		self._required_shell_libraries.append(required_library)

	def get_code_chunk_with_all_required_safety_checks(self):
		"""Returns a code chunk that contains all the required safety checks."""
		combined_code_chunk = CodeChunk()

		for required_shell_safety_check in self._required_shell_safety_checks:
			combined_code_chunk.add_code_chunk(required_shell_safety_check)

		return combined_code_chunk

	def get_all_required_variable_setters(self):
		"""Returns a list of all required variable setters needed for shell scripts in this directory."""
		return self._required_variable_setters

	def get_all_required_libraries(self):
		"""Returns a list of all required libraries needed for shell scripts in this directory."""
		return self._required_shell_libraries
