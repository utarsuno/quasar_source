# coding=utf-8

"""This module, shell_file.py, provides an abstraction to shell files."""

from code_api.source_file_abstraction.code_files.code_file import *
from code_api.code_abstraction.code_section import *
from code_api.code_abstraction.ascii_comments import get_shell_ascii_comment_as_code_chunk
from code_api.source_file_abstraction.code_directory import *
from universal_code import useful_file_operations as ufo
from universal_code.time_abstraction.day_instance import *

CODE_SECTION_BASH_STATEMENT   = 'bash_statement'
CODE_SECTION_GENERATION_NOTES = 'generation_notes'
CODE_SECTION_LIBRARY_IMPORTS  = 'library_imports'
CODE_SECTION_SCRIPT_START     = 'script_start'
CODE_SECTION_SAFETY_CHECKS    = 'safety_checks'
CODE_SECTION_VARIABLES        = 'variables'
CODE_SECTION_MAIN             = 'main'
CODE_SECTION_SCRIPT_END       = 'script_end'


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
		self._main_code_chunk = None
		self._required_libraries = []
		self._required_safety_checks = []
		self._required_variable_setters = []

		self._treat_paths_as_server_paths = False

	def treat_paths_as_server_paths(self):
		"""Treats paths as server paths instead of local."""
		self._treat_paths_as_server_paths = True

	def set_main_code(self, code_chunk):
		"""Sets the main code chunk for this shell file."""
		self._main_code_chunk = code_chunk

	def add_required_library(self, shell_library):
		"""Adds a required shell library to this shell file."""
		self._required_libraries.append(shell_library)

	def add_required_safety_check(self, safety_check):
		"""Adds a required safety check to this shell file."""
		self._required_safety_checks.append(safety_check)

	def add_safety_check_for_script_arguments(self, arguments_needed: list):
		"""Adds a safety check for ensuring the script got the required passed in arguments."""
		code = CodeChunk()
		code.add_line_of_code('if [ "$#" -ne 1 ]; then')

		number_of_arguments = str(len(arguments_needed))

		string_of_all_arguments = '['
		for arg in arguments_needed:
			string_of_all_arguments += arg + ', '
		string_of_all_arguments = string_of_all_arguments[:-2] + ']'

		error_line = '\tterminate_script "The script{'
		error_line += self.file_name_with_extension + '} requires exactly{' + number_of_arguments
		error_line += '} arguments. They are ' + string_of_all_arguments + '."'

		code.add_line_of_code(error_line)
		code.add_line_of_code('fi')
		self.add_required_safety_check(code)

	def add_required_variable_setters(self, variable_setters):
		"""Adds a required variable setter to this shell file."""
		self._required_variable_setters.append(variable_setters)

	'''___         ___     __   ___       ___  __       ___    __
	  |__  | |    |__     / _` |__  |\ | |__  |__)  /\   |  | /  \ |\ |
	  |    | |___ |___    \__> |___ | \| |___ |  \ /~~\  |  | \__/ | \| '''
	def generate_file_code(self):
		"""Generates the file code of this shell file."""
		self._initialize_for_code_generation()

		self._generate_section_bash()
		self._generate_section_generation_notes()
		self._generate_section_library_imports()
		self._generate_section_script_start()
		self._generate_section_safety_checks()
		self._generate_section_variables()
		self._generate_section_main()
		self._generate_section_script_end()

		self._add_empty_line_after_every_script_section()

	def _add_empty_line_after_every_script_section(self):
		"""Adds an empty line after every code section."""
		for code_section in self._code_sections:
			if not code_section.empty:
				code_section._code_chunks[-1].add_line_of_code('')

	def _initialize_for_code_generation(self):
		"""Utility function."""
		if len(self._code_sections) == 0:
			self.add_code_section(CodeSection(CODE_SECTION_BASH_STATEMENT))
			self.add_code_section(CodeSection(CODE_SECTION_GENERATION_NOTES))
			self.add_code_section(CodeSection(CODE_SECTION_LIBRARY_IMPORTS))
			self.add_code_section(CodeSection(CODE_SECTION_SCRIPT_START))
			self.add_code_section(CodeSection(CODE_SECTION_SAFETY_CHECKS))
			self.add_code_section(CodeSection(CODE_SECTION_VARIABLES))
			self.add_code_section(CodeSection(CODE_SECTION_MAIN))
			self.add_code_section(CodeSection(CODE_SECTION_SCRIPT_END))

		# TODO : Might need to reset any generated code here.

	def _generate_section_bash(self):
		"""Generates the code needed for the bash section."""
		section = self.get_code_section(CODE_SECTION_BASH_STATEMENT)
		section.add_code_chunk(CodeChunk(['#!/bin/bash']))

	def _generate_section_generation_notes(self):
		"""Generates the code needed for the generation notes section."""
		section = self.get_code_section(CODE_SECTION_GENERATION_NOTES)

		generation_notes = get_shell_ascii_comment_as_code_chunk('generation notes')
		day_instance = DayInstance(TIME_TYPE_DAY_CURRENT)
		generation_notes.add_line_of_code('# LAST_GENERATED : {' + str(day_instance) + '}')

		section.add_code_chunk(generation_notes)

	def _generate_section_library_imports(self):
		"""Generates the code needed for the library import section."""
		section = self.get_code_section(CODE_SECTION_LIBRARY_IMPORTS)

		if type(self._parent_code_directory) == ShellDirectory:
			all_required_libraries = self._parent_code_directory.get_all_required_libraries()
			for required_library in all_required_libraries:
				self._required_libraries.append(required_library)

		library_code_chunks = self._get_code_chunks_from_required_libraries()

		for lcc in library_code_chunks:
			section.add_code_chunk(lcc)

		if not section.empty:
			section.add_code_chunk_at_start(get_shell_ascii_comment_as_code_chunk('library imports'))

	def _get_code_chunks_from_required_libraries(self):
		"""Returns all code chunks from required linked libraries."""
		code_chunks = []

		for lib in self._required_libraries:
			# Part (1/2) - variable that holds path to the library.
			library_parent_directory_path = lib._parent_code_directory.parent_directory.directory_path

			if self._treat_paths_as_server_paths:
				library_parent_directory_path = library_parent_directory_path.replace('/Users/utarsuno/', '/home/')

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

	def _generate_section_script_start(self):
		"""Generates the code needed for the script start section."""
		section_script_start = self.get_code_section(CODE_SECTION_SCRIPT_START)

		ascii_comment = get_shell_ascii_comment_as_code_chunk('script start')
		section_script_start.add_code_chunk(ascii_comment)

		line = 'print_dashed_line_with_text "script{' + self.file_name_with_extension + '} start on {${CURRENT_USER}-${HOST_NAME}}."'

		section_script_start.add_code_chunk(CodeChunk([line]))

	def _generate_section_safety_checks(self):
		"""Generates the code needed for the script safety checks section."""
		section = self.get_code_section(CODE_SECTION_SAFETY_CHECKS)

		# Add any shell safety checks from the parent code directory (if it has any).
		if type(self._parent_code_directory) == ShellDirectory:
			directory_mandated_safety_checks_as_code_chunk = self._parent_code_directory.get_code_chunk_with_all_required_safety_checks()
			section.add_code_chunk(directory_mandated_safety_checks_as_code_chunk)

		# Add any script arguments check needed.
		for sc in self._required_safety_checks:
			section.add_code_chunk(sc)

		if not section.empty:
			section.add_code_chunk_at_start(get_shell_ascii_comment_as_code_chunk('safety checks'))

	def _generate_section_variables(self):
		"""Generates the code needed for the script variables section."""
		section = self.get_code_section(CODE_SECTION_VARIABLES)

		for vs in self._required_variable_setters:
			section.add_code_chunk(vs)

		if not section.empty:
			section.add_code_chunk_at_start(get_shell_ascii_comment_as_code_chunk('variables setting'))

	def _generate_section_main(self):
		"""Generates the main code section."""
		section = self.get_code_section(CODE_SECTION_MAIN)
		section.add_code_chunk(get_shell_ascii_comment_as_code_chunk('main code'))
		section.add_code_chunk(self._main_code_chunk)

	def _generate_section_script_end(self):
		"""Generates the code needed for the script end section."""
		section_script_end = self.get_code_section(CODE_SECTION_SCRIPT_END)

		ascii_comment = get_shell_ascii_comment_as_code_chunk('script end')
		section_script_end.add_code_chunk(ascii_comment)

		line = 'print_dashed_line_with_text "script{' + self.file_name_with_extension + '} end on {${CURRENT_USER}-${HOST_NAME}}."'

		section_script_end.add_code_chunk(CodeChunk([line]))
