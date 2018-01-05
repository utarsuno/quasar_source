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
# Needed for getting *.ini file parameters.
from configparser import ConfigParser
# "This module makes available standard errno system symbols. The value of each symbol is the corresponding integer value. The names and descriptions are borrowed from linux/include/errno.h, which should be pretty all-inclusive."
# List of error definitions : https://docs.python.org/3.1/library/errno.html
import errno

'''      ___          ___         ___            __  ___    __        __
	|  |  |  | |    |  |  \ /    |__  |  | |\ | /  `  |  | /  \ |\ | /__`
	\__/  |  | |___ |  |   |     |    \__/ | \| \__,  |  | \__/ | \| .__/
'''


def _is_valid_path_parameter(path):
	if path is not None and type(path) is str and path != '':
		return True
	return False

'''        __   __             ___     ___            __  ___    __        __
	 |\/| /  \ |  \ |  | |    |__     |__  |  | |\ | /  `  |  | /  \ |\ | /__`
	 |  | \__/ |__/ \__/ |___ |___    |    \__/ | \| \__,  |  | \__/ | \| .__/
'''

'''  __   ___ ___  __     ___       ___
	|__) |__   |  |__) | |__  \  / |__
	|  \ |___  |  |  \ | |___  \/  |___
'''


# TODO : create unit tests for this function!
def get_all_file_lines(file_path) -> list:
	"""Return a list of strings that represent all the lines in the file."""
	y = 2
	# TODO : ...


# TODO : create unit tests for this function!
def get_file_size_in_bytes(file_path) -> str:
	"""Return the size of the file.
	:param file_path : The full path to the file.
	:return: The size of the file as a string."""
	return int(int(os.stat(file_path).st_size))


def get_ini_section_dictionary(path: str, section_name: str) -> dict:
	"""Reads in the database.ini information needed.
	:param path         : The path to the .ini file.
	:param section_name : The name of the section to get key-value pairs for."""
	# Source code inspired from : http://www.postgresqltutorial.com/postgresql-python/connect/
	parser     = ConfigParser()
	parameters = {}
	parser.read(path)
	if parser.has_section(section_name):
		params = parser.items(section_name)
		for param in params:
			parameters[param[0]] = param[1]
	else:
		raise Exception('Section {0} not found in the {1} file'.format(section_name, path))
	return parameters


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


def get_all_file_paths_inside_directory(path: str) -> List[str]:
	"""Returns a list of all file paths found inside the provided directory."""
	if _is_valid_path_parameter(path):
		file_paths = []
		for full_path in glob.glob(path + '/**', recursive=True):
			if not is_directory(full_path):
				file_paths.append(full_path)
		return file_paths
	return []


def get_all_file_names_inside_directory(path: str) -> List[str]:
	"""Returns a list of all file names found inside the provided directory."""
	if _is_valid_path_parameter(path):
		file_names = []
		for full_path in glob.glob(path + '/**', recursive=True):
			if not is_directory(full_path):
				file_names.append(get_file_basename(full_path))
		return file_names
	return []


'''  __   __   ___      ___    __
	/  ` |__) |__   /\   |  | /  \ |\ |
	\__, |  \ |___ /~~\  |  | \__/ | \|
'''
def create_file_or_override(file_text, file_path):
	file = open(file_path, 'w+')
	file.write(file_text)
	file.close()


def create_directory(path: str) -> None:
	"""Creates the directory at the provided path."""
	os.makedirs(path)


# Temporary on hold.
'''
# TODO : Create unit tests (but deleting unit tests will be required as well).
def create_file_if_it_does_not_exist(path: str, list_of_text) -> bool:
	"""Creates the file with the provided path and list of strings that makeup the file. Returns a boolean indicating if successful.
	:param path         : The full path of the file.
	:param list_of_text : A list of lines to compose the file of OR a string to be decomposed into a list of strings split by the '\n' character."""
	if not _is_valid_path_parameter(path):
		return False

	# TODO : Add error checking to make sure that list_of_text is either string or a list of strings. But the debugging module needs to be completed first.
	# if

	# Thanks to stackoverflow post : https://stackoverflow.com/questions/10978869/safely-create-a-file-if-and-only-if-it-does-not-exist-with-python
	flags = os.O_CREAT | os.O_EXCL | os.O_WRONLY
	try:
		file_handler = os.open(path, flags)
	except OSError as e:
		if e.errno == errno.EEXIST: # Failed as the file already exists.
			pass
		else: # Something unexpected went wrong so re-raise the exception.
			raise
	else: # No exception, so the file must have been created successfully.
		with os.fdopen(file_handler, 'w') as file_object:
			# Using 'os.fdopen' converts the handle to an object that acts like a regular Python file object, and the 'with' context manager means the file will be automatically closed when we're done with it.
			for line in list_of_text:
'''
