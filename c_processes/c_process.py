# coding=utf-8

"""This module, c_process.py, is an API for managing and interacting with a single C process."""


# Needed for running a C process and sending data to it.
from subprocess import Popen, PIPE


class CProcess(object):
	"""Represents a single running C process."""

	def __init__(self, path_source_file, path_output_file, output_file_name, flags):
		self._path_source_file = path_source_file
		self._path_output_file = path_output_file
		self._output_file_name = output_file_name
		self._flags            = flags

		self._run_string = output_file_name
		if len(flags) > 0:
			for f in flags:
				self._run_string += ' ' + f

		self.c_process     = None
		self.output_stdout = None
		self.output_stderr = None

	def run_process(self):
		"""Runs the c_process."""
		self.c_process = Popen(self._run_string, shell=True, stdin=PIPE, stdout=PIPE, stderr=PIPE)
		self.c_process.wait()
		self.output_stdout, self.output_stderr = self.c_process.communicate()

	def compile_process(self):
		"""Compiles this c program."""

