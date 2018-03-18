# coding=utf-8

"""This module, finance_libraries_compiler.py, will compile all the needed C libraries."""

from universal_code import useful_file_operations as ufo
from c_processes.c_file_abstraction.c_file_types import CFile
from c_processes.c_file_abstraction.c_library import CLibrary
from c_processes.c_file_abstraction.c_project import CProject
from finance.finance_simulations.c_generator import model_builder
from finance.finance_simulations.models.m0_net_resistance import FinanceModel_M0

'''__   __        __  ___           ___  __
  /  ` /  \ |\ | /__`  |   /\  |\ |  |  /__`
  \__, \__/ | \| .__/  |  /~~\ | \|  |  .__/ '''
# Source code directory and output (compiled/executable) directory.
DIRECTORY_FINANCE_LIBRARIES_SOURCE = '/home/git_repos/quasar_source/finance/c_source_files/abstract/'
DIRECTORY_FINANCE_C_CODE_OUTPUT    = '/home/databoi/c_code/'
DIRECTORY_FINANCE_MODELS_OUTPUT    = '/home/databoi/c_code/'

# Raw data path.
DIRECTORY_FINANCE_MASARI_RAW_DATA = '/home/databoi/masari_data/'

# File paths.
FILE_PATH_RAW_DATA_PARSER = '/home/git_repos/quasar_source/finance/c_source_files/data_loader/raw_data_parser.c'

# Libraries.
LIBRARY_BOOK_DATA  = 'book_data'
LIBRARY_CONSTANTS  = 'custom_constants'
LIBRARY_SIMULATION = 'simulation_state'

'''__                __       ___              ___          ___    ___  __
  |__)  /\  |  |    |  \  /\   |   /\     |  |  |  | |    |  |  | |__  /__`
  |  \ /~~\ |/\|    |__/ /~~\  |  /~~\    \__/  |  | |___ |  |  | |___ .__/ '''
# List of all the masari data file paths.
ALL_MASARI_DATA_FILES = ufo.get_all_file_paths_inside_directory(DIRECTORY_FINANCE_MASARI_RAW_DATA)

''' __                         ___    __        __
   /__` |  |\/| |  | |     /\   |  | /  \ |\ | /__`
   .__/ |  |  | \__/ |___ /~~\  |  | \__/ | \| .__/ '''

#c_file_raw_data_parser = CFile(FILE_PATH_RAW_DATA_PARSER)
#PROJECT_SIMULATION_DATA_FETCHER = CProject(c_file_raw_data_parser, [C_LIBRARY_BOOK_DATA], DIRECTORY_FINANCE_C_CODE_OUTPUT)
#PROJECT_SIMULATION_DATA_FETCHER.build_project()


'''__   __   __        ___  __  ___     __               __
  |__) |__) /  \    | |__  /  `  |     |__) |  | | |    |  \
  |    |  \ \__/ \__/ |___ \__,  |     |__) \__/ | |___ |__/ '''


class FinanceProjectBuilder(object):
	"""Builds the finance project."""

	def __init__(self):
		self.c_libraries = {}
		self.build_libraries()
		self.load_data()

	def build_libraries(self):
		"""Builds the libraries needed for this project."""
		print('Building libraries!')

		all_c_files = ufo.get_all_file_paths_inside_directory(DIRECTORY_FINANCE_LIBRARIES_SOURCE)

		for p in all_c_files:
			if p.endswith('.c'):
				c_file = CFile(p)
				raw_file_name = c_file.raw_file_name

				if raw_file_name not in self.c_libraries:
					self.c_libraries[raw_file_name] = CLibrary(c_file, DIRECTORY_FINANCE_C_CODE_OUTPUT)
					self.c_libraries[raw_file_name].compile_library()

		print('Finished building libraries.')

	def load_data(self):
		"""Loads the data needed for building models."""
		y = 2
		# TODO !

	def build_base_for_models(self):
		"""Temporary design."""
		print('Building models!')
		self.build_base_for_model(FinanceModel_M0())
		print('Finished building models.')

	def build_base_for_model(self, model):
		"""Temporary design."""
		builder = model_builder.ModelBuilder(model, DIRECTORY_FINANCE_C_CODE_OUTPUT)
		builder.add_library('/home/git_repos/quasar_source/finance/c_source_files/abstract/custom_constants.h')
		builder.add_library('#include "/home/git_repos/quasar_source/finance/c_source_files/abstract/simulation_state.h"')

		builder.add_define('ARGUMENT_INDEX_WEIGHT_0', '1')
		builder.add_define('ARGUMENT_INDEX_WEIGHT_1', '2')
		builder.add_define('ARGUMENT_INDEX_WEIGHT_2', '3')
		builder.add_define('ARGUMENT_INDEX_WEIGHT_3', '4')

		builder.generate_base_file()





project_builder = FinanceProjectBuilder()
