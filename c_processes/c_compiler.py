# coding=utf-8

"""This module, c_compiler.py, is a utility program to compiling c programs."""

from universal_code.shell_abstraction.shell_command_runner import run_shell_command_and_get_results


def create_object_file(source_file_path, object_output_path):
	"""Creates an object file."""
	return _run_command_and_return_output('gcc -c ' + source_file_path + ' -o ' + object_output_path)


def create_executable(source_file_path, c_libraries, object_output_path):
	"""Creates a new executable file."""
	object_file_paths_as_string = ''
	for o in c_libraries:
		object_file_paths_as_string += ' ' + o.path_to_object_file + ' '
	return _run_command_and_return_output('gcc -Wall -O2 ' + source_file_path + ' ' + object_file_paths_as_string + ' -o ' + object_output_path)


def _run_command_and_return_output(shell_command):
	"""Runs the provided shell command."""
	output_stdout, output_stderr = run_shell_command_and_get_results(shell_command)
	return output_stdout, output_stderr
