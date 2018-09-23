# coding=utf-8

"""This module, js_file.py, provides an abstraction to javascript code files."""


#from code_api.code_abstraction.code_chunk import CodeChunk
from libraries.universal_code import useful_file_operations as ufo
from libraries.code_api.source_file_abstraction.code_files.code_file import *
from jsmin import jsmin
from libraries.universal_code.system_abstraction.shell_command_runner import BashCommandRunner
from libraries.universal_code import useful_file_operations as ufo
from libraries.universal_code import output_coloring as oc
from libraries.universal_code import debugging as dbg


class LoadedJSFile(LoadedCodeFile):
	"""Represents a single javascript file."""

	def __init__(self, file_name, file_extensions=None):
		super().__init__(FILE_TYPE_JS, file_name, file_extensions)
		self._first_comment_block = None

	def preserve_first_comment_block(self):
		"""Utility function to get the author comment from the source code."""
		content = self.content

		in_comment_block    = False
		first_comment_block = []
		for l in content:
			if '/**' in l or '/*!' in l:
				in_comment_block = True
			if in_comment_block:
				first_comment_block.append(l)
			if '*/' in l:
				break

		#self._first_comment_block = first_comment_block
		self._first_comment_block = ''.join(first_comment_block)

	def minify(self, output_path: str, preserve_first_comment_block: bool=False) -> None:
		"""Minifies this JS file to the provided output path."""
		# '--removeDebugger',
		# '--removeConsole',

		passed, output = BashCommandRunner([
			'minify',
			self.full_path,
			'--mangle',
			'--simplify',
			'--booleans',
			'--builtIns',
			'--consecutiveAdds',
			'--deadcode',
			'--evaluate',
			'--flipComparisons',
			'--infinity',
			'--memberExpressions',
			'--mergeVars',
			'--numericLiterals',
			'--propertyLiterals',
			'--regexpConstructors',
			'--removeUndefined',
			'--replace',
			'--typeConstructors',
			'--undefinedToVoid',
			'-o',
			output_path
		], require_input=True).run()

		if not passed:
			dbg.raise_exception('minify error {' + str(output) + '}')
			#oc.print_ascii_red('minify error {' + str(output) + '}')

		if preserve_first_comment_block:
			if self._first_comment_block is None:
				self.preserve_first_comment_block()

			contents = ufo.file_get_contents_as_string(output_path)
			with open(output_path, 'w') as file:
				file.write('\n' + self._first_comment_block + '\n' + contents)


class GeneratedJSFile(GeneratedCodeFile):
	"""Represents a single generated javascript file."""

	def __init__(self, file_name, file_extensions=None):
		super().__init__(FILE_TYPE_JS, file_name, file_extensions)

		# Temporary fix.
		if self.file_extension is None:
			extensions = ufo.file_get_extensions(self.file_name)
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
