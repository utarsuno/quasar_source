# coding=utf-8

"""This module, shell_file.py, provides an abstraction to shell files."""

from code_api.source_file_abstraction.code_files.code_file import *
from code_api.code_abstraction.code_section import *
from universal_code import useful_file_operations as ufo

CODE_SECTION_BASH_STATEMENT = 'bash_statement'
CODE_SECTION_LIBRARY_IMPORTS = 'library_imports'


class ShellLibrary(CodeFile):
	"""Represents a single shell library file."""

	def __init__(self, file_name):
		super().__init__(CODE_FILE_TYPE_SHELL_SCRIPT, file_name)
		self._file_extension = '.sh'


class ShellFile(CodeFile):
	"""Represents a single shell file."""

	def __init__(self, file_name):
		super().__init__(CODE_FILE_TYPE_SHELL_SCRIPT, file_name)
		self._file_extension = '.sh'

		self._required_libraries = []

	def add_required_library(self, shell_library):
		"""Adds a required shell library to this shell file."""
		self._required_libraries.append(shell_library)

	'''___         ___     __   ___       ___  __       ___    __
	  |__  | |    |__     / _` |__  |\ | |__  |__)  /\   |  | /  \ |\ |
	  |    | |___ |___    \__> |___ | \| |___ |  \ /~~\  |  | \__/ | \| '''
	def generate_file_code(self):
		"""Generates the file code of this shell file."""
		self._initialize_for_code_generation()

		bash_section = self.get_code_section(CODE_SECTION_BASH_STATEMENT)
		bash_section.add_code_chunk(CodeChunk(['#!/bin/bash']))

		library_section = self.get_code_section(CODE_SECTION_LIBRARY_IMPORTS)
		library_code_chunks = self._get_code_chunks_from_required_libraries()
		for lcc in library_code_chunks:
			library_section.add_code_chunk(lcc)

	def _initialize_for_code_generation(self):
		"""Utility function."""
		if len(self._code_sections) == 0:
			self.add_code_section(CodeSection(CODE_SECTION_BASH_STATEMENT))
			self.add_code_section(CodeSection(CODE_SECTION_LIBRARY_IMPORTS))

	def _get_code_chunks_from_required_libraries(self):
		"""Returns all code chunks from required linked libraries."""
		code_chunks = []

		for lib in self._required_libraries:
			# Part (1/2) - variable that holds path to the library.
			library_parent_directory_path = lib._parent_code_directory.parent_directory.directory_path
			directory_distance = library_parent_directory_path.count('/')
			library_directory_name = ufo.get_last_directory_from_path(lib._parent_code_directory.directory_path)

			variable_library_name = 'PATH_TO_LIBRARY_' + lib.file_name.upper()

			variable_declaration = 'ARG0=`echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" | cut -f1-ARG1 -d"/"`ARG2'
			variable_declaration = variable_declaration.replace('ARG0', variable_library_name)
			variable_declaration = variable_declaration.replace('ARG1', str(directory_distance))
			variable_declaration = variable_declaration.replace('ARG2', '/' + library_directory_name + '/' + lib.file_name_with_extension)

			# Part (2/2) - source statement to import the library.
			source_statement = 'source ${' + variable_library_name + '}'

			code_chunk = CodeChunk([variable_declaration, source_statement])
			code_chunks.append(code_chunk)

		return code_chunks





# DIR=`echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" | cut -f1-6 -d"/"`/libraries/script_utilities.sh

# /Users/utarsuno/git_repos/quasar_source/all_scripts/libraries/script_utilities.sh



'''

#!/usr/bin/env bash

DIR=`echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" | cut -f1-6 -d"/"`/libraries/script_utilities.sh


echo ${DIR}

#SUB_DIR=`echo ${DIR} | cut -f1-6 -d"/"`

#echo ${DIR}
#echo ${SUB_DIR}

#source ${SUB_DIR}/libraries/script_utilities.sh

'''