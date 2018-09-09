# coding=utf-8

"""This module, html_file.py, provides an abstraction to html code files."""


#from code_api.code_abstraction.code_chunk import CodeChunk
import htmlmin
from libraries.code_api.source_file_abstraction.code_files.reducable.minifiable import Minifiable

from libraries.code_api.source_file_abstraction.code_files.code_file import *


class LoadedHTMLFile(LoadedCodeFile, Minifiable):
	"""Represents a single html file."""

	def __init__(self, file_name, file_extensions=None):
		LoadedCodeFile.__init__(self, CODE_FILE_TYPE_HTML_FILE, file_name, file_extensions)
		Minifiable.__init__(self)
		self.set_minification_function_custom()

	def perform_specific_minification(self, text):
		"""TODO: document"""
		return htmlmin.minify(text, remove_comments=True, remove_empty_space=True, remove_all_empty_space=True, reduce_empty_attributes=True, reduce_boolean_attributes=True, remove_optional_attribute_quotes=True, convert_charrefs=True, keep_pre=False)

