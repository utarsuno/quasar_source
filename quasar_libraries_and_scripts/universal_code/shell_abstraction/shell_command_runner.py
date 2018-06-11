# coding=utf-8

"""This module, shell_command_runner.py, is used for running shell commands and retrieving the output of them."""


# Needed for running a process and I/O to the process.
from subprocess import Popen, PIPE
import subprocess


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


def run_shell_command_and_get_results(shell_command):
	"""Runs the provided shell command and returns the results."""
	cmd = _parse_shell_command(shell_command)
	process = Popen(cmd, shell=True, stdin=PIPE, stdout=PIPE, stderr=PIPE)
	process.wait()
	output_stdout, output_stderr = process.communicate()
	return output_stdout, output_stderr


def run_and_get_output_no_input(shell_command):
	"""If fancy I/O is not needed."""
	cmd = _parse_shell_command(shell_command)
	process = Popen(cmd, shell=True, stdout=subprocess.PIPE)
	process.wait()
	output_stdout, output_stderr = process.communicate()
	return output_stdout, output_stderr
