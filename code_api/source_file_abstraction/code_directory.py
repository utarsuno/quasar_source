# coding=utf-8

"""This module, code_directory.py, provides an abstraction to directories in code projects."""

from universal_code import useful_file_operations as ufo
from code_api.code_abstraction.code_chunk import CodeChunk


class CodeDirectory(object):
	"""Provides an abstraction to code directories."""

	def __init__(self, directory_path):
		self._directory_path    = directory_path
		self._child_directories = []
		self._code_files        = []

		self._parent_directory = None

		self._safety_check_on_directory_path()

	def create_directory_if_needed(self):
		"""Creates the code directory if it does not exist."""
		if not ufo.does_directory_exist(self._directory_path):
			ufo.create_directory(self._directory_path)

	def add_code_file(self, code_file):
		"""Adds a code file to this code directory."""
		self._code_files.append(code_file)
		code_file.set_parent_code_directory(self)

	def set_parent_code_directory(self, code_directory):
		"""Sets the parent code directory of this code directory."""
		self._parent_directory = code_directory

	def add_child_code_directory(self, code_directory):
		"""Adds a child code directory."""
		code_directory.set_parent_code_directory(self)
		self._child_directories.append(code_directory)

	def add_new_child_code_directory_from_current_path(self, sub_directory_name, code_directory_type=None):
		"""Adds a new child CodeDirectory stemmed from the current directory path."""
		if code_directory_type is None:
			code_directory = CodeDirectory(self._directory_path + sub_directory_name)
		else:
			code_directory = code_directory_type(self._directory_path + sub_directory_name)

		code_directory.set_parent_code_directory(self)
		self.add_child_code_directory(code_directory)
		return code_directory

	def _safety_check_on_directory_path(self):
		"""Cleans up the directory path or throws an exception if it is non-cleanable."""
		if not self._directory_path.endswith('/'):
			self._directory_path += '/'
		# TODO : Raise exceptions for certain scenarios.

	def contains_directory(self, code_directory) -> bool:
		"""Returns a boolean if this code directory contains the provided code directory."""
		for cd in self._child_directories:
			if cd == code_directory:
				return True
		return False

	@property
	def parent_directory(self):
		"""Returns the parent code directory of this code directory."""
		return self._parent_directory

	@property
	def directory_path(self) -> str:
		"""Returns the directory path of this CodeDirectory."""
		return self._directory_path


class ShellDirectory(CodeDirectory):
	"""Represents a code directory that only contains shell code files."""

	def __init__(self, directory_path):
		super().__init__(directory_path)
		self._required_shell_safety_checks = []

	def add_shell_required_safety_check(self, safety_check):
		"""Adds a required safety check for all shell scripts in this directory."""
		self._required_shell_safety_checks.append(safety_check)

	def get_code_chunk_with_all_required_safety_checks(self):
		"""Returns a code chunk that contains all the required safety checks."""
		combined_code_chunk = CodeChunk()

		for required_shell_safety_check in self._required_shell_safety_checks:
			combined_code_chunk.add_code_chunk(required_shell_safety_check.code_chunk)

		return combined_code_chunk
