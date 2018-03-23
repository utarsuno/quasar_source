# coding=utf-8

"""This module, project_component.py, provides an abstraction to discrete project components."""


class ProjectComponent(object):
	"""Provides an abstraction to a discrete component of a project."""

	def __init__(self, component_name):
		self._component_name 	    = component_name
		self._base_code_directories = []
		self._tags                  = []
		self._content_loaded		= False

		self._extensions_to_ignore  = []

	def add_extension_to_ignore(self, file_extension):
		"""Adds a file extension to be ignored by this project component."""
		self._extensions_to_ignore.append(file_extension)

	def add_base_code_directory(self, code_directory):
		"""Adds a code directory to this project component."""
		self._base_code_directories.append(code_directory)

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
			bcd.load_all_directories_and_content(self._extensions_to_ignore)

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

	def get_file_by_name(self, name):
		"""Returns a file by name match."""
		files = self.all_files
		for f in files:
			if name in f.file_name:
				return f
