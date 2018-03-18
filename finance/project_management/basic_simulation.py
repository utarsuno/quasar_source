# coding=utf-8

"""This module, basic_simulation.py, runs a basic simulation through the data."""


from finance.project_management import finance_projects_builder as finance


class BasicSimulation(object):
	"""Handles the running of basic simulations."""

	def __init__(self):
		self._masari_data_files = []

	def get_all_masari_data_files(self):
		"""Gets a list of all the masari data files."""
		self._masari_data_files = sorted(finance.ALL_MASARI_DATA_FILES)
		#for f in self._masari_data_files:
		#	print(f)
		print(len(self._masari_data_files))


b = BasicSimulation()
b.get_all_masari_data_files()
