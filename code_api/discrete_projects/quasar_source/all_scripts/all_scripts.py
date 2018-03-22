# coding=utf-8

"""This module, all_scripts.py, manages the all_scripts directory for the QuasarSource project."""

from code_api.project_abstraction.project_component import ProjectComponent
from code_api.source_file_abstraction.code_files.shell_file import *
from universal_code import path_manager as pm


def load_all_scripts_project_component():
	"""Loads the all scripts project component."""
	quasar_component_all_scripts = ProjectComponent('all_scripts')

	directory_all_scripts = CodeDirectory(pm.DIRECTORY_QUASAR_SOURCE_BASE + 'all_scripts')

	quasar_component_all_scripts.add_base_code_directory(directory_all_scripts)

	return quasar_component_all_scripts, directory_all_scripts

