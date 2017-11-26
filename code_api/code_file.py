# coding=utf-8

"""This module, code_file.py, represents an abstraction layer to a file of code."""

from code_api import lines_of_code as loc


class CodeFile(object):
	"""Represents a single file that contains lines of code."""

	def __init__(self, file_path):
		self._file_path = file_path
		self._lines_of_code = loc.get_lines_of_code_from_file(self._file_path)

