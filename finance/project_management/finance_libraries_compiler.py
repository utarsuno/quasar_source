# coding=utf-8

"""This module, finance_libraries_compiler.py, will compile all the needed C libraries."""

from universal_code import useful_file_operations as ufo
from finance.project_management import finance_project_constants as c

all_c_files = ufo.get_all_file_paths_inside_directory(c.DIRECTORY_FINANCE_LIBRARIES)

for p in all_c_files:
	print(p)
