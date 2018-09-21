# coding=utf-8

"""This module, docker_file.py, provides an abstraction to Docker files."""

from libraries.code_api.source_file_abstraction.code_files.code_file import *


class DockerFile(CodeFile):
	"""Represents a single Docker file."""

	def __init__(self, file_name, file_extensions=None):
		super().__init__(FILE_TYPE_DOCKER_FILE, file_name, file_extensions)




