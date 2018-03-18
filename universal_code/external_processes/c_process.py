# coding=utf-8

"""This module, c_process.py, is an API for managing and interacting with C processes."""


# Needed for running a C process and sending data to it.
from subprocess import Popen, PIPE


class CProcess(object):
	"""Represents a single running C process."""

	def __init__(self, file_path, flags):
		self._file_path = file_path
		self._flags = flags

		self.c_process = Popen(file_path, shell=True, stdin=PIPE)
		output_stdout, output_stderr = self.c_process.communicate()
		print('Printing stdout and stderr')
		print(output_stdout)
		print(output_stderr)



c_process = CProcess('/home/databoi/finance/quick_test')
