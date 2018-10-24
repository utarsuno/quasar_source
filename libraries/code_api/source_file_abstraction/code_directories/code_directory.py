# coding=utf-8

"""This module, code_directory.py, provides an abstraction to directories in code projects."""

from libraries.universal_code import useful_file_operations as ufo
from libraries.code_api.source_file_abstraction.code_files.css_file import LoadedCSSFile
from libraries.code_api.source_file_abstraction.code_files.html_file import LoadedHTMLFile
from libraries.code_api.source_file_abstraction.code_files.js_file import LoadedJSFile
from libraries.code_api.source_file_abstraction.code_files.asset_file import JPGFile
from libraries.code_api.source_file_abstraction.code_files.asset_file import PNGFile
from libraries.code_api.source_file_abstraction.code_files.asset_file import ShaderFragmentFile
from libraries.code_api.source_file_abstraction.code_files.asset_file import ShaderVertexFile
from libraries.code_api.source_file_abstraction.code_files.c_branches.header_file import HeaderFile
from libraries.code_api.source_file_abstraction.code_files.c_branches.cpp_file import CPPFile
from libraries.code_api.source_file_abstraction.code_files.docker.docker_file import DockerFile
from libraries.universal_code import debugging as dbg
from libraries.universal_code import output_coloring as oc


# Global TODO (s):
# this kind of line 'if not self._generated_output_directory.endswith('/'):' should be provided from universal_file_operations library


_FILE_EXTENSION_TO_FILE_CLASS_MAPPING = {
	'.css'  : LoadedCSSFile,
	'.html' : LoadedHTMLFile,
	'.js'   : LoadedJSFile,
	'.png'  : PNGFile,
	'.jpg'  : JPGFile,
	'.frag' : ShaderFragmentFile,
	'.vert' : ShaderVertexFile,
	'.cpp'  : CPPFile,
	'.h'    : HeaderFile,
}


class CodeDirectory(object):
	"""Provides an abstraction to code directories."""

	def __init__(self, directory_path: str, base_directory=False, generated_output_directory=None):
		# ----- Information about this object ---------
		self._is_base_directory             = base_directory
		self._directory_path                = None
		self.directory_path                 = directory_path
		self._code_files                    = []
		self._cache_code_files_needs_update = True
		self._generated_output_directory    = None
		self.generated_output_directory     = generated_output_directory
		# ----- Linked directories meta-data ----------
		self._children                      = []
		self._parent                        = None
		self._directories_external          = []
		# ----- Information used for loading only -----
		self._has_loaded                    = False
		self._file_extensions_to_ignore     = []
		self._file_extensions_to_match      = []
		self._file_names_to_ignore          = []
		self._file_names_to_match           = []
		self._file_names_partial_to_ignore  = []
		self._file_names_partial_to_match   = []
		# TODO: refactor later
		self._all_files                     = []

	# ---------------------------------------------- O P E R A T I O N S ----------------------------------------------
	# TODO: Refactor this?
	def add_code_file(self, code_file):
		"""Adds a code file to this code directory."""
		self._code_files.append(code_file)
		code_file.set_parent_code_directory(self)

	def add_loaded_code_file_and_assign_type(self, file_name, extensions):
		"""Adds a loaded code file and assign and determines the type of language that the file is."""
		file_type = None
		for extension in extensions:
			if extension in _FILE_EXTENSION_TO_FILE_CLASS_MAPPING:
				file_type = _FILE_EXTENSION_TO_FILE_CLASS_MAPPING[extension]
				break

		if file_type is None:
			if 'Dockerfile' in file_name:
				file_type = DockerFile

		if file_type is None:
			oc.print_data_with_red_dashes_at_start('File name {' + str(file_name) + '}')
			oc.print_data_with_red_dashes_at_start('File extensions {' + str(extensions) + '}')
			dbg.raise_exception('Unable to find file type!')

		code_file = file_type(file_name, ''.join(extensions))
		self._code_files.append(code_file)
		code_file.set_parent_code_directory(self)

	def add_child_code_directory(self, code_directory):
		"""Adds a child code directory."""
		code_directory.set_parent(self)
		self._children.append(code_directory)

	def add_external_code_directory(self, code_directory):
		"""Adds an external code directory."""
		if type(code_directory) == str:
			cd = CodeDirectory(code_directory, base_directory=False)
		else:
			cd = code_directory

		cd.set_parent(self)
		self._directories_external.append(cd)
		self._cache_code_files_needs_update = True

	def add_new_child_code_directory_from_current_path(self, sub_directory_name, code_directory_type=None):
		"""Adds a new child CodeDirectory stemmed from the current directory path."""
		if code_directory_type is None:
			code_directory = CodeDirectory(self._directory_path + sub_directory_name)
		else:
			code_directory = code_directory_type(self._directory_path + sub_directory_name)

		code_directory.set_parent(self)
		self.add_child_code_directory(code_directory)
		return code_directory

	def _load_all_content(self):
		"""Loads all internal content then the child directories of this directory, then does so recursively for all child directories."""

		all_files = ufo.directory_get_all_internal_file_paths(self.directory_path)
		for f in all_files:
			file_name  = ufo.file_get_basename(f)
			extensions = ufo.file_get_extensions(file_name)

			ignore_file  = False
			file_matched = False

			extensions_to_ignore = self.file_extensions_to_ignore
			for e in extensions:
				if e in extensions_to_ignore:
					ignore_file = True
					break

			if not ignore_file:
				file_names_to_ignore = self.file_names_to_ignore
				if file_name in file_names_to_ignore:
					ignore_file = True

			if not ignore_file:
				file_names_partial_to_ignore = self.file_names_partial_to_ignore
				for partial_match in file_names_partial_to_ignore:
					if file_name in partial_match:
						ignore_file = True
						break

			# If the file is not ignored, try finding a match for it.
			if not ignore_file:
				extensions_to_match = self.file_extensions_to_match
				for e in extensions:
					if e in extensions_to_match:
						file_matched = True
						break

				if not file_matched:
					file_names_to_match = self.file_names_to_match
					for fn in file_names_to_match:
						if file_name == fn:
							file_matched = True
							break

				if not file_matched:
					file_names_partial_to_match = self.file_names_partial_to_match
					for fn in file_names_partial_to_match:
						if file_name in fn:
							file_matched = True
							break

			if not ignore_file and file_matched:
				file_name_without_extensions = file_name.replace(''.join(extensions), '')
				self.add_loaded_code_file_and_assign_type(file_name_without_extensions, extensions)

		# Load any external directories.
		for external_directory in self._directories_external:
			external_directory._load_all_content()

		# Load all the child directories in this directory.
		child_directory_paths = ufo.directory_get_all_internal_directory_paths(self.directory_path)
		for cd in child_directory_paths:
			self.add_child_code_directory(CodeDirectory(cd, base_directory=False))

		for cd in self._children:
			cd._load_all_content()

	def _load_all_files(self):
		"""Loads all files (recursively) into this Directory."""
		for f in self._code_files:
			self._all_files.append(f)

		for cd in self._directories_external:
			files = cd.get_all_files()
			for f in files:
				self._all_files.append(f)

		for cd in self._children:
			child_files = cd.get_all_files()
			for cf in child_files:
				self._all_files.append(cf)

	def _check_if_cache_needs_update(self):
		"""Re-caches information."""
		if self._cache_code_files_needs_update:
			self._cache_code_files_needs_update = False
			self._all_files                     = []
			self._code_files                    = []
			self._children                      = []
			self._load_all_content()
			self._load_all_files()

	# ------------------------------------------------- G E T T E R S -------------------------------------------------

	def __str__(self):
		return 'CodeDirectory:{' + ufo.directory_get_basename(self.directory_path) + '}'

	# TODO: Remove this?
	#@property
	#def code_files(self):
	#	"""Returns a list of all code files in this directory."""
	#	return self._code_files

	@property
	def directory_path(self) -> str:
		"""Returns the directory path of this CodeDirectory."""
		return self._directory_path

	@property
	def child_code_directories(self):
		"""Returns a list of all child code directories."""
		return self._children

	@property
	def parent(self):
		"""Returns the parent code directory of this code directory."""
		return self._parent

	@property
	def generated_output_directory(self) -> str:
		"""Returns the directory path of generated output (for this particular CodeDirectory)."""
		return self._generated_output_directory

	def contains_directory(self, code_directory) -> bool:
		"""Returns a boolean if this code directory contains the provided code directory."""
		for cd in self._children:
			if cd == code_directory:
				return True
		return False

	def get_file_by_full_name(self, full_name: str):
		"""Returns a file by full name + extensions match."""
		self._check_if_cache_needs_update()
		for f in self._all_files:
			if full_name in f.file_name_with_extension:
				return f

	def get_file_by_name(self, name: str):
		"""Returns a file by name match."""
		self._check_if_cache_needs_update()
		for f in self._all_files:
			if name in f.file_name:
				return f

	def get_all_files(self):
		"""Returns all the code files found in this directory and all child directories, recursively."""
		self._check_if_cache_needs_update()
		return self._all_files

	@property
	def file_extensions_to_ignore(self) -> list:
		"""Returns the extensions to ignore for this directory. If not set, value is grabbed from the parent."""
		if len(self._file_extensions_to_ignore) == 0 and not self._is_base_directory:
			return self._parent.file_extensions_to_ignore
		return self._file_extensions_to_ignore

	@property
	def file_extensions_to_match(self) -> list:
		"""Returns the extensions to match for this directory. If not set, value is grabbed from the parent."""
		if len(self._file_extensions_to_match) == 0 and not self._is_base_directory:
			return self._parent.file_extensions_to_match
		return self._file_extensions_to_match

	@property
	def file_names_to_ignore(self) -> list:
		"""Returns the file names to ignore for this directory. If not set, value is grabbed from the parent."""
		if len(self._file_names_to_ignore) == 0 and not self._is_base_directory:
			return self._parent.file_names_to_ignore
		return self._file_names_to_ignore

	@property
	def file_names_to_match(self) -> list:
		"""Returns the file names to match for this directory. If not set, value is grabbed from the parent."""
		if len(self._file_names_to_match) == 0 and not self._is_base_directory:
			return self._parent.file_names_to_match
		return self._file_names_to_match

	@property
	def file_names_partial_to_ignore(self) -> list:
		"""Returns the partial file names to ignore for this directory. If not set, value is grabbed from the parent."""
		if len(self._file_names_partial_to_ignore) == 0 and not self._is_base_directory:
			return self._parent.file_names_partial_to_ignore
		return self._file_names_partial_to_ignore

	@property
	def file_names_partial_to_match(self) -> list:
		"""Returns the partial file names to match for this directory. If not set, value is grabbed from the parent."""
		if len(self._file_names_partial_to_match) == 0 and not self._is_base_directory:
			return self._parent.file_names_partial_to_match
		return self._file_names_partial_to_match

	# ------------------------------------------------- S E T T E R S -------------------------------------------------
	def set_parent(self, code_directory) -> None:
		"""Sets the parent code directory of this code directory."""
		self._parent = code_directory

	@generated_output_directory.setter
	def generated_output_directory(self, path: str) -> None:
		"""Sets the output directory path."""
		if path is not None:
			self._generated_output_directory = path
			if not self._generated_output_directory.endswith('/'):
				self._generated_output_directory += '/'

	@directory_path.setter
	def directory_path(self, path: str) -> None:
		"""Sets the directory path."""
		self._directory_path = path
		if not self._directory_path.endswith('/'):
			self._directory_path += '/'

	def add_extension_to_ignore(self, file_extension: str) -> None:
		"""Adds a file extension to be ignored (not loaded)."""
		if '.' not in file_extension:
			file_extension = '.' + file_extension
		if file_extension not in self._file_extensions_to_ignore:
			self._file_extensions_to_ignore.append(file_extension)

	def add_extensions_to_ignore(self, file_extensions: list) -> None:
		"""Adds a list of file extensions to be ignored (not loaded)."""
		for extension in file_extensions:
			self.add_extension_to_ignore(extension)

	def add_file_name_to_ignore(self, file_name: str) -> None:
		"""Adds a file name to be ignored (not loaded)."""
		if file_name not in self._file_names_to_ignore:
			self._file_names_to_ignore.append(file_name)

	def add_file_names_to_ignore(self, file_names: list) -> None:
		"""Adds a list of file names to be ignored (not loaded)."""
		for file_name in file_names:
			self.add_file_name_to_ignore(file_name)

	def add_file_name_partial_to_ignore(self, file_name_partial_match: str) -> None:
		"""Adds a partial file name to be ignored (not loaded)."""
		if file_name_partial_match not in self._file_names_partial_to_ignore:
			self._file_names_partial_to_ignore.append(file_name_partial_match)

	def add_file_names_partial_to_ignore(self, file_name_partial_match: str) -> None:
		"""Adds a list of partial file names to be ignored (not loaded)."""
		for file_name in file_name_partial_match:
			self.add_file_name_partial_to_ignore(file_name)

	def add_extension_to_match(self, file_extension: str) -> None:
		"""Adds a file extension to be matched (loaded)."""
		if '.' not in file_extension:
			file_extension = '.' + file_extension
		if file_extension not in self._file_extensions_to_match:
			self._file_extensions_to_match.append(file_extension)

	def add_extensions_to_match(self, file_extensions: list) -> None:
		"""Adds a list of file extensions to be matched (loaded)."""
		for extension in file_extensions:
			self.add_extension_to_match(extension)

	def add_file_name_to_match(self, file_name: str) -> None:
		"""Adds a file name to be matched (loaded)."""
		if file_name not in self._file_names_to_match:
			self._file_names_to_match.append(file_name)

	def add_file_names_to_match(self, file_names: list) -> None:
		"""Adds a list of file names to be matched (loaded)."""
		for file_name in file_names:
			self.add_file_name_to_match(file_name)

	def add_file_name_partial_to_match(self, file_name_partial: str) -> None:
		"""Adds a partial file name to be matched (loaded)."""
		if file_name_partial not in self._file_names_partial_to_match:
			self._file_names_partial_to_match.append(file_name_partial)

	def add_file_names_partial_to_match(self, file_names_partial: list) -> None:
		"""Adds a list of partial file names to be matched (loaded)."""
		for file_name in file_names_partial:
			self.add_file_name_partial_to_match(file_name)



