# coding=utf-8

"""This module, quasar_generation.py, generates all generated portions of Quasar."""


from universal_code import output_coloring as oc


class QuasarGeneration(object):
	"""Utility object for creating all Quasar generatable components."""

	def __init__(self, generatable_scripts_component):
		self._scripts_component = generatable_scripts_component

	def generate(self):
		"""Generates the generatable scripts."""
		oc.print_data('Generating {' + str(self._scripts_component) + '}')

		base_code_directories = self._scripts_component.base_code_directories
		for bcd in base_code_directories:
			if bcd.generatable:
				self._generate_code_directory_recursively(bcd)

	def _generate_code_directory_recursively(self, code_directory):
		"""Generates this code directory, it's contents, and do the same for ALL child directories."""
		oc.print_green('\tgenerating directory{' + str(code_directory) + '}')
		code_directory.create_directory_if_needed()

		# Generate all code files needed.
		all_code_files = code_directory.code_files
		for code_file in all_code_files:
			self._generate_code_file(code_file)

		# Now generate all child code directories.
		all_child_directories = code_directory.child_code_directories
		for child_directory in all_child_directories:
			if child_directory.generatable:
				self._generate_code_directory_recursively(child_directory)

	def _generate_code_file(self, code_file):
		"""Generates the specified code file."""
		oc.print_pink('\t\tgenerating{' + str(code_file) + '}')
		code_file.generate_file_code()
		code_file.create_or_update_file()

