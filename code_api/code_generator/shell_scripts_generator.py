# coding=utf-8

"""This module, shell_scripts_generator.py, is used to generate shell scripts."""

from code_api import code_file as cf
from universal_code import debugging as dbg
from universal_code.time_abstraction import time_abstraction as ta
from universal_code import path_manager as pm


SHELL_SCRIPT_TYPE_LOCAL     = 'local'
SHELL_SCRIPT_TYPE_SERVER    = 'server'
SHELL_SCRIPT_TYPE_UNIVERSAL = 'universal'

SAFETY_CHECK_DONT_ALLOW_SUDO = 'sudo'
SAFETY_CHECK_DONT_ALLOW_UBUNTU = 'system_is_ubuntu'
ALL_SAFETY_CHECKS = [SAFETY_CHECK_DONT_ALLOW_SUDO, SAFETY_CHECK_DONT_ALLOW_UBUNTU]

_VARIABLE_CONFIG_PATH_LOCAL        = 'CONFIG_PATH="' + pm.PATH_TO_CONFIG_FILE + '"'
_VARIABLE_CONFIG_READER_PATH_LOCAL = 'CONFIG_READER="' + pm.PATH_TO_CONFIG_READER + '"'

_VARIABLE_NEXUS_IP       = 'nexus_ip=$(python3 ${CONFIG_READER} ${CONFIG_PATH} nexus ip)'
_VARIABLE_NEXUS_PORT     = 'nexus_port=$(python3 ${CONFIG_READER} ${CONFIG_PATH} nexus port)'
_VARIABLE_NEXUS_PEM_PATH = 'nexus_pem_path=$(python3 ${CONFIG_READER} ${CONFIG_PATH} nexus pem_path)'
_VARIABLE_NEXUS_USER     = 'nexus_user=$(python3 ${CONFIG_READER} ${CONFIG_PATH} nexus user)'

_VARIABLES_THAT_REQUIRE_LOCAL_CONFIG_PATH_AND_READER = [_VARIABLE_NEXUS_IP, _VARIABLE_NEXUS_PORT, _VARIABLE_NEXUS_PEM_PATH, _VARIABLE_NEXUS_USER]

_VARIABLE_ESC_SEC     = 'ESC_SEQ="\\x1b["'
_VARIABLE_FS_RED      = 'FG_RED="${ESC_SEQ}31;"'
_VARIABLE_FS_MAGENTA  = 'FG_MAGENTA="${ESC_SEQ}35;"'
_VARIABLE_FS_GREEN    = 'FG_GREEN="${ESC_SEQ}32;"'
_VARIABLE_FS_YELLOW   = 'FG_YELLOW="${ESC_SEQ}33;"'
_VARIABLE_FS_REG      = 'FS_REG="21;24m"'
_VARIABLE_FS_BOLD     = 'FS_BOLD="1m"'
_VARIABLE_FS_UL       = 'FS_UL="4m"'
_VARIABLE_RESET_ALL   = 'RESET_ALL="${ESC_SEQ}0m"'
_VARIABLE_DOTTED_LINE = 'DOTTED_LINE="................................................................................."'

_PRINT_RED_DOTTED_LINE = '''function print_dotted_line {
    printf "${FG_MAGENTA}${FS_REG}${DOTTED_LINE}${RESET_ALL}"
}
'''

_FUNCTION_TERMINATE_SCRIPT = '''function terminate_script {
    print_red_dotted_line
    if [ -z "$1" ]; then
        printf "${FG_RED}${FS_BOLD}The function 'terminate_script' requires an argument. The program will now terminate.${RESET_ALL}"
        print_red_dotted_line
    else
        printf "${FG_RED}${FS_UL}${1}${RESET_ALL}"
        printf ""
        printf "${FG_RED}${FS_BOLD}Due to warnings or errors that have occurred the program will now terminate.${RESET_ALL}"
        print_red_dotted_line
    fi
    exit
}
'''

_FUNCTION_TERMINATE_IF_SUDO = '''function terminate_if_sudo {
    if [[ $EUID -eq 0 ]]; then
        terminate_script "This script should not be ran as sudo!"
    fi
}
'''

_FUNCTION_TERMINATE_IF_SYSTEM_IS_UBUNTU = '''function terminate_if_system_is_ubuntu {
    if [ "$OSTYPE" = "linux" ] || [ "$OSTYPE" = "linux-gnu" ]; then
        terminate_script "This script should not be run on an ubuntu system."
    fi
}
'''

_FUNCTION_PRINT_DASHED_LINE_WITH_TEXT = '''function print_dashed_line_with_text {
    if [ -z "$1" ]; then
       terminate_script "The function 'print_dashed_line_with_text' requires a parameter."
    fi
    length=${#1}
    declare -i max=100
    declare -i first=(max-length)/2
    if [ $((length%2)) -ne 0 ]; then
        printf "${FG_GREEN}${FS_REG}${RESET_ALL}"
    fi
    for i in `seq 2 ${first}`
    do
      printf "${FG_GREEN}${FS_REG}${RESET_ALL}"
    done
    printf "${FG_YELLOW}${FS_BOLD}${1}${RESET_ALL}"
    for i in `seq 2 ${first}`
    do
      printf "${FG_GREEN}${FS_REG}${RESET_ALL}"
    done
    printf "\\n"
}
'''


class ShellFunction(object):
	"""Represents a shell function."""

	def __init__(self, function_type):
		self._type = function_type
		self._required_variables = []
		self._required_functions = []
		if self._type == _FUNCTION_TERMINATE_SCRIPT:
			self.add_required_variable(_VARIABLE_ESC_SEC)
			self.add_required_variable(_VARIABLE_FS_RED)
			self.add_required_variable(_VARIABLE_FS_BOLD)
			self.add_required_variable(_VARIABLE_RESET_ALL)
			self.add_required_variable(_VARIABLE_FS_UL)
		elif self._type == _FUNCTION_PRINT_DASHED_LINE_WITH_TEXT:
			self._required_functions.append(_FUNCTION_TERMINATE_SCRIPT)
			# Not including the variables that are already included in '_FUNCTION_TERMINATE_SCRIPT'
			self._required_variables.append(_VARIABLE_FS_YELLOW)
			self._required_variables.append(_VARIABLE_FS_GREEN)
		elif self._type == _FUNCTION_TERMINATE_IF_SUDO or self._type == SAFETY_CHECK_DONT_ALLOW_SUDO:
			self._required_functions.append(ShellFunction(_FUNCTION_TERMINATE_SCRIPT))
		elif self._type == _FUNCTION_TERMINATE_IF_SYSTEM_IS_UBUNTU or self._type == SAFETY_CHECK_DONT_ALLOW_UBUNTU:
			self._required_functions.append(ShellFunction(_FUNCTION_TERMINATE_SCRIPT))
		elif self._type == SAFETY_CHECK_DONT_ALLOW_SUDO:
			self._required_functions.append(ShellFunction(_FUNCTION_TERMINATE_SCRIPT))

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
				rf.append(s_r_f)
		return rf

	def get_all_required_variables_recursively(self):
		"""Gets all variables and sub variables contained in this SafetyCheck."""
		rv = []
		for r_v in self._required_variables:
			rv.append(r_v)
		all_required_functions = self.get_all_required_functions_recursively()
		for rf in all_required_functions:
			for r_v in rf._required_variables:
				rv.append(r_v)
		return rv

	def __str__(self):
		if self._type == SAFETY_CHECK_DONT_ALLOW_SUDO:
			return 'terminate_if_sudo'
		elif self._type == SAFETY_CHECK_DONT_ALLOW_UBUNTU:
			return 'terminate_if_system_is_ubuntu'
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

	def add_required_variable(self, variable):
		"""Adds a required variable to the shell script."""
		for rv in self._required_variables:
			if str(rv) == str(variable):
				return
		self._required_variables.append(variable)

	def add_required_function(self, function):
		"""Adds a required function to the shell script."""
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
			self._generate_local_script()
		elif self._script_type == SHELL_SCRIPT_TYPE_SERVER:
			self._generate_server_script()
		elif self._script_type == SHELL_SCRIPT_TYPE_UNIVERSAL:
			self._generate_universal_script()
		else:
			dbg.raise_exception('Invalid script type set for ' + self.file_path)

		self.create_code_file()

	def _set_needed_variables_and_functions(self):
		"""Utility function."""
		for sc in self._required_safety_checks:
			sub_all_required_variables = sc.get_all_required_variables_recursively()
			for rv in sub_all_required_variables:
				# Only adds if its not already added.
				self.add_required_variable(rv)

			sub_all_required_functions = sc.get_all_required_functions_recursively()
			for rf in sub_all_required_functions:
				# Only adds if its not already added.
				self.add_required_function(rf)

		# Add any OS specific variables needed.
		for rv in self._required_variables:
			if rv in _VARIABLES_THAT_REQUIRE_LOCAL_CONFIG_PATH_AND_READER and self._script_type == SHELL_SCRIPT_TYPE_LOCAL:
				if _VARIABLE_CONFIG_PATH_LOCAL not in self._required_variables:
					self._required_variables.insert(0, _VARIABLE_CONFIG_PATH_LOCAL)
				if _VARIABLE_CONFIG_READER_PATH_LOCAL not in self._required_variables:
					self._required_variables.insert(0, _VARIABLE_CONFIG_READER_PATH_LOCAL)

	def _generate_local_script(self):
		"""Generates this type of script."""
		#self.add_line('')
		#self.add_line('DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )')

		self._set_needed_variables_and_functions()

		# Generation report.
		self.add_3D_comment('generation notes')
		self.add_comment('LAST_GENERATED : {' + ta.DayInstance(ta.THIS_DAY).to_string_format('MM.DD.YYYY') + '}')
		self.add_line('')

		# Setup and imports.
		if len(self._required_safety_checks) > 0 and (len(self._required_variables) > 0 or len(self._required_functions) > 0):
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
			self.add_3D_comment('program arguments')
			self.add_line('if [ "$#" -ne NUM_ARGS ]; then'.replace('NUM_ARGS', str(len(self._required_arguments))))
			self.add_line('\tterminate script "The script{' + self.file_name + '} requires exactly{' + str(len(self._required_arguments)) + '} arguments. They are ' + str(self._required_arguments) + '."')
			self.add_line('fi')
			self.add_line('')

		# Script main logic.
		self.add_3D_comment('script logic')
		if self._requires_start_and_stop_print:
			self.add_line('print_dashed_line_with_text "' + self.file_name + ' script start."')

		self.add_line('')

		for l in self._main_logic:
			self.add_line(l)

		self.add_line('')

		if self._requires_start_and_stop_print:
			self.add_line('print_dashed_line_with_text "' + self.file_name + ' script end."')

	def _generate_server_script(self):
		"""Generates this type of script."""
		y = 2

	def _generate_universal_script(self):
		"""Generates this type of script."""
		y = 2