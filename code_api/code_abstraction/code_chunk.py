# coding=utf-8

"""This module, code_chunk.py, is an abstraction to sections of code."""


class CodeChunk(object):
	"""Represents a segment of code."""

	def __init__(self, lines_of_code):
		self._lines_of_code = lines_of_code
		self._perform_new_line_check()

	def _perform_new_line_check(self):
		"""Ensures each line in this code chunk ends with the new line character."""
		for l in range(len(self._lines_of_code)):
			line = self._lines_of_code[l]
			if not line.endswith('\n'):
				self._lines_of_code[l] += '\n'

	@property
	def lines_of_code(self) -> list:
		"""Returns a list of strings representing this code chunk."""
		return self._lines_of_code
