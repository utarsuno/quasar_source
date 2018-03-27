# coding=utf-8

"""This module, all_scripts.py, manages the all_scripts directory for the QuasarSource project."""

from code_api.project_abstraction.project_component import ProjectComponent
from code_api.source_file_abstraction.code_files.shell_file import *
from universal_code import path_manager as pm


from code_api.discrete_projects.quasar_source.all_scripts.library_scripts import load_library_scripts
from code_api.discrete_projects.quasar_source.all_scripts.local_scripts.local_scripts import load_local_scripts
from code_api.discrete_projects.quasar_source.all_scripts.server_scripts import load_server_scripts


def load_all_scripts_project_component():
	"""Loads the all scripts project component."""
	quasar_component_all_scripts = ProjectComponent('all_scripts')
	directory_all_scripts = CodeDirectory(pm.DIRECTORY_QUASAR_SOURCE_BASE + 'all_scripts')
	quasar_component_all_scripts.add_base_code_directory(directory_all_scripts)

	lib_utilities, lib_config_reader_local, lib_config_reader_server = load_library_scripts(directory_all_scripts)
	load_local_scripts(directory_all_scripts, lib_utilities, lib_config_reader_local)

	return quasar_component_all_scripts


def load_all_server_scripts():
	"""Loads all server scripts project component."""
	quasar_component_server_scripts = ProjectComponent('server_scripts')
	server_scripts = load_server_scripts()
	quasar_component_server_scripts.add_base_code_directory(server_scripts)
	return quasar_component_server_scripts
