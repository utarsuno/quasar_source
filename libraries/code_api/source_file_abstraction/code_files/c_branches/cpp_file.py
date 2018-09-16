# coding=utf-8

"""This module, c++_file.py, provides an abstraction to c++ code files."""

from libraries.code_api.source_file_abstraction.code_files.code_file import *


class CPPFile(LoadedCodeFile):
	"""Represents a single c++ file."""

	def __init__(self, file_name, file_extensions=None):
		LoadedCodeFile.__init__(self, FILE_TYPE_CPP, file_name, file_extensions)
