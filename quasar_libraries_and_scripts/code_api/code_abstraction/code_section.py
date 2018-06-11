# coding=utf-8

"""This module, code_section.py, is an abstraction for code sections. Needed for ordering code chunks."""


class CodeSection(object):
	"""Represents a single code section of a source code file."""

	def __init__(self, section_name):
		self._section_name = section_name
		self._code_chunks = []

	def add_code_chunk_at_start(self, code_chunk):
		"""Adds a code chunk to the start of this code section."""
		self._code_chunks.insert(0, code_chunk)

	def add_code_chunk(self, code_chunk):
		"""Adds a code chunk to this code section."""
		self._code_chunks.append(code_chunk)

	def get_all_code_chunks(self):
		"""Returns a list of all the code chunks in this code section."""
		return self._code_chunks

	@property
	def empty(self) -> bool:
		"""Returns a boolean indicating if this code section is empty or not."""
		return len(self._code_chunks) == 0

	@property
	def name(self) -> str:
		"""Returns the name of this code section."""
		return self._section_name
