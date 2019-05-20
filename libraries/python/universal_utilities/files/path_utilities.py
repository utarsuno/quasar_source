# coding=utf-8

"""This file, path_utilities.py, provides common operations for path operations."""

import os

_PATH_RELATIVE_QS          = '/quasar_source/'
_PATH_RELATIVE_CONFIG      = '/configs/code_manager.yml'
_PATH_RELATIVE_LIBS_PYTHON = 'libraries/python/'
_PATH_PROJECT_BASE         = None
_PATH_PROJECT_CONFIG       = None


def get_project_base_directory() -> str:
    global _PATH_PROJECT_BASE
    global _PATH_RELATIVE_QS
    if _PATH_PROJECT_BASE is None:
        path = os.path.dirname(os.path.abspath(__file__))
        _PATH_PROJECT_BASE = path[0: path.index(_PATH_RELATIVE_QS + _PATH_RELATIVE_LIBS_PYTHON)] + _PATH_RELATIVE_QS
    return _PATH_PROJECT_BASE


def get_project_config() -> str:
    global _PATH_PROJECT_CONFIG
    global _PATH_RELATIVE_CONFIG
    if _PATH_PROJECT_CONFIG is None:
        _PATH_PROJECT_CONFIG = get_project_base_directory() + _PATH_RELATIVE_CONFIG
    return _PATH_PROJECT_CONFIG

