# coding=utf-8

"""This module, custom_keyword_mapping.py, only serves
"""

from code_manager.abstract_definitions import classes
from code_manager.abstract_definitions import code_file
from code_manager.abstract_definitions import conditionals
from code_manager.abstract_definitions import functions
from code_manager.abstract_definitions import variables

library_nickname_mapping = {}
for key in classes.library_nickname_mapping.keys():
	library_nickname_mapping[key] = classes.library_nickname_mapping[key]
for key in code_file.library_nickname_mapping.keys():
	library_nickname_mapping[key] = code_file.library_nickname_mapping[key]
for key in conditionals.library_nickname_mapping.keys():
	library_nickname_mapping[key] = conditionals.library_nickname_mapping[key]
for key in functions.library_nickname_mapping.keys():
	library_nickname_mapping[key] = functions.library_nickname_mapping[key]
for key in variables.library_nickname_mapping.keys():
	library_nickname_mapping[key] = variables.library_nickname_mapping[key]
library_nickname_mapping['c'] = 'from code_manager.code_generator_support.import_error_mask import c'
