# coding=utf-8

"""This module, code_generator.py, will parse *.script and *.library files into filled out *.py files."""


class CodeGenerator(object):
	"""Generates complete *.py files from *.script and *.library files."""

	def __init__(self, script_or_library_file, output_destination):
		self.input_file  = script_or_library_file
		self.output_file = output_destination


