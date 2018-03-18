# coding=utf-8

"""This module, finance_libraries_compiler.py, will compile all the needed C libraries."""

from c_processes.c_file_abstraction.c_file_types import CFile
from c_processes.c_file_abstraction.c_library import CLibrary
from c_processes.c_file_abstraction.c_project import CProject
from finance.finance_simulations.c_generator.data.data_chunk import DataChunk
from c_processes.c_process import CProcess
from c_processes.c_process_manager import ProcessManager
from finance.finance_simulations.c_generator import model_builder
from finance.finance_simulations.c_generator.data.data_instance import DataInstance
from finance.finance_simulations.models.m0_net_resistance import FinanceModel_M0
from universal_code import output_coloring as oc
from universal_code import useful_file_operations as ufo

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

'''__   __   __        ___  __  ___     __               __
  |__) |__) /  \    | |__  /  `  |     |__) |  | | |    |  \
  |    |  \ \__/ \__/ |___ \__,  |     |__) \__/ | |___ |__/ '''


class FinanceProjectBuilder(object):
	"""Builds the finance project."""

	def __init__(self):
		self.c_libraries = {}
		self.build_libraries()
		self.compile_programs()
		self.load_data()
		self.build_base_for_models()

		self._masari_data_files = None
		self._masari_training_data = None
		self._masari_testing_data = None

		self._simulation_data_fetcher = None

		self._training_data = None
		self._testing_data  = None

	def build_libraries(self):
		"""Builds the libraries needed for this project."""
		oc.print_title('Building libraries!')

		all_c_files = ufo.get_all_file_paths_inside_directory(DIRECTORY_FINANCE_LIBRARIES_SOURCE)

		for p in all_c_files:
			if p.endswith('.c'):
				c_file = CFile(p)
				raw_file_name = c_file.raw_file_name

				if raw_file_name not in self.c_libraries:
					self.c_libraries[raw_file_name] = CLibrary(c_file, DIRECTORY_FINANCE_C_CODE_OUTPUT)
					self.c_libraries[raw_file_name].compile_library()

		oc.print_success('Finished building libraries.')

	def compile_programs(self):
		"""Compile needed programs."""
		oc.print_title('Compiling programs.')
		c_file_raw_data_parser = CFile(FILE_PATH_RAW_DATA_PARSER)
		self._simulation_data_fetcher = CProject(c_file_raw_data_parser, [self.c_libraries[LIBRARY_BOOK_DATA]], DIRECTORY_FINANCE_C_CODE_OUTPUT)
		self._simulation_data_fetcher.build_project()
		oc.print_success('Finished compiling programs.')

	def build_base_for_models(self):
		"""Temporary design."""
		oc.print_title('Building models!')
		self.build_base_for_model(FinanceModel_M0())
		oc.print_success('Finished building models.')

	def build_base_for_model(self, model):
		"""Temporary design."""
		self._build_for_model(model, self._training_data, True)
		self._build_for_model(model, self._testing_data, False)

	def _build_for_model(self, model, data, is_training):
		builder = model_builder.ModelBuilder(model, DIRECTORY_FINANCE_C_CODE_OUTPUT)
		builder.add_library('/home/git_repos/quasar_source/finance/c_source_files/abstract/custom_constants.h')
		builder.add_library('/home/git_repos/quasar_source/finance/c_source_files/abstract/simulation_state.h')
		builder.add_library('<stdio.h>')
		builder.add_library('<stdlib.h>')
		builder.add_library('<string.h>')

		builder.add_define('ARGUMENT_INDEX_WEIGHT_0', '1')
		builder.add_define('ARGUMENT_INDEX_WEIGHT_1', '2')
		builder.add_define('ARGUMENT_INDEX_WEIGHT_2', '3')
		builder.add_define('ARGUMENT_INDEX_WEIGHT_3', '4')

		if is_training:
			builder.generate_training_file(data)
		else:
			builder.generate_testing_file(data)

		created_file = CFile(builder.saved_path)
		created_project = CProject(created_file, [self.c_libraries[LIBRARY_CONSTANTS], self.c_libraries[LIBRARY_SIMULATION]], DIRECTORY_FINANCE_C_CODE_OUTPUT)
		created_project.build_project()

	'''__       ___               __        __          __
	  |  \  /\   |   /\     |    /  \  /\  |  \ | |\ | / _`
	  |__/ /~~\  |  /~~\    |___ \__/ /~~\ |__/ | | \| \__> '''
	def load_data(self):
		"""Loads the data needed for building models."""
		oc.print_title('Loading all Masari data!')

		self._masari_data_files = sorted(ufo.get_all_file_paths_inside_directory(DIRECTORY_FINANCE_MASARI_RAW_DATA))
		training_cutoff_index = int(len(self._masari_data_files) * .7)

		training_files = self._masari_data_files[:training_cutoff_index]
		testing_files = self._masari_data_files[training_cutoff_index:]

		self._training_data = DataChunk(self._load_section_of_data(training_files))
		self._training_data.process_data()
		self._testing_data = DataChunk(self._load_section_of_data(testing_files))
		self._testing_data.process_data()

		oc.print_success('Finished loading data.')

	def _load_section_of_data(self, files):
		"""Utility function for loading data."""
		data_instances = []
		c_processes = []
		for f in files:
			c_processes.append(CProcess(self._simulation_data_fetcher.executable_file_path, [f]))
		simulation_runner = ProcessManager(c_processes)
		results = simulation_runner.run_all_c_processes()
		for r in results:
			data_instances.append(DataInstance(r))
		return data_instances


project_builder = FinanceProjectBuilder()
