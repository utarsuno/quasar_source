# coding=utf-8

"""This module, system_os.py, simply returns the current OS being ran."""

import sys
from sys import platform
import os

_is_linux   = False
_is_mac     = False
_is_windows = False
if platform == 'linux' or platform == 'linux2':
	_is_linux = True
elif platform == 'darwin':
	_is_mac = True
elif platform == 'win32':
	_is_windows = True


def is_mac() -> bool:
	"""Returns a boolean indicating if the current OS is Mac OS."""
	return _is_mac


def is_linux() -> bool:
	"""Returns a boolean indicating if the current os is Linux."""
	return _is_linux


def is_windows() -> bool:
	"""Returns a boolean indicating if the current os is Windows."""
	return _is_windows


def get_all_program_arguments():
	"""Get all arguments passed to this program."""
	if len(sys.argv) == 1:
		return []
	return sys.argv[1:]
