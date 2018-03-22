# coding=utf-8

"""This module, quasar_project.py, represents all of Quasar."""


#from code_api.discrete_projects.quasar_source.all_scripts.all_scripts import *
from code_api.discrete_projects.quasar_source.all_scripts.all_scripts import load_all_scripts_project_component
from code_api.discrete_projects.quasar_source.all_scripts.library_scripts import load_library_scripts
from code_api.discrete_projects.quasar_source.all_scripts.local_scripts import load_local_scripts
from code_api.discrete_projects.quasar_source.all_scripts.server_scripts import load_server_scripts
from code_api.project_abstraction.code_project import CodeProject


def load_quasar_source_project():
	"""Loads and returns the quasar source project."""
	quasar_source_project = CodeProject('quasar_source')

	all_scripts_project_component, all_scripts_directory = load_all_scripts_project_component()
	lib_utilities, lib_config_reader_local, lib_config_reader_server = load_library_scripts(all_scripts_directory)
	load_local_scripts(all_scripts_directory, lib_utilities, lib_config_reader_local)
	load_server_scripts(all_scripts_directory, lib_utilities, lib_config_reader_server)

	quasar_source_project.add_project_component(all_scripts_project_component)
	return quasar_source_project

