# coding=utf-8

"""This module, js_file.py, provides an abstraction to javascript code files."""


#from code_api.code_abstraction.code_chunk import CodeChunk
from libraries.universal_code import useful_file_operations as ufo
from libraries.code_api.source_file_abstraction.code_files.code_file import *
from jsmin import jsmin
from libraries.code_api.source_file_abstraction.code_files.reducable.minifiable import Minifiable
from libraries.universal_code.system_abstraction.shell_command_runner import BashCommandRunner
from libraries.universal_code import useful_file_operations as ufo


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

		# Temporary fix.
		if self.file_extension is None:
			extensions = ufo.get_file_extensions(self.file_name)
			combined_extensions = ''
			if len(extensions) > 0:
				for e in extensions:
					file_name = file_name.replace(e, '')
					combined_extensions += e
			self._file_extension = combined_extensions

			# Really temporary lol.
			self._file_name = self._file_name.replace(self._file_extension, '')

		# /quasar/source/libraries/front_end/js/nexus/nexus/nexus_local.js

	def get_created_file_as_loaded_file(self):
		"""Returns a loaded code file object based off the one created."""
		loaded_file = LoadedJSFile(self.file_name, self.file_extension)
		loaded_file._parent_code_directory = self._parent_code_directory
		return loaded_file
