# coding=utf-8

"""This module, c_code_generator.py, generates c code files."""

from universal_code import useful_file_operations as ufo


class CFile(object):
	"""A single instance maps to a unique c file."""

	def __init__(self, file_name):
		self._file_name = file_name
		self._file_text = []

	def get_file_text_as_single_string(self) -> str:
		"""Returns the contents of this C file as a single string."""
		file_text = ''
		for ft in self._file_text:
			file_text += ft
		return file_text

	def create(self, directory=None):
		"""Creates this file in the current or provided directory."""
		if directory is not None:
			ufo.create_file_or_override(file_path=directory + self._file_name, file_text=self.get_file_text_as_single_string())
		else:
			ufo.create_file_or_override(file_path=self._file_name, file_text=self.get_file_text_as_single_string())

