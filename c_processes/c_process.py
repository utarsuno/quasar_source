# coding=utf-8

"""This module, c_process.py, is an API for managing and interacting with a single C process."""


# Needed for running a C process and sending data to it.
from subprocess import Popen, PIPE


class CProcess(object):
	"""Represents a single running C process."""

	def __init__(self, c_executable_path, flags):
		self._c_executable_path = c_executable_path
		self._shell_string = self._c_executable_path
		if type(flags) == list:
			for f in flags:
				self._shell_string += ' ' + f + ' '
		self._c_process = None

	def _start_process(self, send_input):
		"""Starts the C process."""
		if send_input:
			self._c_process = Popen(self._shell_string, shell=True, stdin=PIPE)
		else:
			self._c_process = Popen(self._shell_string, shell=True, stdin=PIPE)

	def _wait_for_process_finish(self):
		"""Lets the process finish."""
		self.c_process.wait()
		output_stdout, output_stderr = self.c_process.communicate()
		return output_stdout, output_stderr

	def run_process_and_only_get_output(self):
		"""Runs a process without providing any input."""
		self._start_process(False)
		return self._wait_for_process_finish()

	def run_process_with_input(self, data_that_is_list_of_lists):
		"""Runs a process with provided input."""
		#self.start_process(True)
		# TODO : THIS FUNCTION!!!



'''
class CProcess(object):
	"""Represents a single running C process."""

	def __init__(self, flags):
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
'''