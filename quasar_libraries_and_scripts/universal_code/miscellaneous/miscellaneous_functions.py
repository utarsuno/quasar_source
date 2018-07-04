# coding=utf-8

"""This module, miscellaneous_functions.py, has functions to be organized better at a later date."""

from quasar_libraries_and_scripts.universal_code.shell_abstraction.shell_command_runner import run_and_get_output_no_input
from quasar_libraries_and_scripts.universal_code import output_coloring as oc


def get_current_git_version():
	"""Utility function to get the current commit number of the current git push."""
	git_version = run_and_get_output_no_input(['git', 'rev-list', '--all', '--count'])
	errors = git_version[1]
	if errors is not None:
		oc.print_ascii_red('Error!')
		oc.print_data_with_red_dashes_at_start('Error with getting git version.')
		oc.print_data_with_red_dashes_at_start('{' + str(errors[1]) + '}')
	else:
		return int(git_version[0].decode('utf-8').replace('\n', ''))



