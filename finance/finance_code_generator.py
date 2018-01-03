# coding=utf-8

"""This module, finance_code_generator.py, generates finance code."""

from code_api.code_generator import c_code_generator as c
from universal_code import path_manager as pm


class FinanceCodeGenerator(object):
	"""An API to create c code files."""

	def __init__(self):
		self._c_file_template = c.CFile(pm.PATH_TO_FINANCE_C_DUMP + '/finance_file.c')
		self._c_file_template.create()


	def generate_file(self, file_name):
		"""Temporary function."""
		c_file = c.CFile(pm.PATH_TO_FINANCE_C_DUMP + '/' + file_name.replace(' ', '') + '.c')
		c_file.create()
