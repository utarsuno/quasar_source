# coding=utf-8

"""This module, shell_command_runner.py, is used for running shell commands and retrieving the output of them."""


# Needed for running a process and I/O to the process.
from subprocess import Popen, PIPE


def run_shell_command_and_get_results(shell_command):
	"""Runs the provided shell command and returns the results."""
	if type(shell_command) == list:
		cmd = ''
		for i in shell_command:
			cmd += i + ' '
	else:
		cmd = shell_command
	process = Popen(cmd, shell=True, stdin=PIPE, stdout=PIPE, stderr=PIPE)
	process.wait()
	output_stdout, output_stderr = process.communicate()
	return output_stdout, output_stderr
