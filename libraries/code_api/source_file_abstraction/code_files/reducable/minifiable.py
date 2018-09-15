# coding=utf-8

"""This module, minifiable.py, provides an abstraction for CodeFile's that can get minified."""


from libraries.code_api.source_file_abstraction.code_files.reducable.redusable_file import Redusable
from libraries.universal_code import useful_file_operations as ufo


class Minifiable(Redusable):
	"""Abstraction for files that can be minified."""

	def __init__(self):
		super().__init__()
		self._minification_function = None
		self._save_path				= None

	def generate_minified_file(self, libraries=None, generated_files_path=None):
		"""Generates the minified file."""

		library_text = ''

		if libraries is not None:
			for l in libraries:
				library_text += l.contents_as_string

		raw_text = self.contents_as_string

		if library_text != '':
			raw_text = library_text + raw_text

		if self._minification_function == 'CUSTOM':
			self._compressed_text = self.perform_specific_minification(raw_text)
		else:
			self._compressed_text = self._minification_function(raw_text)

		if self.file_extension is None:
			print('BAD EXTENSION')
			print(self)
			exit(5)

		# TODO: Remove '_compressed_file_extension'
		self._compressed_file_extension = '.min' + self.file_extension
		self._save_path = self.full_path.replace(self.file_extension, '.min' + self.file_extension)

		if generated_files_path is not None:
			_save_path = generated_files_path + self.file_name + '.min' + self.file_extension
			ufo.create_file_or_override(self._compressed_text, _save_path)
			return _save_path
		else:
			ufo.create_file_or_override(self._compressed_text, self._save_path)
			return self._save_path

		#print('SAVE PATH IS THE FOLLOWING {' + str(self._save_path) + '}')

		#ufo.copy_file_to_path(self._save_path.replace('/quasar/source/', '/Users/utarsuno/git_repos/quasar_source/') ,self._save_path)
		#ufo.copy_file_to_path(self._save_path.replace('/quasar/source/', '/Users/utarsuno/git_repos/quasar_source/'), self._save_path)

		#if self._temporary_design:
		#	ufo.copy_file_to_path(self._save_path, self._save_path.replace('/configuration_files/', '/quasar_site_django/'))

	def set_minification_function(self, minification_function):
		"""Sets the minifcation algorithm to be used on this CodeFile's text."""
		self._minification_function = minification_function

	def set_minification_function_custom(self):
		self._minification_function = 'CUSTOM'


