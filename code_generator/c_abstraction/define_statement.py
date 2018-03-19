# coding=utf-8

"""This module, define_statement.py, provides an abstraction to C define statements."""

from code_generator.code_abstraction.code_chunk import CodeChunk


class DefineStatement(object):
	"""Abstraction to C define statements."""

	def __init__(self, name, value):
		self._name  = name
		self._value = value

		self._code_chunk = CodeChunk(['#define ' + str(name) + ' ' + str(value)])

	@property
	def code_chunk(self) -> CodeChunk:
		"""Returns the code chunk representing this define statement."""
		return self._code_chunk
