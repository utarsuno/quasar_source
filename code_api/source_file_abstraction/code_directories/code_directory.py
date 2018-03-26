# coding=utf-8

"""This module, code_directory.py, provides an abstraction to directories in code projects."""

from universal_code import useful_file_operations as ufo
from code_api.code_abstraction.code_chunk import CodeChunk
from code_api.source_file_abstraction.code_files.code_file import CodeFile
from code_api.source_file_abstraction.code_files.code_file import LoadedCodeFile
from code_api.source_file_abstraction.code_files.css_file import LoadedCSSFile
from code_api.source_file_abstraction.code_files.html_file import LoadedHTMLFile
from code_api.source_file_abstraction.code_files.js_file import LoadedJSFile
from code_api.source_file_abstraction.code_files.asset_file import JPGFile
from code_api.source_file_abstraction.code_files.asset_file import PNGFile


def get_code_file_type_from_file_extensions(combined_extensions):
	"""Returns the code file determined from the provided file extensions."""
	if '.css' in combined_extensions:
		return LoadedCSSFile
	if '.html' in combined_extensions:
		return LoadedHTMLFile
	if '.js' in combined_extensions:
		return LoadedJSFile
	if '.png' in combined_extensions:
		return PNGFile
	if '.jpg' in combined_extensions:
		return JPGFile
	else:
		print('TODODODO!@!!!!')
		exit()


class CodeDirectory(object):
	"""Provides an abstraction to code directories."""

	def __init__(self, directory_path):
		self._directory_path    = directory_path
		self._child_directories = []
		self._code_files        = []
		self._generatable       = True

		self._parent_directory = None

		self._safety_check_on_directory_path()

	def set_to_non_generatable(self):
		"""Sets this directory to one that can not be generated."""
		self._generatable = False

	def create_directory_if_needed(self):
		"""Creates the code directory if it does not exist."""
		if not ufo.does_directory_exist(self._directory_path):
			ufo.create_directory(self._directory_path)

	def add_loaded_code_file_and_assign_type(self, file_name, combined_extensions):
		"""Adds a loaded code file and assign and determines the type of language that the file is."""
		file_type = get_code_file_type_from_file_extensions(combined_extensions)
		code_file = file_type(file_name, combined_extensions)
		self._code_files.append(code_file)
		code_file.set_parent_code_directory(self)

	def add_code_file(self, code_file):
		"""Adds a code file to this code directory."""
		self._code_files.append(code_file)
		code_file.set_parent_code_directory(self)

	def set_parent_code_directory(self, code_directory):
		"""Sets the parent code directory of this code directory."""
		self._parent_directory = code_directory

	def add_child_code_directory(self, code_directory):
		"""Adds a child code directory."""
		code_directory.set_parent_code_directory(self)
		self._child_directories.append(code_directory)

	def add_new_child_code_directory_from_current_path(self, sub_directory_name, code_directory_type=None):
		"""Adds a new child CodeDirectory stemmed from the current directory path."""
		if code_directory_type is None:
			code_directory = CodeDirectory(self._directory_path + sub_directory_name)
		else:
			code_directory = code_directory_type(self._directory_path + sub_directory_name)

		code_directory.set_parent_code_directory(self)
		self.add_child_code_directory(code_directory)
		return code_directory

	def _safety_check_on_directory_path(self):
		"""Cleans up the directory path or throws an exception if it is non-cleanable."""
		if not self._directory_path.endswith('/'):
			self._directory_path += '/'
		# TODO : Raise exceptions for certain scenarios.

	def contains_directory(self, code_directory) -> bool:
		"""Returns a boolean if this code directory contains the provided code directory."""
		for cd in self._child_directories:
			if cd == code_directory:
				return True
		return False

	def __str__(self):
		return 'CodeDirectory:{' + ufo.get_last_directory_from_path(self.directory_path) + '}'

	@property
	def child_code_directories(self):
		"""Returns a list of all child code directories."""
		return self._child_directories

	@property
	def code_files(self):
		"""Returns a list of all code files in this directory."""
		return self._code_files

	@property
	def generatable(self) -> bool:
		"""Returns a boolean indicating if this code directory is generatable or not."""
		return self._generatable

	@property
	def parent_directory(self):
		"""Returns the parent code directory of this code directory."""
		return self._parent_directory

	@property
	def directory_path(self) -> str:
		"""Returns the directory path of this CodeDirectory."""
		return self._directory_path

	def get_all_code_files_recursively(self):
		"""Returns all the code files found in this directory and all child directories, recursively."""
		all_files = []
		for f in self._code_files:
			all_files.append(f)

		for cd in self._child_directories:
			child_files = cd.get_all_code_files_recursively()
			for cf in child_files:
				all_files.append(cf)

		return all_files

	def load_all_directories_and_content(self, extensions_to_ignore, loaded_code_file=True):
		"""Loads all the child directories of this directory, then does so recursively for all child directories."""
		# Load all the child files in this directory.
		all_files = ufo.get_all_file_paths_inside_directory(self.directory_path)
		for f in all_files:
			file_name = ufo.get_file_basename(f)
			extensions = ufo.get_file_extensions(file_name)

			skip_file = False
			for e in extensions:
				if e in extensions_to_ignore:
					skip_file = True
					break

			if not skip_file:
				combined_extensions = ''
				if len(extensions) > 0:
					for e in extensions:
						file_name = file_name.replace(e, '')
						combined_extensions += e

				if loaded_code_file:
					self.add_loaded_code_file_and_assign_type(file_name, combined_extensions)
				else:
					self.add_code_file(CodeFile(None, file_name, combined_extensions))

		# Load all the child directories in this directory.
		child_directory_paths = ufo.get_all_directory_paths_from_directory(self.directory_path)
		for cd in child_directory_paths:
			self.add_child_code_directory(CodeDirectory(cd))

		# Recursive step.
		for cd in self._child_directories:
			cd.load_all_directories_and_content(extensions_to_ignore, loaded_code_file)
