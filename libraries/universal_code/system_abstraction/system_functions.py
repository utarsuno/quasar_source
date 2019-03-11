# coding=utf-8

"""This module, system_functions.py, contains useful functions relating to system/os level operations."""

from libraries.universal_code import debugging as dbg
from libraries.universal_code.system_abstraction import bash_interactive as bash
from libraries.universal_code.string_utilities import str_get_as_list_without_ending_empty_line
import os
import subprocess


#from libraries.universal_code.string_utilities import str_parse_as_utf8


def _util_parse_output(output, decode, get_as_lines, simplify_to_boolean=False):
	"""Utility function."""
	if output is not None:
		if decode:
			output = output.decode('utf-8')
		if get_as_lines:
			output = str_get_as_list_without_ending_empty_line(output)
		if simplify_to_boolean:
			return output, len(output) > 0
		return output
	else:
		if simplify_to_boolean:
			return output, False
		return output


def get_system_environment(key):
	"""Returns the system environment variable's value."""
	value = os.getenv(key, None)
	if value == 'False' or value == 'false':
		return False
	elif value == 'True' or value == 'true':
		return True
	return value


def sys_op_get_cmd_output(command_to_run, input_required=False):
	"""Runs the provided command and returns the output. Throws an exception on error."""
	success, output = bash.BashCommandRunner(command_to_run, input_required).run()
	if success:
		return output
	else:
		dbg.raise_exception('Bash command failed! {' + output + '}')


def sys_run_process(command_to_run, cwd=None, decode_output=False, get_output_as_lines=False, simplify_stderr_to_boolean_flag=False):
	"""Runs the provided command as a process and links stdout + stderr during the process's life-time.
		Returns 2 variables, the spawned process's <<stdout, stderr>>."""
	if cwd is not None:
		process = subprocess.Popen(command_to_run, shell = True, stdin = subprocess.PIPE, cwd = cwd)
	else:
		process = subprocess.Popen(command_to_run, shell = True, stdin = subprocess.PIPE)
	process.wait()
	output_stdout, output_stderr = process.communicate()
	return output_stdout, output_stderr


def sys_run_process_interactive(command_to_run, cwd=None, decode_output=False, get_output_as_lines=False, simplify_stderr_to_boolean_flag=False):
	"""Runs the provided command as a process and links stdout + stderr during the process's life-time.
		Returns 2 variables, the spawned process's <<stdout, stderr>>."""
	if cwd is not None:
		process = subprocess.Popen(command_to_run, shell = True, stdin = subprocess.PIPE, stdout = subprocess.PIPE, stderr = subprocess.PIPE, cwd = cwd)
	else:
		process = subprocess.Popen(command_to_run, shell = True, stdin = subprocess.PIPE, stdout = subprocess.PIPE, stderr = subprocess.PIPE)
	process.wait()
	output_stdout, output_stderr = process.communicate()
	output_stdout                = _util_parse_output(output_stdout, decode_output, get_output_as_lines, simplify_stderr_to_boolean_flag)
	output_stderr, has_error     = _util_parse_output(output_stdout, decode_output, get_output_as_lines, False)
	if simplify_stderr_to_boolean_flag:
		return output_stdout, output_stderr, has_error
	return output_stdout, output_stderr





