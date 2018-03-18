# coding=utf-8

"""This module, finance_libraries_compiler.py, will compile all the needed C libraries."""

from universal_code import useful_file_operations as ufo
from finance.project_management import finance_project_constants as c
from c_processes.c_file_abstraction.c_file_types import CFile
from c_processes.c_file_abstraction.c_library import CLibrary
from c_processes.c_file_abstraction.c_project import CProject

'''       __   __        __          ___         ___  __
  |    | |__) |__)  /\  |__) \ /    |__  | |    |__  /__`
  |___ | |__) |  \ /~~\ |  \  |     |    | |___ |___ .__/ '''
all_c_files = ufo.get_all_file_paths_inside_directory(c.DIRECTORY_FINANCE_LIBRARIES_SOURCE)

c_libraries = {}

for p in all_c_files:
	if p.endswith('.c'):
		c_file = CFile(p)
		raw_file_name = c_file.raw_file_name

		if raw_file_name not in c_libraries:
			c_libraries[raw_file_name] = CLibrary(c_file, c.DIRECTORY_FINANCE_C_CODE_OUTPUT)
			c_libraries[raw_file_name].compile_library()


C_LIBRARY_BOOK_DATA = c_libraries['book_data']
''' __                         ___    __        __
   /__` |  |\/| |  | |     /\   |  | /  \ |\ | /__`
   .__/ |  |  | \__/ |___ /~~\  |  | \__/ | \| .__/ '''
c_file_raw_data_parser = CFile(c.FILE_PATH_RAW_DATA_PARSER)
PROJECT_SIMULATION_DATA_FETCHER = CProject(c_file_raw_data_parser, [C_LIBRARY_BOOK_DATA], c.DIRECTORY_FINANCE_C_CODE_OUTPUT)
PROJECT_SIMULATION_DATA_FETCHER.build_project()
