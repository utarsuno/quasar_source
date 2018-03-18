# coding=utf-8

"""This module, c_finance_programs_manager.py, manages the C finance programs."""

from c_processes.c_file_types.c_project import CProject
from c_processes.c_file_types.c_library import CLibrary
from c_processes.c_file_types.c_file_types import CSourceCodeFile
from c_processes.c_file_types.c_file_types import CHeaderFile


'''__   __   ___     __   ___  ___         ___  __      __      __     __   ___  __  ___  __   __     ___  __
  |__) |__) |__  __ |  \ |__  |__  | |\ | |__  |  \    /  `    |  \ | |__) |__  /  `  |  /  \ |__) | |__  /__`
  |    |  \ |___    |__/ |___ |    | | \| |___ |__/    \__,    |__/ | |  \ |___ \__,  |  \__/ |  \ | |___ .__/ '''
DIRECTORY_SOURCE_BASE       = 'home/git_repos/quasar_source/finance/c_source_files/'
DIRECTORY_SOURCE_ABSTRACT   = DIRECTORY_SOURCE_BASE + 'abstract'
DIRECTORY_SOURCE_DATA       = DIRECTORY_SOURCE_BASE + 'data_processing'
DIRECTORY_SOURCE_SIMULATION = DIRECTORY_SOURCE_BASE + 'simulation_runner'



'''__   __   ___     __   ___  ___         ___  __      __      ___         ___  __
  |__) |__) |__  __ |  \ |__  |__  | |\ | |__  |  \    /  `    |__  | |    |__  /__`
  |    |  \ |___    |__/ |___ |    | | \| |___ |__/    \__,    |    | |___ |___ .__/ '''
c_file_source_book_data = CSourceCodeFile(DIRECTORY_SOURCE_ABSTRACT + 'book_data')
c_file_header_book_data = CHeaderFile(DIRECTORY_SOURCE_ABSTRACT + 'book_data')

c_file_source_book_data = CSourceCodeFile(DIRECTORY_SOURCE_ABSTRACT + 'data_loader')
c_file_source_book_data = CSourceCodeFile(DIRECTORY_SOURCE_ABSTRACT + 'data_saver')

c_file_source_book_data = CSourceCodeFile(DIRECTORY_SOURCE_ABSTRACT + 'simulation_runner')

'''__   __   ___     __   ___  ___         ___  __             __   __        __     ___  __
  |__) |__) |__  __ |  \ |__  |__  | |\ | |__  |  \    |    | |__) |__)  /\  |__) | |__  /__`
  |    |  \ |___    |__/ |___ |    | | \| |___ |__/    |___ | |__) |  \ /~~\ |  \ | |___ .__/ '''
LIBRARY_BOOK_DATA = CLibrary(c_file_source_book_data)

