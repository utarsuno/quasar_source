# coding=utf-8

"""This module, server_scripts.py, manages the server scripts directory for the QuasarSource project."""

from code_api.discrete_projects.predefined_code.shell_code.safety_checks import *
from code_api.discrete_projects.predefined_code.shell_code.variable_setters import *
from code_api.source_file_abstraction.code_files.shell_file import *
from code_api.source_file_abstraction.code_directories.shell_directory import ShellDirectory
from code_api.source_file_abstraction.code_files.shell_file import ShellFile

from universal_code.useful_file_operations import get_ini_section_dictionary as config
from universal_code import path_manager as pm


def ini(section):
	"""Utility function."""
	return config(pm.PATH_TO_CONFIG_FILE, section)

VALS = ini('quasar')
QUASAR_SOURCE      = VALS['path_to_quasar_source']
IS_PROGRAM_RUNNING = VALS['path_server_is_program_running']

# Django server.
DJANGO_MANAGE = VALS['path_server_django_manage']
TERMINATE_SCRIPT_PATH_QUASAR = VALS['path_server_quasar_terminate']
RUN_IN_BACKGROUND_SCRIPT_PATH_QUASAR = VALS['path_server_quasar_run_in_background']
_RUN_QUASAR = ["sudo -E python3 ${APPLICATION_PATH} migrate", "\tsudo -E nohup python3 ${APPLICATION_PATH} runserver 0:80 &"]
_RUN_QUASAR_LIVE = ["sudo -E python3 ${APPLICATION_PATH} migrate", "\tsudo -E python3 ${APPLICATION_PATH} runserver 0:80"]

# Entity server.
ENTITY_SERVER = VALS['entity_server']
TERMINATE_SCRIPT_PATH_ENTITY = VALS['path_server_entity_terminate']
RUN_IN_BACKGROUND_SCRIPT_PATH_ENTITY = VALS['path_server_entity_run_in_background']
_RUN_ENTITY = "nohup python3 ${APPLICATION_PATH} -r &"
_RUN_ENTITY_LIVE = "python3 ${APPLICATION_PATH} -r"


def load_server_scripts():
	"""Generates the server scripts."""
	directory_server = CodeDirectory('/Users/utarsuno/git_repos/quasar_source/configuration_files/server_scripts')
	directory_server_quasar = directory_server.add_new_child_code_directory_from_current_path('quasar')
	directory_server_entity = directory_server.add_new_child_code_directory_from_current_path('entity')

	load_specific_server_application_scripts(directory_server_quasar, 'quasar', DJANGO_MANAGE, TERMINATE_SCRIPT_PATH_QUASAR, RUN_IN_BACKGROUND_SCRIPT_PATH_QUASAR, _RUN_QUASAR, _RUN_QUASAR_LIVE)
	load_specific_server_application_scripts(directory_server_entity, 'entity', ENTITY_SERVER, TERMINATE_SCRIPT_PATH_ENTITY, RUN_IN_BACKGROUND_SCRIPT_PATH_ENTITY, _RUN_ENTITY, _RUN_ENTITY_LIVE)

	directory_server.add_code_file(add_update_code_script())
	directory_server.add_code_file(add_health_check_script())

	return directory_server


def add_health_check_script():
	"""Adds a script to ensure Pymongo is running."""
	s = ShellFile('health_check')
	s.set_to_simple_shell_file()
	code = '''
export PYTHONPATH=${PATH_TO_QUASAR_SOURCE}

PYMONGO_PID=`python3 ${PATH_TO_IS_PROGRAM_RUNNING} mongod`

if [ ${PYMONGO_PID} -eq -1 ]; then
	sudo service mongod start
fi
'''
	code = code.replace('${PATH_TO_QUASAR_SOURCE}', QUASAR_SOURCE)
	code = code.replace('${PATH_TO_IS_PROGRAM_RUNNING}', IS_PROGRAM_RUNNING)
	s.set_main_code(CodeChunk(code))
	return s


def add_update_code_script():
	"""Adds the update code for the server script."""
	s = ShellFile('update_code')
	s.set_to_simple_shell_file()
	s.set_main_code(CodeChunk('''
# Go to the projects base directory.
cd ${PATH_TO_QUASAR_SOURCE};
git fetch --all;
reslog=$(git log HEAD..origin/master --oneline)
if [[ "${reslog}" != "" ]] ; then
    # This resets to master.
    git reset --hard origin/master;
fi
'''.replace('${PATH_TO_QUASAR_SOURCE}', QUASAR_SOURCE)))
	return s


def load_specific_server_application_scripts(directory, application_name, application_path, terminate_script_path, run_in_background_script_path, run_code, run_code_live):
	"""Generates a set of scripts to manage a specific server application."""
	terminate         = get_terminate_script(application_path)
	run_in_background = get_run_in_background_script(application_name, application_path, run_code)
	restart           = get_restart_script(terminate_script_path, run_in_background_script_path)
	live_run          = get_live_run_script(application_name, application_path, run_code_live)

	directory.add_code_file(terminate)
	directory.add_code_file(run_in_background)
	directory.add_code_file(restart)
	directory.add_code_file(live_run)


def get_live_run_script(application_name, application_path, run_code_live):
	"""Returns the server application live run script."""
	s = ShellFile('live_run')
	s.set_to_simple_shell_file()
	code = '''
export PYTHONPATH=${PATH_TO_QUASAR_SOURCE}

APPLICATION_PID=`python3 ${PATH_TO_IS_PROGRAM_RUNNING} ${APPLICATION_PATH}`

if [ ${APPLICATION_PID} -gt -1 ]; then
	echo '${APPLICATION} server is already running!'
else
	${RUN_CODE_LIVE}
fi
'''
	code = code.replace('${PATH_TO_QUASAR_SOURCE}', QUASAR_SOURCE)
	code = code.replace('${APPLICATION}', application_name)
	code = code.replace('${PATH_TO_IS_PROGRAM_RUNNING}', IS_PROGRAM_RUNNING)
	if type(run_code_live) == list:
		code = code.replace('${RUN_CODE_LIVE}', run_code_live[0] + '\n' + run_code_live[1] + '\n')
	else:
		code = code.replace('${RUN_CODE_LIVE}', run_code_live + '\n')
	code = code.replace('${APPLICATION_PATH}', application_path)
	s.set_main_code(CodeChunk(code))
	return s


def get_restart_script(terminate_script_path, run_in_background_script_path):
	"""Returns the server application restart script."""
	s = ShellFile('restart')
	s.set_to_simple_shell_file()
	s.set_main_code(CodeChunk('''
sudo nohup ${TERMINATE_SCRIPT_PATH} &
sudo nohup ${RUN_IN_BACKGROUND_SCRIPT_PATH} &
'''.replace('${TERMINATE_SCRIPT_PATH}', terminate_script_path).replace('${RUN_IN_BACKGROUND_SCRIPT_PATH}', run_in_background_script_path)))
	return s


def get_run_in_background_script(application_name, application_path, run_code):
	"""Returns the server application run in background script."""
	s = ShellFile('run_in_background')
	s.set_to_simple_shell_file()
	code = '''
export PYTHONPATH=${PATH_TO_QUASAR_SOURCE}

APPLICATION_PID=`python3 ${PATH_TO_IS_PROGRAM_RUNNING} ${APPLICATION_PATH}`

if [ ${APPLICATION_PID} -gt -1 ]; then
	echo '${APPLICATION} server is already running!'
else
	${RUN_CODE}
fi
'''
	code = code.replace('${PATH_TO_QUASAR_SOURCE}', QUASAR_SOURCE)
	code = code.replace('${APPLICATION}', application_name)
	code = code.replace('${PATH_TO_IS_PROGRAM_RUNNING}', IS_PROGRAM_RUNNING)
	if type(run_code) == list:
		code = code.replace('${RUN_CODE}', run_code[0] + '\n' + run_code[1] + '\n')
	else:
		code = code.replace('${RUN_CODE}', run_code + '\n')
	code = code.replace('${APPLICATION_PATH}', application_path)
	s.set_main_code(CodeChunk(code))
	return s


def get_terminate_script(application_path):
	"""Returns the server application terminate script."""
	s = ShellFile('terminate')
	s.set_to_simple_shell_file()
	s.set_main_code(CodeChunk('''
APPLICATION_PID=`python3 ${PATH_TO_IS_PROGRAM_RUNNING} ${APPLICATION_PATH}`

if [ ${APPLICATION_PID} -gt -1 ]; then
	sudo kill ${APPLICATION_PID}
fi
'''.replace('${APPLICATION_PATH}', application_path).replace('${PATH_TO_IS_PROGRAM_RUNNING}', IS_PROGRAM_RUNNING)))
	return s
