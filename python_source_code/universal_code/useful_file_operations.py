# coding=utf-8

"""This module, useful_file_operations, simply contains lots of functions for file + directory operations."""

# Needed for running regular expressions.
import re
# Needed for system level operations.
import os
# Has super useful file + directory operations.
from pathlib import Path
# Used for advanced IDE typing.
from typing import List
# Used for recursively traversing directories.
import glob

'''      ___          ___         ___            __  ___    __        __
	|  |  |  | |    |  |  \ /    |__  |  | |\ | /  `  |  | /  \ |\ | /__`
	\__/  |  | |___ |  |   |     |    \__/ | \| \__,  |  | \__/ | \| .__/
'''


def _is_valid_path_parameter(path):
	if path is not None and type(path) is str:
		return True
	return False

'''        __   __             ___     ___            __  ___    __        __
	 |\/| /  \ |  \ |  | |    |__     |__  |  | |\ | /  `  |  | /  \ |\ | /__`
	 |  | \__/ |__/ \__/ |___ |___    |    \__/ | \| \__,  |  | \__/ | \| .__/
'''


def get_file_basename(path: str) -> str:
	"""Extracts the basename of the provided path."""
	# Thanks to stackoverflow for showing how to get_file_basename : https://stackoverflow.com/questions/8384737/extract-file-name-from-path-no-matter-what-the-os-path-format
	basename = re.search(r'[^\\/]+(?=[\\/]?$)', path)
	if basename:
		return basename.group(0)
	return ''


def get_file_last_extension(path: str) -> str:
	"""Extracts the last extension from the provided path (if it exists, returns '' otherwise)."""
	if _is_valid_path_parameter(path):
		return Path(path).suffix
	return ''


def get_file_extensions(path: str) -> List[str]:
	"""Extracts all the file extensions from the provided path (if any exist, returns [] otherwise)."""
	if _is_valid_path_parameter(path):
		return Path(path).suffixes
	return []


def is_file(path: str) -> bool:
	"""Determines if the path provided points to a file or not."""
	if _is_valid_path_parameter(path):
		return os.path.isfile(path)
	return False


def is_directory(path: str) -> bool:
	"""Determines if the path provided points to a directory or not."""
	if _is_valid_path_parameter(path):
		return os.path.isdir(path)
	return False


def get_all_file_names_inside_directory(path: str) -> List[str]:
	"""Returns a list of file names found inside the provided directory."""
	file_paths = []
	for full_path in glob.glob(path + '/**', recursive=True):
		# Ignore directories, only look at files.
		if not is_directory(full_path):
			file_paths.append(full_path)
	return file_paths
