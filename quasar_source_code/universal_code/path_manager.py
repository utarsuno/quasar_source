# coding=utf-8

"""This module, path_manager.py, provides an easy access to paths in this project."""

# Needed for system operations.
import os

from quasar_source_code.universal_code.system_os import is_linux

_current_path = os.path.dirname(os.path.realpath(__file__))
_project_base_path = _current_path.replace('quasar_source_code/universal_code', '')


def get_config_ini() -> str:
	"""Temporary utility function."""
	if is_linux():
		return '/home/config.ini'
	return _project_base_path + 'configuration_files/config.ini'
