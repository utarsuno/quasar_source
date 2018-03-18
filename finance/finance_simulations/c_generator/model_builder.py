# coding=utf-8

"""This document, model_builder.py, builds the base for a c model source file."""

from finance.finance_simulations.c_generator.data import data_instance


class ModelBuilder(object):
	"""Builds the base of a model c program file."""

	def __init__(self, model, save_path):
		self._model = model
		self._save_path = save_path + self._model.file_name
		self._training_path = save_path + self._model.file_name.replace('.c', '_training.c')
		self._testing_path = save_path + self._model.file_name.replace('.c', '_testing.c')

		self._libraries = []
		self._define_statements = []
		self._global_data = []

		self._lines = []

	def add_library(self, library):
		"""Adds a library to this model."""
		self._libraries.append(library)

	def add_define(self, d, v):
		"""Adds a define statement."""
		self._define_statements.append([str(d), str(v)])

	def add_global_data(self, global_data):
		"""Adds global data."""
		self._global_data.append(global_data)

	def add_line(self, s: str):
		"""Adds a line of c code."""
		if '\n' not in s:
			s += '\n'
		self._lines.append(s)

	def add_lines(self, s):
		"""Adds lines of c code."""
		if type(s) == str:
			s = s.split('\n')
		for l in s:
			self.add_line(l)

	def generate_training_file(self, data_chunk):
		"""Generate the training file."""
		data_chunk.set_needed_data(self)
		self._generate_base_file()
		self._create_file()

	def generate_testing_file(self, data_chunk):
		"""Generate the testing file."""
		data_chunk.set_needed_data(self)
		self._generate_base_file()
		self._create_file()

	def _generate_base_file(self):
		"""Generates the base file."""
		for l in self._libraries:
			self.add_line('#include "' + l + '"')
		for ds in self._define_statements:
			self.add_line('#define ' + ds[0] + ' ' + ds[1])
		for gd in self._global_data:
			self.add_lines(gd)

	def _create_file(self):
		"""Creates this model file."""
		with open(self._save_path, 'w') as file_handler:
			for l in self._lines:
				file_handler.write(l)

	@property
	def model(self):
		"""Returns the model that this model builder is building off of."""
		return self._model

	'''
	def __str__(self):
		s = ''
		for l in self._lines:
			s += l
		return s
	'''
