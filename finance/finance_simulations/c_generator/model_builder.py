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

		# Add requirements from the model.
		for library in self._model.required_libraries:
			self._libraries.append(library)
		for define_statement in self._model.required_define_statements:
			self._libraries.append([define_statement[0], define_statement[1]])

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
		self._create_file(True)

	def generate_testing_file(self, data_chunk):
		"""Generate the testing file."""
		data_chunk.set_needed_data(self)
		self._generate_base_file()
		self._create_file(False)

	def _generate_base_file(self):
		"""Generates the base file."""
		for l in self._libraries:
			if '<' in l:
				self.add_line('#include ' + l)
			else:
				self.add_line('#include "' + l + '"')
		for ds in self._define_statements:
			self.add_line('#define ' + ds[0] + ' ' + ds[1])
		for gd in self._global_data:
			self.add_lines(gd)

		self.add_lines(self.model._c_main_code.split('\n'))

	def _create_file(self, training):
		"""Creates this model file."""
		if training:
			file_path = self._training_path
		else:
			file_path = self._testing_path
		self._saved_path = file_path
		with open(file_path, 'w') as file_handler:
			for l in self._lines:
				file_handler.write(l)

	@property
	def saved_path(self):
		"""Returns the saved path of the file created."""
		return self._saved_path

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


