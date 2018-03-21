# coding=utf-8

"""This module, safety_checks.py, provides an abstraction to pre-defined safety check shell functions."""

from code_api.code_abstraction.code_chunk import CodeChunk


class ShellSafetyCheck(object):
	"""Represents a single shell safety check."""

	def __init__(self, code_chunk):
		self._code_chunk = code_chunk

	@property
	def code_chunk(self):
		"""Returns the code chunk of this safety check."""
		return self._code_chunk


SHELL_SAFETY_CHECK_TERMINATE_IF_SUDO = ShellSafetyCheck(CodeChunk(['terminate_if_sudo']))
SHELL_SAFETY_CHECK_TERMINATE_IF_NOT_SUDO = ShellSafetyCheck(CodeChunk(['terminate_if_not_sudo']))
SHELL_SAFETY_CHECK_TERMINATE_IF_UBUNTU = ShellSafetyCheck(CodeChunk(['terminate_if_ubuntu']))
SHELL_SAFETY_CHECK_TERMINATE_IF_NOT_UBUNTU = ShellSafetyCheck(CodeChunk(['terminate_if_not_ubuntu']))
