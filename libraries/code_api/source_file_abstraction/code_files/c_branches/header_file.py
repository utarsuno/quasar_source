# coding=utf-8

"""This module, header_file.py, provides an abstraction to header code files."""

from libraries.code_api.source_file_abstraction.code_files.code_file import *


class HeaderFile(LoadedCodeFile):
	"""Represents a single c++ file."""

	def __init__(self, file_name, file_extensions=None):
		LoadedCodeFile.__init__(self, CODE_FILE_TYPE_HEADER_FILE, file_name, file_extensions)
