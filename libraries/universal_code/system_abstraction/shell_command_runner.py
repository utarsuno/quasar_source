# coding=utf-8

"""This module, shell_command_runner.py, is used for running shell commands and retrieving the output of them."""

# Needed for running a process and I/O to the process.
from subprocess import Popen, PIPE
import subprocess

from libraries.universal_code import debugging as dbg


def _parse_shell_command(shell_command, list_needed=False):
	"""Utility function."""
	if type(shell_command) == list:
		if list_needed:
			return shell_command
		cmd = ''
		for i in shell_command:
			cmd += i + ' '
	else:
		if list_needed:
			cmd = []
			s = shell_command.split(' ')
			for w in s:
				cmd.append(w)
		else:
			cmd = shell_command
	return cmd


class BashCommandRunner(object):
	"""Provides an abstraction to running bash commands."""

	def __init__(self, command, require_input=False):
		self._command      = _parse_shell_command(command)
		self._input_needed = require_input

	def _get_output_as_lines(self, output):
		"""Utility function."""
		lines = output.split('\n')

		if len(output[-1]) == 0 or output[-1] == '\n':
			lines = lines[:-1]

		return lines

	def run(self, cwd=None, raise_exception=False, get_as_lines=False):
		"""Runs the command and returns two outputs, success_status and output."""
		if self._input_needed:
			if cwd is not None:
				process = Popen(self._command, shell=True, stdin=PIPE, stdout=PIPE, stderr=PIPE, cwd=cwd)
			else:
				process = Popen(self._command, shell=True, stdin=PIPE, stdout=PIPE, stderr=PIPE)
		else:
			if cwd is not None:
				process = Popen(self._command, shell=True, stdout=subprocess.PIPE, cwd=cwd)
			else:
				process = Popen(self._command, shell=True, stdout=subprocess.PIPE)
		process.wait()
		output_stdout, output_stderr = process.communicate()

		has_error = False

		if output_stderr is not None:
			output_stderr = output_stderr.decode('utf-8')
			if len(output_stderr) > 0:
				has_error = True

		if has_error:
			if raise_exception:
				dbg.raise_exception('Bash command \n{' + str(self._command) + '}\n failed! \n{' + output_stderr + '}\n')
			else:
				if get_as_lines:
					False, self._get_output_as_lines(output_stderr)
				return False, output_stderr
		else:
			output_stdout = output_stdout.decode('utf-8')
			if get_as_lines:
				output_stdout = self._get_output_as_lines(output_stdout)
			if raise_exception:
				return output_stdout
			return True, output_stdout
