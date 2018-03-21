# coding=utf-8

"""This module, code_chunk.py, is an abstraction to sections of code."""


class CodeChunk(object):
	"""Represents a segment of code."""

	def __init__(self, lines_of_code=None):
		if lines_of_code is None:
			self._lines_of_code = []
		else:
			if type(lines_of_code) == str:
				if lines_of_code.count('\n') > 1:
					self._lines_of_code = lines_of_code.split('\n')
				else:
					self._lines_of_code = [lines_of_code]
			else:
				self._lines_of_code = lines_of_code
		self._perform_new_line_check()

	def _perform_new_line_check(self):
		"""Ensures each line in this code chunk ends with the new line character."""
		for l in range(len(self._lines_of_code)):
			self._lines_of_code[l] = self._get_valid_version_of_line(self._lines_of_code[l])

	def _get_valid_version_of_line(self, line):
		"""Performs a new line check for a single line."""
		if not line.endswith('\n'):
			return line + '\n'
		return line

	def add_line_of_code(self, line_of_code):
		"""Adds a line of code to this code chunk."""
		self._lines_of_code.append(self._get_valid_version_of_line(line_of_code))

	def add_code_chunk(self, code_chunk):
		"""Adds a code chunk's content to this code chunk."""
		chunk_content = code_chunk.lines_of_code
		for line in chunk_content:
			self.add_line_of_code(line)

	@property
	def lines_of_code(self) -> list:
		"""Returns a list of strings representing this code chunk."""
		return self._lines_of_code

	def print_as_raw_text(self):
		"""Utility function."""
		for l in self._lines_of_code:
			print(l, end='')
