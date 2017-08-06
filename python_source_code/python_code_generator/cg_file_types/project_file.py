# coding=utf-8

"""This module, project_file.py, defines project files for quasar code.
Project files define the environment (one of {dev, qa, prod}) and which *.script and *.library files to utilize."""

from python_source_code.python_code_generator.cg_file_types.entity_file import EntityFile


class ProjectFile(EntityFile):
	"""Defines project files for the quasar source system."""

	def __init__(self, file_name):
		super().__init__(file_name)
