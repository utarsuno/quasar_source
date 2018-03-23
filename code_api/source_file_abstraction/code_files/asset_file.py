# coding=utf-8

"""This module, asset_file.py, provides an abstraction to asset files."""


#from code_api.code_abstraction.code_chunk import CodeChunk
from universal_code import useful_file_operations as ufo


from code_api.source_file_abstraction.code_files.code_file import *
from csscompressor import compress

'''
class AssetFile(CodeFile):
	"""Represents a single asset file."""

	def __init__(self, file_name, file_extensions=None):
		super().__init__(CODE_FILE_TYPE_CSS_FILE, file_name, file_extensions)
		self._minified_text  = []
		self._compressed_text = None
		self._compressed_file_size = None

	def generate_minified_file(self):
		"""Generates the minified version of this file."""
		if self._compressed_text is None:
			self._create_minified_text()
		save_path = self.full_path.replace(self._file_extension, '.min.css')
		ufo.create_file_or_override(self._compressed_text, save_path)

		self._compressed_file_size = ufo.get_file_size_in_bytes(save_path)

	def _create_minified_text(self):
		"""Creates the minified text for this CSS file."""
		if not self.contents_loaded:
			self.read_file_contents()

		raw_text = ''
		for l in self._file_lines:
			raw_text += l

		self._compressed_text = compress(raw_text)

	@property
	def percent_compressed(self):
		"""Returns the % amount saved from compression."""
		return 1.0 - float(self._compressed_file_size) / float(self._file_size)
'''