# coding=utf-8

"""This module, html_file.py, provides an abstraction to html code files."""


#from code_api.code_abstraction.code_chunk import CodeChunk
from universal_code import useful_file_operations as ufo
import htmlmin
from code_api.source_file_abstraction.code_files.reducable.minifiable import Minifiable

from code_api.source_file_abstraction.code_files.code_file import *


class LoadedHTMLFile(LoadedCodeFile, Minifiable):
	"""Represents a single html file."""

	def __init__(self, file_name, file_extensions=None):
		LoadedCodeFile.__init__(self, CODE_FILE_TYPE_HTML_FILE, file_name, file_extensions)
		Minifiable.__init__(self)
		self.set_minification_function(htmlmin.minify)
