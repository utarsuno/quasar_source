# coding=utf-8

"""This module, file_utilities.py, provides various common file operations, abstracted."""

import yaml
from libraries.python.universal_utilities.files import path_utilities as PATH


def get_contents_yml(path: str) -> dict:
	"""Returns the contents of a yaml file."""
	with open(path, 'r') as stream:
		try:
			return yaml.load(stream, Loader=yaml.FullLoader)
		except yaml.YAMLError as exc:
			print(exc)


def get_project_config() -> dict:
    return get_contents_yml(PATH.get_project_config())

