# coding=utf-8

"""This module, js_file.py, provides an abstraction to javascript code files."""


#from code_api.code_abstraction.code_chunk import CodeChunk
from universal_code import useful_file_operations as ufo
from code_api.source_file_abstraction.code_files.code_file import *


class LoadedJSFile(LoadedCodeFile):
	"""Represents a single html file."""

	def __init__(self, file_name, file_extensions=None):
		super().__init__(CODE_FILE_TYPE_CSS_FILE, file_name, file_extensions)

	def __str__(self):
		return 'JS:' + self._file_name

