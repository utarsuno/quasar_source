# coding=utf-8

"""This module, html_file.py, provides an abstraction to html code files."""


#from code_api.code_abstraction.code_chunk import CodeChunk
from universal_code import useful_file_operations as ufo
import htmlmin


from code_api.source_file_abstraction.code_files.code_file import *
from csscompressor import compress


class LoadedHTMLFile(LoadedCodeFile):
	"""Represents a single html file."""

	def __init__(self, file_name, file_extensions=None):
		super().__init__(CODE_FILE_TYPE_CSS_FILE, file_name, file_extensions)
		self._compression_utilities = Compressable(self, htmlmin.minify)

	def __str__(self):
		return 'HTML:' + self._file_name

	@property
	def compression(self):
		"""Returns the compression utilities object."""
		return self._compression_utilities
