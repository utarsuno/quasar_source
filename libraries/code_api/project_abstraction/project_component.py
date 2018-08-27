# coding=utf-8

"""This module, project_component.py, provides an abstraction to discrete project components."""

from libraries.universal_code import output_coloring as oc
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory


class ProjectComponent(object):
	"""Provides an abstraction to a discrete component of a project."""

	def __init__(self, component_name):
		self._component_name        = component_name
		self._base_code_directories = []
		self._tags                  = []
		self._content_loaded        = False

		self._extensions_to_ignore  = []
		self._file_name_matches_to_ignore = []

		self._generated_files_path = None

	def set_generated_file_path(self, p):
		"""Sets the base path for generated files to be placed into."""
		self._generated_files_path = p

	def add_file_name_match_to_ignore(self, file_name_match):
		"""Adds a file name match to be ignored by this project component."""
		self._file_name_matches_to_ignore.append(file_name_match)

	def add_extension_to_ignore(self, file_extension):
		"""Adds a file extension to be ignored by this project component."""
		self._extensions_to_ignore.append(file_extension)

	def add_extensions_to_ignore(self, file_extension_list):
		"""Adds a list of file extensions to be ignored by this project component."""
		for f in file_extension_list:
			self.add_extension_to_ignore(f)

	def add_base_code_directory(self, code_directory):
		"""Adds a code directory to this project component."""
		if type(code_directory) == CodeDirectory:
			self._base_code_directories.append(code_directory)
		else:
			self._base_code_directories.append(CodeDirectory(code_directory))

	def add_tag(self, tag):
		"""Adds a tag to this project component."""
		self._tags.append(tag)

	def add_tags(self, list_of_tags):
		"""Adds multiple tags to this project component."""
		for tag in list_of_tags:
			self.add_tag(tag)

	def has_tag(self, tag):
		"""Returns a boolean indicating if this component has the provided tag."""
		return tag in self._tags

	def has_tags(self, list_of_tags):
		"""Returns a boolean indicating if this component has all the provided tags."""
		for tag in list_of_tags:
			if tag not in self._tags:
				return False
		return True

	def __str__(self):
		return 'ProjectComponent(' + self._component_name + ')'

	def load_all_content(self):
		"""Loads all the content from the base code directories."""
		for bcd in self._base_code_directories:
			bcd.load_all_directories_and_content(self._extensions_to_ignore, self._file_name_matches_to_ignore)

	def minify_and_gzip_files(self):
		"""Minifies the files and then g-zips that output."""
		y = 2

	@property
	def number_of_files(self):
		"""Returns the number of files in this project component."""
		y = 2
		# TODO : !!!!

	@property
	def base_code_directories(self):
		"""Returns a list of all the base code directories."""
		return self._base_code_directories

	@property
	def all_files(self):
		"""Returns all the files in this project component."""
		files = []
		for bcd in self._base_code_directories:
			base_directory_files = bcd.get_all_code_files_recursively()
			for cf in base_directory_files:
				files.append(cf)
		return files

	def get_file_by_full_name(self, full_name):
		"""Returns a file by full name + ending match."""
		files = self.all_files
		for f in files:
			if full_name in f.file_name_with_extension:
				return f

	def get_file_by_name(self, name):
		"""Returns a file by name match."""
		files = self.all_files
		for f in files:
			if name in f.file_name:
				return f

	def print_general_information(self):
		"""Prints general information regarding this project component."""
		oc.print_title(str(self))
		oc.print_data_with_red_dashes_at_start('TODO: print component information!')

		# Sections to print about. (# files, # lines of code, size)

		# Generated files
		# Original files vs reduced files
		# Language breakdown? Directory information?



		#files = self.all_files
		#oc.print_data_with_red_dashes_at_start('Generated Files : ' + str(len(files)))
		#oc.print_data_with_red_dashes_at_start('Number of files : ' + str(len(files)))
		#print('yo')
		'''
		oc.print_title('all_scripts')
		files = self._script_component.all_files
		oc.print_data_with_red_dashes_at_start('Number of files : ' + str(len(files)))
		oc.print_data_with_red_dashes_at_start('Number of files : ' + str(len(files)))
		#print(self._script_component)
		for f in files:
			print(f.file_size)
			print(f.get_number_of_code_lines)
			#print(type(f))
		'''
