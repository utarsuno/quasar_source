# coding=utf-8

"""This module, c_library.py, is an abstraction to a custom made C library."""

from subprocess import Popen, PIPE
from universal_code import terminal_api


class CLibrary(object):
	"""Represents a collection of c files that create a single executable."""

	def __init__(self, c_source_file, output_directory):
		self._c_source_file    = c_source_file
		self._output_directory = output_directory

	def compile_library(self):
		"""Compiles the library given the input source code directory and the output directory."""
		print('Compile file test!')
		#print(terminal_api.run_terminal_command(['gcc', '-c', self._c_source_file.full_file_path, '-o', self._output_directory + self._c_source_file.raw_file_name]))
		#print(terminal_api.run_terminal_command('gcc' + ' ' + '-c', self._c_source_file.full_file_path, '-o', self._output_directory + self._c_source_file.raw_file_name]))
		self.c_process = Popen('gcc -c ' + self._c_source_file.full_file_path + ' -o ' + self._output_directory + self._c_source_file.raw_file_name, shell=True, stdin=PIPE, stdout=PIPE, stderr=PIPE)
		self.c_process.wait()
		self.output_stdout, self.output_stderr = self.c_process.communicate()
		print('OUTPUT!')
		print(self.output_stdout.decode('utf-8'))
		print()
		print(self.output_stderr.decode('utf-8'))


'''


# Needed for running a C process and sending data to it.
from subprocess import Popen, PIPE


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