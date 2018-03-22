# coding=utf-8

"""This module, server_scripts.py, manages the server scripts directory for the QuasarSource project."""

from code_api.discrete_projects.predefined_code.shell_code.safety_checks import *
from code_api.discrete_projects.predefined_code.shell_code.variable_setters import *
from code_api.source_file_abstraction.code_files.shell_file import *


def load_server_scripts(directory_all_scripts, code_file_script_utilities, code_file_config_reader):
	"""Loads the server scripts."""

	'''__     __   ___  __  ___  __   __          __   ___  __        ___  __      __   __   __     __  ___  __
	  |  \ | |__) |__  /  `  |  /  \ |__) \ /    /__` |__  |__) \  / |__  |__)    /__` /  ` |__) | |__)  |  /__`
	  |__/ | |  \ |___ \__,  |  \__/ |  \  |     .__/ |___ |  \  \/  |___ |  \    .__/ \__, |  \ | |     |  .__/ '''
	directory_server = directory_all_scripts.add_new_child_code_directory_from_current_path('server', ShellDirectory)
	directory_server.add_shell_required_library(code_file_script_utilities)
	directory_server.add_shell_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_NOT_UBUNTU)

	'''__   __   __   ___     ___         ___           __   __       ___  ___     __   __   __   ___
	  /  ` /  \ |  \ |__     |__  | |    |__  .   |  | |__) |  \  /\   |  |__     /  ` /  \ |  \ |__
	  \__, \__/ |__/ |___    |    | |___ |___ .   \__/ |    |__/ /~~\  |  |___    \__, \__/ |__/ |___ '''
	code_file_update_code = ShellFile('update_code')
	code_file_update_code.treat_paths_as_server_paths()
	code_file_update_code.add_required_library(code_file_config_reader)
	code_file_update_code.add_required_variable_setters(SHELL_VARIABLES_SET_SERVER_SIDE)
	code_file_update_code.set_main_code(CodeChunk('''
# Go to the projects base directory.
cd "${PATH_TO_QUASAR_SOURCE}";
git fetch --all;
reslog=$(git log HEAD..origin/master --oneline)
if [[ "${reslog}" != "" ]] ; then
    print_script_text "Updating the code base."
    # This resets to master.
    git reset --hard origin/master;
else
    # We do not have to update the code.
    print_script_text "The code base is already up to date so a pull will not be performed."
fi
'''))

	'''__   __   __   ___     ___         ___      ___  __   __   __   ___          __   __       ___  ___     __   __   __   ___
	  /  ` /  \ |  \ |__     |__  | |    |__  .   |__  /  \ |__) /  ` |__     |  | |__) |  \  /\   |  |__     /  ` /  \ |  \ |__
	  \__, \__/ |__/ |___    |    | |___ |___ .   |    \__/ |  \ \__, |___    \__/ |    |__/ /~~\  |  |___    \__, \__/ |__/ |___ '''
	code_file_force_update_code = ShellFile('force_update_code')
	code_file_force_update_code.treat_paths_as_server_paths()
	code_file_force_update_code.add_required_library(code_file_config_reader)
	code_file_force_update_code.add_required_variable_setters(SHELL_VARIABLES_SET_SERVER_SIDE)
	code_file_force_update_code.set_main_code(CodeChunk('''
# Go to the projects base directory.
cd "${PATH_TO_QUASAR_SOURCE}";
git fetch --all;
reslog=$(git log HEAD..origin/master --oneline)
if [[ "${reslog}" != "" ]] ; then
    print_script_text "Updating the code base."
    # This resets to master.
    git reset --hard origin/master;
    # Remove files that are not tracked. The -d flag is needed for removing directories as well.
    git clean -fd;
else
    # We do not have to update the code.
    print_script_text "The code base is already up to date so a pull will not be performed."
fi
'''))

	'''__     __   ___  __  ___  __   __          __   ___  __        ___  __             __   __      __   __   __   ___     ___         ___  __
	  |  \ | |__) |__  /  `  |  /  \ |__) \ /    /__` |__  |__) \  / |__  |__)       /\  |  \ |  \    /  ` /  \ |  \ |__     |__  | |    |__  /__`
	  |__/ | |  \ |___ \__,  |  \__/ |  \  |     .__/ |___ |  \  \/  |___ |  \ .    /~~\ |__/ |__/    \__, \__/ |__/ |___    |    | |___ |___ .__/ '''
	directory_server.add_code_file(code_file_update_code)
	directory_server.add_code_file(code_file_force_update_code)

	load_entity_directory(directory_server, code_file_script_utilities, code_file_config_reader)
	load_quasar_directory(directory_server, code_file_script_utilities, code_file_config_reader)


def load_entity_directory(directory_server, code_file_script_utilities, code_file_config_reader):
	"""Loads the entity directory."""
	directory_entity = directory_server.add_new_child_code_directory_from_current_path('entity', ShellDirectory)
	directory_entity.add_shell_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_NOT_UBUNTU)
	directory_entity.add_shell_required_library(code_file_script_utilities)
	directory_entity.add_shell_required_library(code_file_config_reader)
	directory_entity.add_shell_required_variable_setters(SHELL_VARIABLES_SET_ENTITY_SERVER)

	# Live run.
	code_file_live_run = ShellFile('live_run')
	code_file_live_run.treat_paths_as_server_paths()
	code_file_live_run.add_required_variable_setters(CodeChunk(['IS_ENTITY_SERVER_RUNNING=$(python3 ${PATH_TO_IS_PROGRAM_RUNNING} ${PYTHON_ENTITY_SERVER})']))
	code_file_live_run.set_main_code(CodeChunk('''
if [ "${IS_ENTITY_SERVER_RUNNING}" == "true" ]; then
	echo 'Entity server is already running!'
else
	export PYTHONPATH=${PATH_TO_QUASAR_SOURCE}
	python3 ${PYTHON_ENTITY_SERVER} -r
fi
'''))

	# Restart.
	code_file_restart = ShellFile('restart')
	code_file_restart.treat_paths_as_server_paths()
	#code_file_restart.add_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_NOT_SUDO)
	code_file_restart.set_main_code(CodeChunk('''
sudo bash ${PYTHON_ENTITY_SCRIPT_TERMINATE}
sudo bash ${PYTHON_ENTITY_SCRIPT_RUN_IN_BACKGROUND}
'''))

	# Run in background.
	code_file_run_in_background = ShellFile('run_in_background')
	code_file_run_in_background.treat_paths_as_server_paths()
	#code_file_run_in_background.add_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_NOT_SUDO)
	code_file_run_in_background.add_required_variable_setters(CodeChunk(['IS_ENTITY_SERVER_RUNNING=$(python3 ${PATH_TO_IS_PROGRAM_RUNNING} ${PYTHON_ENTITY_SERVER})']))
	code_file_run_in_background.set_main_code(CodeChunk('''
if [ "${IS_ENTITY_SERVER_RUNNING}" == "true" ]; then
	echo 'Entity server is already running!'
else
	export PYTHONPATH=${PATH_TO_QUASAR_SOURCE}
	nohup python3 ${PYTHON_ENTITY_SERVER} -r &
fi
'''))

	# Status.
	code_file_status = ShellFile('status')
	code_file_status.treat_paths_as_server_paths()
	code_file_status.add_required_variable_setters(CodeChunk(['IS_ENTITY_SERVER_RUNNING=$(python3 ${PATH_TO_IS_PROGRAM_RUNNING} ${PYTHON_ENTITY_SERVER})']))
	code_file_status.set_main_code(CodeChunk('''
if [ "${IS_ENTITY_SERVER_RUNNING}" == "true" ]; then
	echo 'Entity server is currently running!'
else
	echo 'Entity server is currently not running!'
fi
'''))

	# Terminate.
	code_file_terminate = ShellFile('terminate')
	code_file_terminate.treat_paths_as_server_paths()
	#code_file_terminate.add_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_NOT_SUDO)
	code_file_terminate.set_main_code(CodeChunk('''
sudo pkill -f "${PYTHON_ENTITY_SERVER}"
'''))

	# Add the files to the directory.
	directory_entity.add_code_file(code_file_live_run)
	directory_entity.add_code_file(code_file_restart)
	directory_entity.add_code_file(code_file_run_in_background)
	directory_entity.add_code_file(code_file_status)
	directory_entity.add_code_file(code_file_terminate)


def load_quasar_directory(directory_server, code_file_script_utilities, code_file_config_reader):
	"""Loads the quasar directory."""
	directory_quasar = directory_server.add_new_child_code_directory_from_current_path('quasar', ShellDirectory)
	directory_quasar.add_shell_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_NOT_UBUNTU)
	directory_quasar.add_shell_required_library(code_file_script_utilities)
	directory_quasar.add_shell_required_library(code_file_config_reader)
	directory_quasar.add_shell_required_variable_setters(SHELL_VARIABLES_SET_ENTITY_SERVER)

	# Live run.
	code_file_live_run = ShellFile('live_run')
	code_file_live_run.treat_paths_as_server_paths()
	code_file_live_run.add_required_variable_setters(CodeChunk(['IS_QUASAR_SERVER_RUNNING=$(python3 ${PATH_TO_IS_PROGRAM_RUNNING} ${PYTHON_QUASAR_MANAGE_PATH})']))
	code_file_live_run.set_main_code(CodeChunk('''
if [ "${IS_QUASAR_SERVER_RUNNING}" == "true" ]; then
	echo 'Quasar server is already running!'
else
	export PYTHONPATH=${PATH_TO_QUASAR_SOURCE}
	python3 ${PYTHON_QUASAR_MANAGE_PATH} migrate
	python3 ${PYTHON_QUASAR_MANAGE_PATH} runserver 0:80
fi
'''))

	# Restart.
	code_file_restart = ShellFile('restart')
	code_file_restart.treat_paths_as_server_paths()
	#code_file_restart.add_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_NOT_SUDO)
	code_file_restart.set_main_code(CodeChunk('''
sudo bash ${PYTHON_QUASAR_SCRIPT_TERMINATE}
sudo bash ${PYTHON_QUASAR_SCRIPT_RUN_IN_BACKGROUND}
'''))

	# Run in background.
	code_file_run_in_background = ShellFile('run_in_background')
	code_file_run_in_background.treat_paths_as_server_paths()
	#code_file_run_in_background.add_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_NOT_SUDO)
	code_file_run_in_background.add_required_variable_setters(CodeChunk(['IS_QUASAR_SERVER_RUNNING=$(python3 ${PATH_TO_IS_PROGRAM_RUNNING} ${PYTHON_QUASAR_MANAGE_PATH})']))
	code_file_run_in_background.set_main_code(CodeChunk('''
if [ "${IS_QUASAR_SERVER_RUNNING}" == "true" ]; then
	echo 'Entity server is already running!'
else
	export PYTHONPATH=${PATH_TO_QUASAR_SOURCE}
	python3 ${PYTHON_QUASAR_MANAGE_PATH} migrate
	nohup python3 ${PYTHON_QUASAR_MANAGE_PATH} runserver 0:80 &
fi
'''))

	# Status.
	code_file_status = ShellFile('status')
	code_file_status.treat_paths_as_server_paths()
	code_file_status.add_required_variable_setters(CodeChunk(['IS_QUASAR_SERVER_RUNNING=$(python3 ${PATH_TO_IS_PROGRAM_RUNNING} ${PYTHON_QUASAR_MANAGE_PATH})']))
	code_file_status.set_main_code(CodeChunk('''
if [ "${IS_QUASAR_SERVER_RUNNING}" == "true" ]; then
	echo 'Quasar server is currently running!'
else
	echo 'Quasar server is currently not running!'
fi
'''))

	# Terminate.
	code_file_terminate = ShellFile('terminate')
	code_file_terminate.treat_paths_as_server_paths()
	#code_file_terminate.add_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_NOT_SUDO)
	code_file_terminate.set_main_code(CodeChunk('''
sudo pkill -f "${PYTHON_QUASAR_MANAGE_PATH}"
'''))

	# Add the files to the directory.
	directory_quasar.add_code_file(code_file_live_run)
	directory_quasar.add_code_file(code_file_restart)
	directory_quasar.add_code_file(code_file_run_in_background)
	directory_quasar.add_code_file(code_file_status)
	directory_quasar.add_code_file(code_file_terminate)
