# coding=utf-8

"""This module, js_file.py, provides an abstraction to javascript code files."""


#from code_api.code_abstraction.code_chunk import CodeChunk
from universal_code import useful_file_operations as ufo
from code_api.source_file_abstraction.code_files.code_file import *
from jsmin import jsmin
from code_api.source_file_abstraction.code_files.reducable.minifiable import Minifiable


class LoadedJSFile(LoadedCodeFile, Minifiable):
	"""Represents a single javascript file."""

	def __init__(self, file_name, file_extensions=None):
		LoadedCodeFile.__init__(self, CODE_FILE_TYPE_JS_FILE, file_name, file_extensions)
		Minifiable.__init__(self)
		self.set_minification_function(jsmin)


class GeneratedJSFile(GeneratedCodeFile):
	"""Represents a single generated javascript file."""

	def __init__(self, file_name, file_extensions=None):
		super().__init__(CODE_FILE_TYPE_JS_FILE, file_name, file_extensions)

	def get_created_file_as_loaded_file(self):
		"""Returns a loaded code file object based off the one created."""
		loaded_file = LoadedJSFile(self.file_name, self.file_extension)
		loaded_file._parent_code_directory = self._parent_code_directory
		return loaded_file
