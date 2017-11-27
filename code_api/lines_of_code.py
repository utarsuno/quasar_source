# coding=utf-8

"""This module, lines_of_code.py, works with the abstraction of a single line of code."""

from quasar_source_code.universal_code import useful_file_operations as ufo


PYTHON     = 'python'
JAVASCRIPT = 'javascript'


class LineOfCode(object):
	"""Represents a single line of code."""

	def __init__(self, line_of_code_as_text):
		self._text = line_of_code_as_text

		# Gets set by CodeFile objects.
		self._language = None
		self._parent_code_file = None

	def set_langauge_and_other_data(self, language, parent_code_file):
		"""Sets the language of this line of code and the parent code file."""
		self._language = language
		self._parent_code_file = parent_code_file

	@property
	def language(self):
		"""Returns the programming language of this LineOfCode object."""
		return self._language

	@property
	def text(self):
		"""Returns the text representation of this line of code."""
		return self._text

	def is_blank_line(self) -> bool:
		"""Returns a boolean indicating if this line of code is actually just an empty line."""
		if self._text and self._text.strip():
			return False
		return True


def get_lines_of_code_from_file(file_path):
	"""Returns a list of LineOfCode objects representing the contents of the file."""
	x = []
	with open(file_path) as file:
		for l in file:
			x.append(LineOfCode(l))
	return x
