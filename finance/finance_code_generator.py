# coding=utf-8

"""This module, finance_code_generator.py, generates finance code."""

from universal_code import path_manager as pm
from code_api import c_code_generator as c





class FinanceCodeGenerator(object):
	"""An API to create c code files."""

	def __init__(self):
		self._c_file_template = c.CFile(pm.PATH_TO_FINANCE_C_DUMP + '/finance_file.c')
		self._c_file_template.create()

