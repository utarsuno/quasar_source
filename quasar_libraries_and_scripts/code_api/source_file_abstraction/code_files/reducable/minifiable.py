# coding=utf-8

"""This module, minifiable.py, provides an abstraction for CodeFile's that can get minified."""


from code_api.source_file_abstraction.code_files.reducable.redusable_file import Redusable
from universal_code import useful_file_operations as ufo


class Minifiable(Redusable):
	"""Abstraction for files that can be minified."""

	def __init__(self):
		super().__init__()
		self._minification_function = None
		self._save_path				= None

	def generate_minified_file(self):
		"""Generates the minified file."""
		raw_text = self.contents_as_string
		self._compressed_text = self._minification_function(raw_text)
		self._compressed_file_extension = '.min' + self.file_extension
		self._save_path = self.full_path.replace(self.file_extension, '.min' + self.file_extension)
		ufo.create_file_or_override(self._compressed_text, self._save_path)
		self._compressed_file_size = ufo.get_file_size_in_bytes(self._save_path)

		if self._temporary_design:
			ufo.copy_file_to_path(self._save_path, self._save_path.replace('/configuration_files/', '/quasar_site_django/'))

	def set_minification_function(self, minification_function):
		"""Sets the minifcation algorithm to be used on this CodeFile's text."""
		self._minification_function = minification_function
