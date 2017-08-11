# coding=utf-8

"""This module, script_file.py, defines script files for quasar code.
Script files (*.script) are files that actually execute code when ran."""

from quasar_source_code.python_code_generator.cg_file_types.entity_file import EntityFile


class ScriptFile(EntityFile):
	"""Defines script files for the quasar source system."""

	def __init__(self, file_name):
		super().__init__(file_name)
