# coding=utf-8

"""This module, automated.py, generates scripts that don't get run by the user but by other scripts."""

from code_api.discrete_projects.predefined_code.shell_code.safety_checks import *
from code_api.discrete_projects.predefined_code.shell_code.variable_setters import *
from code_api.source_file_abstraction.code_files.shell_file import *
from code_api.source_file_abstraction.code_directories.shell_directory import ShellDirectory


APPLICATION_QUASAR = 'QUASAR'
APPLICATION_ENTITY = 'ENTITY'


def local_local_quasar_automated_scripts(directory_local_quasar, code_file_script_utilities, code_file_config_reader):
	"""Loads the local scripts."""
	d = directory_local_quasar.add_new_child_code_directory_from_current_path('automated', ShellDirectory)
	d.add_shell_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_UBUNTU)
	d.add_shell_required_library(code_file_script_utilities)
	d.add_shell_required_library(code_file_config_reader)

	load_specific_server_application_scripts(APPLICATION_QUASAR, d)
	load_specific_server_application_scripts(APPLICATION_ENTITY, d)

	load_script_ensure_quasar_application_servers_are_running(d)

	return d


def load_script_ensure_quasar_application_servers_are_running(directory):
	"""Loads this specific script."""
	s = ShellFile('ensure_application_servers_are_running')
	s.add_required_variable_setters(SHELL_VARIABLES_QUASAR_CONNECTION)
	s.add_required_variable_setters(SHELL_VARIABLES_SET_QUASAR_MAINTENANCE)
	s.add_required_variable_setters(SHELL_VARIABLES_QUASAR_PROJECT_SETUP)
	s.add_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_SUDO)
	s.set_main_code(CodeChunk('''
${PATH_TO_LOCAL_PYTHON3} ./restart_quasar_server.py
	'''))

	directory.add_code_file(s)


def load_specific_server_application_scripts(application, directory):
	"""Loads a set of scripts for a specified application server."""
	status = ShellFile(application.lower() + '_server_status')
	status.add_required_variable_setters(SHELL_VARIABLES_QUASAR_CONNECTION)
	status.add_required_variable_setters(SHELL_VARIABLES_SET_QUASAR_MAINTENANCE)
	status.add_required_variable_setters(SHELL_VARIABLES_QUASAR_PROJECT_SETUP)
	status.add_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_SUDO)

	status.set_main_code(CodeChunk('''
ssh -tt -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} "${APPLICATION_STATUS_SERVER}"'''.replace('APPLICATION', application)))

	restart = ShellFile(application.lower() + '_server_restart')
	restart.add_required_variable_setters(SHELL_VARIABLES_QUASAR_CONNECTION)
	restart.add_required_variable_setters(SHELL_VARIABLES_SET_QUASAR_MAINTENANCE)
	status.add_required_variable_setters(SHELL_VARIABLES_QUASAR_PROJECT_SETUP)
	restart.add_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_SUDO)
	restart.set_main_code(CodeChunk('''
ssh -tt -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} "${APPLICATION_RESTART_SERVER}"'''.replace('APPLICATION', application)))

	directory.add_code_file(status)
	directory.add_code_file(restart)

