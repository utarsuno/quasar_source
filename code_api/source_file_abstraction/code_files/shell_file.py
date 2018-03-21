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

	def set_main_code(self, code_chunk):
		"""Sets the main code chunk for this shell file."""
		self._main_code_chunk = code_chunk

	def add_required_library(self, shell_library):
		"""Adds a required shell library to this shell file."""
		self._required_libraries.append(shell_library)

	def add_required_safety_check(self, safety_check):
		"""Adds a required safety check to this shell file."""
		self._required_safety_checks.append(safety_check)

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
			if len(code_section._code_chunks) > 0:
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
		section_bash = self.get_code_section(CODE_SECTION_BASH_STATEMENT)
		section_bash.add_code_chunk(CodeChunk(['#!/bin/bash']))

	def _generate_section_generation_notes(self):
		"""Generates the code needed for the generation notes section."""
		section_generation_notes = self.get_code_section(CODE_SECTION_GENERATION_NOTES)

		generation_notes = get_shell_ascii_comment_as_code_chunk('generation notes')
		day_instance = DayInstance(TIME_TYPE_DAY_CURRENT)
		generation_notes.add_line_of_code('# LAST_GENERATED : {' + str(day_instance) + '}')

		section_generation_notes.add_code_chunk(generation_notes)

	def _generate_section_library_imports(self):
		"""Generates the code needed for the library import section."""
		section_library_imports = self.get_code_section(CODE_SECTION_LIBRARY_IMPORTS)

		ascii_comment = get_shell_ascii_comment_as_code_chunk('library imports')
		section_library_imports.add_code_chunk(ascii_comment)

		library_code_chunks = self._get_code_chunks_from_required_libraries()
		for lcc in library_code_chunks:
			section_library_imports.add_code_chunk(lcc)

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

	def _generate_section_script_start(self):
		"""Generates the code needed for the script start section."""
		section_script_start = self.get_code_section(CODE_SECTION_SCRIPT_START)

		ascii_comment = get_shell_ascii_comment_as_code_chunk('script start')
		section_script_start.add_code_chunk(ascii_comment)

		line = 'print_dashed_line_with_text "script{'
		line += self.file_name_with_extension + '} start on {${HOST_NAME}}."'

		section_script_start.add_code_chunk(CodeChunk([line]))

	def _generate_section_safety_checks(self):
		"""Generates the code needed for the script safety checks section."""
		section_safety_checks = self.get_code_section(CODE_SECTION_SAFETY_CHECKS)

		ascii_comment = get_shell_ascii_comment_as_code_chunk('safety checks')
		section_safety_checks.add_code_chunk(ascii_comment)

		# Add any shell safety checks from the parent code directory (if it has any).
		if type(self._parent_code_directory) == ShellDirectory:
			directory_mandated_safety_checks_as_code_chunk = self._parent_code_directory.get_code_chunk_with_all_required_safety_checks()
			section_safety_checks.add_code_chunk(directory_mandated_safety_checks_as_code_chunk)

		# TODO : Add any shell specific required safety checks.

	def _generate_section_variables(self):
		"""Generates the code needed for the script variables section."""
		if len(self._required_variable_setters) > 0:
			section = self.get_code_section(CODE_SECTION_VARIABLES)
			section.add_code_chunk(get_shell_ascii_comment_as_code_chunk('variables setting'))

			for vs in self._required_variable_setters:
				section.add_code_chunk(vs.code_chunk)

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

		line = 'print_dashed_line_with_text "script{'
		line += self.file_name_with_extension + '} end on {${HOST_NAME}}."'

		section_script_end.add_code_chunk(CodeChunk([line]))
