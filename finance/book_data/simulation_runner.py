# coding=utf-8

"""This module, simulation_runner.py, runs c calculations."""

from universal_code import useful_file_operations as ufo
from universal_code import path_manager as pm



def get_all_masari_data_file_paths():
	"""Returns a list of a all the masari data file paths."""

	file_names = ufo.get_all_file_names_inside_directory(pm.FINANCE_PATH_TO_MASARI_DATA)

	for fn in file_names:
		print(str(fn) + '\t' + str(type(fn)))

	print('There are {' + str(len(file_names)) + '} files.')

get_all_masari_data_file_paths()