# coding=utf-8

"""This module, c_finance_programs_manager.py, manages the C finance programs."""

'''__   __   ___     __   ___  ___         ___  __      __     __   ___  __  ___  __   __     ___  __
  |__) |__) |__  __ |  \ |__  |__  | |\ | |__  |  \    |  \ | |__) |__  /  `  |  /  \ |__) | |__  /__`
  |    |  \ |___    |__/ |___ |    | | \| |___ |__/    |__/ | |  \ |___ \__,  |  \__/ |  \ | |___ .__/ '''
DIRECTORY_C_SOURCE_CODE       = 'home/git_repos/quasar_source/finance/c_source_files/'
DIRECTORY_C_ABSTRACT          = DIRECTORY_C_SOURCE_CODE + 'abstract/'
DIRECTORY_C_DATA_PROCESSING   = DIRECTORY_C_SOURCE_CODE + 'data_processing/'
DIRECTORY_C_SIMULATION_RUNNER = DIRECTORY_C_SOURCE_CODE + 'simulation_runner/'

DIRECTORY_OUTPUT_BASE = '/home/databoi/c_code/'
DIRECTORY_LIBRARIES   = DIRECTORY_OUTPUT_BASE + 'libraries/'

'''__   __   ___     __   ___  ___         ___  __      __      __   __        __   __   ___     ___         ___  __
  |__) |__) |__  __ |  \ |__  |__  | |\ | |__  |  \    /  `    /__` /  \ |  | |__) /  ` |__     |__  | |    |__  /__`
  |    |  \ |___    |__/ |___ |    | | \| |___ |__/    \__,    .__/ \__/ \__/ |  \ \__, |___    |    | |___ |___ .__/ '''
#from c_processes.c_file_types import CFile
from c_processes.c_file_types.c_project import CProject
from c_processes.c_file_types.c_library import CLibrary
from c_processes.c_file_types.c_file_types import CSourceCodeFile
from c_processes.c_file_types.c_file_types import CHeaderFile

# Custom library.
file_book_data_header = CHeaderFile('book_data.h')
file_book_data_source = CSourceCodeFile('book_data.c')
library_book_data     = CLibrary(file_book_data_source, DIRECTORY_LIBRARIES)


# Project for saving the data.
file_data_saver_source = CSourceCodeFile()
project_raw_data_saver = CProject('raw_data_saver')

