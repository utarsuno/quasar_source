# coding=utf-8

"""This module, code_generator.py, will parse *.script and *.library files into filled out *.py files."""


class CodeGenerator(object):
	"""Generates single *.py files from the following file types {*.script, *.library, *.project}."""

	def __init__(self, script_or_library_file, output_destination):
		self.input_file  = script_or_library_file
		self.output_file = output_destination


