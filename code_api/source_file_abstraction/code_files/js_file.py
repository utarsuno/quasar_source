# coding=utf-8

"""This module, js_file.py, provides an abstraction to javascript code files."""


#from code_api.code_abstraction.code_chunk import CodeChunk
from universal_code import useful_file_operations as ufo
from code_api.source_file_abstraction.code_files.code_file import *
from jsmin import jsmin


class LoadedJSFile(LoadedCodeFile):
	"""Represents a single javascript file."""

	def __init__(self, file_name, file_extensions=None):
		super().__init__(CODE_FILE_TYPE_JS_FILE, file_name, file_extensions)

	def __str__(self):
		return 'JS:' + self._file_name


class GeneratedJSFile(GeneratedCodeFile):
	"""Represents a single generated javascript file."""

	def __init__(self, file_name, file_extensions=None):
		super().__init__(CODE_FILE_TYPE_JS_FILE, file_name, file_extensions)
		self._compression_utilities = Compressable(self, jsmin, True)

	@property
	def compression(self):
		"""Returns the compression utilities object."""
		return self._compression_utilities
	
	def __str__(self):
		return 'JS:' + self._file_name


