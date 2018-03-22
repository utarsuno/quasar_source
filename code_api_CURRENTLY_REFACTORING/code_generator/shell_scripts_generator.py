# coding=utf-8

"""This module, shell_scripts_generator.py, is used to generate shell scripts."""

from code_api import code_file as cf
from universal_code import debugging as dbg
from universal_code.time_abstraction import time_abstraction as ta
from universal_code import path_manager as pm
from universal_code import output_coloring as oc


SHELL_SCRIPT_TYPE_LOCAL     = 'local'
SHELL_SCRIPT_TYPE_SERVER    = 'server'
SHELL_SCRIPT_TYPE_UNIVERSAL = 'universal'


class ShellFunction(object):
	"""Represents a shell function."""

	def __init__(self, function_type):
		self._type = function_type
		self._required_variables = []
		self._required_functions = []
		if self._type == _FUNCTION_TERMINATE_SCRIPT:
			self._function_name = 'terminate_script'
			self.add_required_function(_FUNCTION_PRINT_RED_DOTTED_LINE)
			self.add_required_variable(_VARIABLE_ESC_SEC)
			self.add_required_variable(_VARIABLE_FS_RED)
			self.add_required_variable(_VARIABLE_FS_BOLD)
			self.add_required_variable(_VARIABLE_RESET_ALL)
			self.add_required_variable(_VARIABLE_FS_UL)
		elif self._type == _FUNCTION_PRINT_RED_DOTTED_LINE:
			self._function_name = 'print_red_dotted_line'
			self.add_required_variable(_VARIABLE_FS_MAGENTA)
			self.add_required_variable(_VARIABLE_FS_REG)
			self.add_required_variable(_VARIABLE_DOTTED_LINE)
			self.add_required_variable(_VARIABLE_RESET_ALL)
		elif self._type == _FUNCTION_PRINT_DASHED_LINE_WITH_TEXT:
			self._function_name = 'print_dashed_line_with_text'
			self._required_functions.append(_FUNCTION_TERMINATE_SCRIPT)
			# Not including the variables that are already included in '_FUNCTION_TERMINATE_SCRIPT'
			self.add_required_variable(_VARIABLE_FS_YELLOW)
			self.add_required_variable(_VARIABLE_FS_GREEN)
			self.add_required_variable(_VARIABLE_FS_REG)
			self.add_required_variable(_VARIABLE_RESET_ALL)
			self.add_required_variable(_VARIABLE_FS_BOLD)
		elif self._type == _FUNCTION_PRINT_DOTTED_LINE:
			self._function_name = 'print_dotted_line'
			self.add_required_variable(_VARIABLE_FS_MAGENTA)
			self.add_required_variable(_VARIABLE_DOTTED_LINE)
			self.add_required_variable(_VARIABLE_FS_REG)
			self.add_required_variable(_VARIABLE_RESET_ALL)
		elif self._type == _FUNCTION_PRINT_SCRIPT_TEXT:
			self._function_name = 'print_script_text'
			self.add_required_variable(_VARIABLE_FS_CYAN)
			self.add_required_variable(_VARIABLE_FS_REG)
			self.add_required_variable(_VARIABLE_RESET_ALL)
		elif self._type == _FUNCTION_TERMINATE_IF_SUDO:
			self._function_name = 'terminate_if_sudo'
			self._required_functions.append(ShellFunction(_FUNCTION_TERMINATE_SCRIPT))
		elif self._type == SAFETY_CHECK_DONT_ALLOW_SUDO:
			self._function_name = 'terminate_if_sudo'
			self._required_functions.append(ShellFunction(_FUNCTION_TERMINATE_IF_SUDO))
		elif self._type == _FUNCTION_TERMINATE_IF_NOT_SUDO:
			self._function_name = 'terminate_if_not_sudo'
			self._required_functions.append(ShellFunction(_FUNCTION_TERMINATE_SCRIPT))
		elif self._type == SAFETY_CHECK_ONLY_ALLOW_SUDO:
			self._function_name = 'terminate_if_not_sudo'
			self._required_functions.append(ShellFunction(_FUNCTION_TERMINATE_IF_NOT_SUDO))
		elif self._type == _FUNCTION_TERMINATE_IF_SYSTEM_IS_UBUNTU:
			self._function_name = 'terminate_if_system_is_ubuntu'
			self._required_functions.append(ShellFunction(_FUNCTION_TERMINATE_SCRIPT))
		elif self._type == _FUNCTION_TERMINATE_IF_SYSTEM_IS_NOT_UBUNTU:
			self._function_name = 'terminate_if_system_is_not_ubuntu'
			self._required_functions.append(ShellFunction(_FUNCTION_TERMINATE_SCRIPT))
		elif self._type == SAFETY_CHECK_DONT_ALLOW_UBUNTU:
			self._function_name = 'terminate_if_system_is_ubuntu'
			self._required_functions.append(ShellFunction(_FUNCTION_TERMINATE_IF_SYSTEM_IS_UBUNTU))
		elif self._type == SAFETY_CHECK_ONLY_ALLOW_UBUNTU:
			self._function_name = 'terminate_if_system_is_not_ubuntu'
			self._required_functions.append(ShellFunction(_FUNCTION_TERMINATE_IF_SYSTEM_IS_NOT_UBUNTU))
		elif self._type == SAFETY_CHECK_DONT_ALLOW_SUDO:
			self._function_name = 'terminate_if_sudo'
			self._required_functions.append(ShellFunction(_FUNCTION_TERMINATE_SCRIPT))

	def add_required_function(self, rf):
		"""Adds a required function to this shell function."""
		if type(rf) == str:
			rf = ShellFunction(rf)
		self._required_functions.append(rf)

	def add_required_variable(self, rv):
		"""Adds a required variable to this shell function."""
		self._required_variables.append(rv)

	def get_all_required_functions_recursively(self):
		"""Gets all required functions and sub functions in this SafetyCheck."""
		rf = []
		for r_f in self._required_functions:
			rf.append(r_f)
			srf = r_f.get_all_required_functions_recursively()
			for s_r_f in srf:
				#print('Adding : {' + str(s_r_f) + '}')
				rf.append(s_r_f)
		return rf

	def get_all_required_variables_recursively(self):
		"""Gets all variables and sub variables contained in this SafetyCheck."""
		rv = []
		for r_v in self._required_variables:
			rv.append(r_v)

		#print('rv is : ' + str(rv))

		all_required_functions = self.get_all_required_functions_recursively()
		for rf in all_required_functions:
			for r_v in rf._required_variables:
				rv.append(r_v)

		#print('rv is : ' + str(rv))

		return rv

	@property
	def function_name(self) -> str:
		"""Returns the name of this shell function."""
		return self._function_name

	def __str__(self):
		if self._type == SAFETY_CHECK_DONT_ALLOW_SUDO:
			return 'terminate_if_sudo'
		elif self._type == SAFETY_CHECK_ONLY_ALLOW_SUDO:
			return 'terminate_if_not_sudo'
		elif self._type == SAFETY_CHECK_DONT_ALLOW_UBUNTU:
			return 'terminate_if_system_is_ubuntu'
		elif self._type == SAFETY_CHECK_ONLY_ALLOW_UBUNTU:
			return 'terminate_if_system_is_not_ubuntu'
		return self._type


class CodeFileShellScript(cf.CodeFile):
	"""Represents a single shell script file."""

	def __init__(self, file_path, already_exists=True):
		super().__init__(file_path, already_exists)
		self._extension = '.sh'
		self._language = cf.SHELL_SCRIPT
		self._apply_language_and_set_data()

		self._requires_start_and_stop_print = False
		if 'local' in file_path:
			self._script_type = SHELL_SCRIPT_TYPE_LOCAL
		elif 'server' in file_path:
			self._script_type = SHELL_SCRIPT_TYPE_SERVER
		else:
			self._script_type = SHELL_SCRIPT_TYPE_UNIVERSAL
		self._required_arguments = []
		self._required_safety_checks = []

		self._required_variables = []
		self._required_functions = []

		self._main_logic = []

		if not already_exists:
			self.add_line('#!/bin/bash')
			self.add_line('')

	def add_main_logic(self, text):
		"""Sets the main logic portion of the script."""
		if type(text) == str:
			self._main_logic = text.split('\n')
		else:
			self._main_logic = text

	def require_start_and_stop_print(self):
		"""Adds a start and stop output to this shell script."""
		self._requires_start_and_stop_print = True
		self.add_required_function(_FUNCTION_PRINT_DASHED_LINE_WITH_TEXT)

	def add_required_variable(self, variable):
		"""Adds a required variable to the shell script."""
		for rv in self._required_variables:
			if str(rv) == str(variable):
				return
		self._required_variables.append(variable)

	def add_required_function(self, function):
		"""Adds a required function to the shell script."""
		if type(function) == str:
			function = ShellFunction(function)
		for rf in self._required_functions:
			if str(rf) == str(function):
				return
		self._required_functions.append(function)

	def add_required_argument(self, argument_name):
		"""Adds a required argument to the shell script."""
		self._required_arguments.append(argument_name)

	def add_required_safety_check(self, safety_check):
		"""Adds a safety check to the shell script."""
		if safety_check not in ALL_SAFETY_CHECKS:
			dbg.raise_exception('Not valid safety check passed in!')
		self._required_safety_checks.append(ShellFunction(safety_check))

	def generate(self):
		"""Generates this code file."""
		if self._script_type == SHELL_SCRIPT_TYPE_LOCAL:
			self._generate_script()
		elif self._script_type == SHELL_SCRIPT_TYPE_SERVER:
			self._generate_script()
		elif self._script_type == SHELL_SCRIPT_TYPE_UNIVERSAL:
			self._generate_script()
		else:
			dbg.raise_exception('Invalid script type set for ' + self.file_path)

		for l in self._lines_of_code:
			if '<<THIS_SCRIPT_NAME>>' in l.text:
				l.text = l.text.replace('<<THIS_SCRIPT_NAME>>', self.file_name)

		self.create_code_file()

	def _has_function(self, f):
		"""Checks if this script contains the following function."""
		if type(f) == str:
			for rf in self._required_functions:
				if f == str(rf):
					return True
		return False

	def _remove_function(self, f):
		if type(f) == str:
			function_to_remove = None
			for rf in self._required_functions:
				if f == str(rf):
					function_to_remove = rf
					break
			if function_to_remove is not None:
				self._required_functions.remove(function_to_remove)

	def _set_needed_variables_and_functions(self):
		"""Utility function."""
		for l in self._main_logic:
			if 'print_script_text ' in l:
				self.add_required_function(_FUNCTION_PRINT_SCRIPT_TEXT)

		for rf in self._required_functions:
			for rv in rf._required_variables:
				# Only adds if its not already added.
				self.add_required_variable(rv)
			for r_f in rf._required_functions:
				# Only adds if its not already added.
				self.add_required_function(r_f)

		for sc in self._required_safety_checks:
			sub_all_required_variables = sc.get_all_required_variables_recursively()
			for rv in sub_all_required_variables:
				# Only adds if its not already added.
				self.add_required_variable(rv)

			sub_all_required_functions = sc.get_all_required_functions_recursively()
			for rf in sub_all_required_functions:
				#print(rf)
				# Only adds if its not already added.
				self.add_required_function(rf)

		# TODO : Make a better system for variable and function placement order.
		if _VARIABLE_ESC_SEC in self._required_variables:
			self._required_variables.remove(_VARIABLE_ESC_SEC)
			self._required_variables.insert(0, _VARIABLE_ESC_SEC)

		# TODO : Make a better system for variable and function placement order.
		if self._has_function(_FUNCTION_PRINT_RED_DOTTED_LINE):
			self._remove_function(_FUNCTION_PRINT_RED_DOTTED_LINE)
			self._required_functions.insert(0, ShellFunction(_FUNCTION_PRINT_RED_DOTTED_LINE))

		# Add any OS specific variables needed.
		for rv in self._required_variables:
			if rv in _VARIABLES_THAT_REQUIRE_LOCAL_CONFIG_PATH_AND_READER and self._script_type == SHELL_SCRIPT_TYPE_LOCAL:
				if _VARIABLE_CONFIG_PATH_LOCAL not in self._required_variables:
					self._required_variables.insert(0, _VARIABLE_CONFIG_PATH_LOCAL)
				if _VARIABLE_CONFIG_READER_PATH_LOCAL not in self._required_variables:
					self._required_variables.insert(0, _VARIABLE_CONFIG_READER_PATH_LOCAL)

		# Check if any variables have been added that require other variables.
		for rv in self._required_variables:
			if 'ESC_SEQ' in str(rv):
				if _VARIABLE_ESC_SEC not in self._required_variables:
					self._required_variables.insert(0, _VARIABLE_ESC_SEC)

	def _generate_script(self):
		"""Generates the script."""
		self._set_needed_variables_and_functions()

		oc.print_data_with_red_dashes_at_start('Generating : ' + self.file_name)

		# Generation report.
		self.add_3D_comment('generation notes')
		self.add_comment('LAST_GENERATED : {' + ta.DayInstance(ta.THIS_DAY).to_string_format('MM.DD.YYYY') + '}')
		self.add_line('')

		# Setup and imports.
		if len(self._required_variables) > 0 or len(self._required_functions) > 0:
			self.add_3D_comment('setup and imports')

			lines_to_sort = []

			if len(self._required_variables) > 0:
				self.add_comment('Required variables.')
			for rv in self._required_variables:
				lines_to_sort.append(self.add_line(rv))
			if len(self._required_variables) > 0:
				self.add_line('')

			if len(self._required_functions) > 0:
				self.add_comment('Required functions.')
			for rf in self._required_functions:
				self.add_lines(str(rf))

		# Safety checks.
		if len(self._required_safety_checks) > 0:
			self.add_3D_comment('safety checks')

			for sc in self._required_safety_checks:
				self.add_line(str(sc))

			self.add_line('')

		# Check for any arguments needed.
		if len(self._required_arguments) > 0:
			self.add_3D_comment('script arguments')
			self.add_line('if [ "$#" -ne NUM_ARGS ]; then'.replace('NUM_ARGS', str(len(self._required_arguments))))
			self.add_line('\tterminate script "The script{' + self.file_name + '} requires exactly{' + str(len(self._required_arguments)) + '} arguments. They are ' + str(self._required_arguments) + '."')
			self.add_line('fi')
			self.add_line('')

		# Script main logic.
		self.add_3D_comment('script logic')
		if self._requires_start_and_stop_print:
			self.add_line('print_dashed_line_with_text "' + self.file_name + ' script start for : ${HOST_NAME}."')

		self.add_line('')

		for l in self._main_logic:
			self.add_line(l)

		self.add_line('')

		if self._requires_start_and_stop_print:
			self.add_line('print_dashed_line_with_text "' + self.file_name + ' script end for : ${HOST_NAME}."')
