# coding=utf-8

"""This module, library_file.py, defines library files for quasar code.
Library files (*.library) define modules which have no code execution on code import."""

from quasar_source_code.python_code_generator.cg_file_types.entity_file import EntityFile


class LibraryFile(EntityFile):
	"""Defines library files for the quasar source system."""

	def __init__(self, file_name):
		super().__init__(file_name)
