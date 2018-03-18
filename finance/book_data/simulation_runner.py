# coding=utf-8

"""This module, simulation_runner.py, runs c calculations."""

from universal_code import useful_file_operations as ufo
from universal_code import path_manager as pm

from c_processes import c_process
from c_processes import c_process_manager


def get_all_masari_data_file_paths():
	"""Returns a list of a all the masari data file paths."""

	file_names = ufo.get_all_file_names_inside_directory(pm.FINANCE_PATH_TO_MASARI_DATA)
	file_numbers = [int(x) for x in file_names]
	file_numbers.sort()

	index = 0
	for fn in file_numbers:
		index += 1
		print(fn)

	sub_program = c_process.CProcess('/home/databoi/finance/quick_test', [str(index)])
	#print('Program output!')
	#print(sub_program.get_putput())



programs_to_test = []
i = 0
while i < 40:
	programs_to_test.append(c_process.CProcess('/home/git_repos/quasar_source/finance/book_data/c/a.out', [str(i)]))
	i += 1

process_manager = c_process_manager.ProcessManager(programs_to_test)
process_manager.run_all_c_processes()
print('SIMULATION DONE?')