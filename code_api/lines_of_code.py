# coding=utf-8

"""This module, lines_of_code.py, works with the abstraction of a single line of code."""

from quasar_source_code.universal_code import useful_file_operations as ufo


class LineOfCode(object):
	"""Represents a single line of code."""

	def __init__(self, line_of_code_as_text):
		self._text = line_of_code_as_text

	@property
	def text(self):
		"""Returns the text representation of this line of code."""
		return self._text

	def is_blank_line(self) -> bool:
		"""Returns a boolean indicating if this line of code is actually just an empty line."""
		print('LINE : ')
		print(self._text)
		print(len(self._text))
		if self._text and self._text.strip():
			return False
		return True


def get_lines_of_code_from_file(file_path):
	"""Returns a list of LineOfCode objects representing the contents of the file."""
	x = []
	with open(file_path) as file:
		for l in file:
			x.append(l)
	return x
