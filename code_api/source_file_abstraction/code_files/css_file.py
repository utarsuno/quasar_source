# coding=utf-8

"""This module, css_file.py, provides an abstraction to css code files."""


#from code_api.code_abstraction.code_chunk import CodeChunk
from universal_code import useful_file_operations as ufo


from code_api.source_file_abstraction.code_files.code_file import *
from csscompressor import compress


class LoadedCSSFile(LoadedCodeFile):
	"""Represents a single css file."""

	def __init__(self, file_name, file_extensions=None):
		super().__init__(CODE_FILE_TYPE_CSS_FILE, file_name, file_extensions)
		self._compressed_text = None
		self._compression_utilities = Compressable(self, compress)

	@property
	def compression(self):
		"""Returns the compression utilities object."""
		return self._compression_utilities

	def __str__(self):
		return 'CSS:' + self._file_name
