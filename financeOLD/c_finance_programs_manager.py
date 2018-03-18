# coding=utf-8

"""This module, c_finance_programs_manager.py, manages the C finance programs."""

from universal_code import useful_file_operations as ufo

C_FILE_BOOK_DATA_C = 'book_data.c'
C_FILE_BOOK_DATA_H = 'book_data.h'

C_FILE_DATA_LOADER_C = 'data_loader.c'
C_FILE_DATA_SAVER_C  = 'data_saver.c'

C_FILE_SIMULATION_RUNNER_C = 'simulation_runner.c'



all_c_files = ufo.get_all_file_paths_inside_directory('/home/git_repos/quasar_source/finance/c_source_files')

print(all_c_files)
