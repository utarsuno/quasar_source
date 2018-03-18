# coding=utf-8

"""This module, basic_simulation.py, runs a basic simulation through the data."""


from finance.project_management import finance_projects_builder as finance
from c_processes.c_process import CProcess
from c_processes.c_process_manager import ProcessManager
from finance.finance_simulations.data_instance import DataInstance
from finance.finance_simulations.c_data_generator.data_instance_to_c_code import get_c_code_from_list_of_data_instances
from finance.finance_simulations.models.m0_net_resistance import FinanceModel_M0
from universal_code import useful_file_operations as ufo


class BasicSimulation(object):
	"""Handles the running of basic simulations."""

	def __init__(self):
		self._masari_data_files = []
		self._training_files = None
		self._testing_files  = None

		self._c_processes = []
		self.simulation_runner = None
		self._data_instances = []

	def parse_all_masari_data_files(self):
		"""Gets a list of all the masari data files."""
		self._masari_data_files = sorted(finance.ALL_MASARI_DATA_FILES)

		training_cutoff_index = int(len(self._masari_data_files) * .7)

		#self._training_files = self._masari_data_files[:training_cutoff_index]
		#self._testing_files = self._masari_data_files[training_cutoff_index:]

		for f in self._masari_data_files:
			self._c_processes.append(CProcess(finance.PROJECT_SIMULATION_DATA_FETCHER.executable_file_path, [f]))

		self.simulation_runner = ProcessManager(self._c_processes)
		results = self.simulation_runner.run_all_c_processes()

		for r in results:
			self._data_instances.append(DataInstance(r))

		# TEMPORARY_SAVING_PATH
		file_c_code = get_c_code_from_list_of_data_instances(self._data_instances, FinanceModel_M0())
		lines = file_c_code.split('\n')
		with open(finance.TEMPORARY_SAVING_PATH, 'w') as file_handler:
			for l in lines:
				file_handler.write(l)
		



b = BasicSimulation()
b.parse_all_masari_data_files()


