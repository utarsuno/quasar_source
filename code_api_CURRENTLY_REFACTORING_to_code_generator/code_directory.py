# coding=utf-8

"""This module, code_directory.py, represents an abstraction to directories that contain code."""

from universal_code import useful_file_operations as ufo
from code_api import code_file as cf
from code_api.code_generator import shell_scripts_generator


class CodeDirectory(object):
	"""Represents a unique directory."""

	def __init__(self, path):
		self._path = path
		self._exists = ufo.is_directory(self._path)
		self._child_code_directories = []
		self._code_files             = []

	def get_all_sub_directories_recursively(self):
		"""Recursively gets all the sub directories to this directory."""
		all_directories = []
		for d in self._child_code_directories:
			all_directories.append(d)
			sub_directories = d.get_all_sub_directories_recursively()
			for sd in sub_directories:
				all_directories.append(sd)
		return all_directories

	def _generate_all_code_files(self):
		"""Generates all code files for this CodeDirectory."""
		for c_f in self._code_files:
			c_f.generate()

	def _generate_directory_if_needed(self):
		"""Creates this directory if it does not exist."""
		if not ufo.is_directory(self._path):
			ufo.create_directory(self._path)

	def generate(self):
		"""Generates this directory and any needed code files."""
		self._generate_directory_if_needed()
		self._generate_all_code_files()
		all_sub_directories = self.get_all_sub_directories_recursively()
		for d in all_sub_directories:
			d._generate_directory_if_needed()
			d._generate_all_code_files()

	def add_sub_directory(self, directory_name):
		"""Adds a child code directory to this code directory."""
		code_directory = CodeDirectory(self._path + '/' + directory_name)
		self._child_code_directories.append(code_directory)
		return code_directory

	def add_code_file(self, code_file_name):
		"""Adds a code file name to expect in this directory."""
		code_file = None
		if code_file_name.endswith('.sh'):
			code_file = shell_scripts_generator.CodeFileShellScript(self._path + '/' + code_file_name, False)
		self._code_files.append(code_file)
		return code_file

	@property
	def path(self) -> str:
		"""Returns the path of this code directory."""
		return self._path
