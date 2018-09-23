# coding=utf-8

"""This module, css_file.py, provides an abstraction to css code files."""

from libraries.code_api.source_file_abstraction.code_files.code_file import *
from csscompressor import compress


class LoadedCSSFile(LoadedCodeFile):
	"""Represents a single CSS file."""

	def __init__(self, file_name, file_extensions=None):
		super().__init__(FILE_TYPE_CSS, file_name, file_extensions)

	def minify(self, output_path: str) -> None:
		"""Minifies this CSS file to the provided output path."""
		content = ufo.file_get_contents_as_string(self.full_path)
		minified_content = compress(content)
		ufo.file_op_create_or_override(output_path, minified_content)




