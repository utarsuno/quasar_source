# coding=utf-8

"""This module, path_manager.py, provides an easy access to paths in this project."""

# Needed for system operations.
import os

from universal_code.system_os import is_linux

_current_path = os.path.dirname(os.path.realpath(__file__))
_project_base_path = _current_path.replace('universal_code', '')


PATH_TO_ALL_SCRIPTS_DIRECTORY = _project_base_path + 'all_scripts'
PATH_TO_CONFIG_READER         = PATH_TO_ALL_SCRIPTS_DIRECTORY + '/universal/config_reader_for_bash.py'
PATH_TO_CONFIG_FILE           = _project_base_path + 'configuration_files/config.ini'

FINANCE_PATH_TO_MASARI_DATA = '/home/databoi/masari_data/'


def get_config_ini() -> str:
	"""Temporary utility function."""
	if is_linux():
		return '/home/config.ini'
	return _project_base_path + 'configuration_files/config.ini'

