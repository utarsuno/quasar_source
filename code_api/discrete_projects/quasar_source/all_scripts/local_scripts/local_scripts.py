# coding=utf-8

"""This module, local_scripts.py, manages the local scripts directory for the QuasarSource project."""

from code_api.discrete_projects.predefined_code.shell_code.safety_checks import *
from code_api.discrete_projects.predefined_code.shell_code.variable_setters import *
from code_api.source_file_abstraction.code_files.shell_file import *
from code_api.source_file_abstraction.code_directories.shell_directory import ShellDirectory

from code_api.discrete_projects.quasar_source.all_scripts.local_scripts import quasar


def load_local_scripts(directory_all_scripts, code_file_script_utilities, code_file_config_reader):
	"""Loads the local scripts."""
	directory_local = directory_all_scripts.add_new_child_code_directory_from_current_path('local', ShellDirectory)

	directory_local_quasar = quasar.load_local_quasar_scripts(directory_local, code_file_script_utilities, code_file_config_reader)


