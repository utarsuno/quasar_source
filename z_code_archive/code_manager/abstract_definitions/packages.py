# coding=utf-8

"""
This module, packages.py, is used for generating and maintaining code files.
"""

class Package:

	def __init__(self, name):
		self._name = name
		self._code_files = []

	def add_code_file(self, code_file):
		self._code_files.append(code_file)

