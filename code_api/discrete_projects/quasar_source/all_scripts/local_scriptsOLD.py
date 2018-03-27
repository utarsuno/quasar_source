# coding=utf-8

"""This module, local_scripts.py, manages the local scripts directory for the QuasarSource project."""

from code_api.discrete_projects.predefined_code.shell_code.safety_checks import *
from code_api.discrete_projects.predefined_code.shell_code.variable_setters import *
from code_api.source_file_abstraction.code_files.shell_file import *
from code_api.source_file_abstraction.code_directories.shell_directory import ShellDirectory


def generate_script_set_all_needed_server_scripts_to_runnable():
	"""Generate the script to set all needed server scripts to runnable."""
	quasar_set_scripts_to_runnable = ShellFile('set_scripts_to_runnable')
	quasar_set_scripts_to_runnable.add_required_variable_setters(SHELL_VARIABLES_SET_QUASAR)
	quasar_set_scripts_to_runnable.add_required_variable_setters(SHELL_VARIABLES_SET_SERVER_SIDE)
	quasar_set_scripts_to_runnable.add_required_variable_setters(SHELL_VARIABLES_SET_QUASAR_MAINTENANCE)
	quasar_set_scripts_to_runnable.set_main_code(CodeChunk('''
ssh -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} << HERE
sudo chmod +x ${PATH_QUASAR_SERVER_LIVE_RUN};
sudo chmod +x ${PATH_QUASAR_SERVER_RESTART};
sudo chmod +x ${PATH_QUASAR_SERVER_RUN_IN_BACKGROUND};
sudo chmod +x ${PATH_QUASAR_SERVER_STATUS};
sudo chmod +x ${PATH_QUASAR_SERVER_TERMINATE};
HERE
	'''))


def load_local_scripts(directory_all_scripts, code_file_script_utilities, code_file_config_reader):
	"""Loads the local scripts."""

	'''__     __   ___  __  ___  __   __               __   __                __   __   __     __  ___  __
	  |  \ | |__) |__  /  `  |  /  \ |__) \ /    |    /  \ /  `  /\  |       /__` /  ` |__) | |__)  |  /__`
	  |__/ | |  \ |___ \__,  |  \__/ |  \  |     |___ \__/ \__, /~~\ |___    .__/ \__, |  \ | |     |  .__/ '''
	directory_local = directory_all_scripts.add_new_child_code_directory_from_current_path('local', ShellDirectory)
	directory_local.add_shell_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_UBUNTU)
	directory_local.add_shell_required_library(code_file_script_utilities)
	directory_local.add_shell_required_library(code_file_config_reader)

	'''__     __   ___  __  ___  __   __           __             __        __
	  |  \ | |__) |__  /  `  |  /  \ |__) \ / .   /  \ |  |  /\  /__`  /\  |__)
	  |__/ | |  \ |___ \__,  |  \__/ |  \  |  .   \__X \__/ /~~\ .__/ /~~\ |  \ '''
	quasar_directory = directory_local.add_new_child_code_directory_from_current_path('quasar', ShellDirectory)
	quasar_directory.add_shell_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_UBUNTU)
	quasar_directory.add_shell_required_library(code_file_script_utilities)
	quasar_directory.add_shell_required_library(code_file_config_reader)

	'''     __   __                __   __   __     __  ___         ___      ___   ___         __   ___  __        ___  __      __  ___      ___       __
	  |    /  \ /  `  /\  |       /__` /  ` |__) | |__)  |     .   |__  |\ |  |  |  |  \ /    /__` |__  |__) \  / |__  |__)    /__`  |   /\   |  |  | /__`
	  |___ \__/ \__, /~~\ |___    .__/ \__, |  \ | |     |     .   |___ | \|  |  |  |   |     .__/ |___ |  \  \/  |___ |  \    .__/  |  /~~\  |  \__/ .__/ '''
	code_file_entity_server_status = ShellFile('entity_server_status')
	code_file_entity_server_status.add_required_variable_setters(SHELL_VARIABLES_SET_QUASAR)
	code_file_entity_server_status.add_required_variable_setters(SHELL_VARIABLES_SET_SERVER_SIDE)
	code_file_entity_server_status.add_required_variable_setters(SHELL_VARIABLES_SET_QUASAR_MAINTENANCE)
	code_file_entity_server_status.set_main_code(CodeChunk('''
# Quasar server + database.
ssh -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} << HERE
bash "${PATH_TO_ENTITY_SERVER_STATUS}";
HERE
'''))

	'''     __   __                __   __   __     __  ___         ___      ___   ___         __   ___  __        ___  __      __   ___  __  ___       __  ___
	  |    /  \ /  `  /\  |       /__` /  ` |__) | |__)  |     .   |__  |\ |  |  |  |  \ /    /__` |__  |__) \  / |__  |__)    |__) |__  /__`  |   /\  |__)  |
	  |___ \__/ \__, /~~\ |___    .__/ \__, |  \ | |     |     .   |___ | \|  |  |  |   |     .__/ |___ |  \  \/  |___ |  \    |  \ |___ .__/  |  /~~\ |  \  |  '''
	code_file_entity_server_restart = ShellFile('entity_server_restart')
	code_file_entity_server_restart.add_required_variable_setters(SHELL_VARIABLES_SET_QUASAR)
	code_file_entity_server_restart.add_required_variable_setters(SHELL_VARIABLES_SET_SERVER_SIDE)
	code_file_entity_server_restart.add_required_variable_setters(SHELL_VARIABLES_SET_QUASAR_MAINTENANCE)
	code_file_entity_server_restart.set_main_code(CodeChunk('''
# Quasar server + database.
ssh -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} << HERE
bash "${PATH_TO_ENTITY_SERVER_RESTART}";
HERE
'''))

	'''     __   __                __   __   __     __  ___         __   __   __   ___      __        __            __             __        __
	  |    /  \ /  `  /\  |       /__` /  ` |__) | |__)  |     .   /  ` /  \ |  \ |__      |__) |  | /__` |__|     /  \ |  |  /\  /__`  /\  |__)
	  |___ \__/ \__, /~~\ |___    .__/ \__, |  \ | |     |     .   \__, \__/ |__/ |___ ___ |    \__/ .__/ |  | ___ \__X \__/ /~~\ .__/ /~~\ |  \ '''
	code_file_code_push_quasar = ShellFile('code_push')
	code_file_code_push_quasar.add_required_variable_setters(SHELL_VARIABLES_SET_QUASAR)
	code_file_code_push_quasar.add_required_variable_setters(SHELL_VARIABLES_SET_SERVER_SIDE)
	code_file_code_push_quasar.add_required_variable_setters(SHELL_VARIABLES_SET_QUASAR_MAINTENANCE)
	code_file_code_push_quasar.add_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_SUDO)
	code_file_code_push_quasar.add_safety_check_for_script_arguments(['commit_message', 'ensure_quasar_is_running'])
	code_file_code_push_quasar.set_main_code(CodeChunk('''
if output=$(git status --porcelain) && [ -z "$output" ]; then
	# Working directory clean
	print_script_text "The working directory is clean so no commit will be made."
else
	# First generate the production version of Quasar.
	${PATH_TO_LOCAL_PYTHON3} ${PATH_TO_QUASAR_MAINTENANCE} ${QUASAR_MAINTENANCE_FLAG_CREATE_PRODUCTION}

	# There are uncommitted changes.
	print_script_text "Pushing the code changes."

    print_dotted_line
    # This will add all files, new files, changes, and removed files.
    git add -A;
    git commit -m "$1";
    git push --force;
    print_dotted_line

    # Quasar server + database.
    ssh -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} << HERE
    bash "${PATH_TO_UPDATE_SERVER_CODE_SCRIPT}";
HERE

	# Now restart the Quasar server + ensure that it is running.
	${PATH_TO_LOCAL_PYTHON3} ${PATH_TO_RESTART_QUASAR_SERVER}

fi
'''))

	'''     __   __                __   __   __     __  ___         __   __   __   ___     __        __
	  |    /  \ /  `  /\  |       /__` /  ` |__) | |__)  |     .   /  ` /  \ |  \ |__     |__) |  | /__` |__|
	  |___ \__/ \__, /~~\ |___    .__/ \__, |  \ | |     |     .   \__, \__/ |__/ |___    |    \__/ .__/ |  | '''
	code_file_code_push_all = ShellFile('code_push_all')

	code_file_code_push_all.add_required_variable_setters(SHELL_VARIABLES_SET_QUASAR)
	code_file_code_push_all.add_required_variable_setters(SHELL_VARIABLES_SET_DATABOI)
	code_file_code_push_all.add_required_variable_setters(SHELL_VARIABLES_SET_SERVER_SIDE)

	code_file_code_push_all.add_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_SUDO)
	code_file_code_push_all.add_safety_check_for_script_arguments(['commit_message'])

	code_file_code_push_all.set_main_code(CodeChunk('''
if output=$(git status --porcelain) && [ -z "$output" ]; then
	# Working directory clean
	print_script_text "The working directory is clean so no commit will be made."
else
	# There are uncommitted changes.
	print_script_text "Pushing the code changes."

    print_dotted_line
    # This will add all files, new files, changes, and removed files.
    git add -A;
    git commit -m "$1";
    git push --force;
    print_dotted_line

    # Quasar server + database.
    ssh -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} << HERE
    bash "${PATH_TO_UPDATE_SERVER_CODE_SCRIPT}";
HERE

    # Data server for historical book orders.
    ssh -i ${DATABOI_PEM_PATH} ${DATABOI_USER}@${DATABOI_IP} -p ${DATABOI_PORT} << HERE
    bash "${PATH_TO_UPDATE_SERVER_CODE_SCRIPT}";
HERE

fi
'''))


	'''     __   __                __   __   __     __  ___         __   __          ___  __      __             __        __
	  |    /  \ /  `  /\  |       /__` /  ` |__) | |__)  |     .   /__` /__` |__|     |  /  \    /  \ |  |  /\  /__`  /\  |__)
	  |___ \__/ \__, /~~\ |___    .__/ \__, |  \ | |     |     .   .__/ .__/ |  |     |  \__/    \__X \__/ /~~\ .__/ /~~\ |  \ '''
	code_file_ssh_to_quasar = ShellFile('ssh')

	code_file_ssh_to_quasar.add_required_variable_setters(SHELL_VARIABLES_SET_QUASAR)
	code_file_ssh_to_quasar.add_required_variable_setters(SHELL_VARIABLES_SET_SERVER_SIDE)

	code_file_ssh_to_quasar.set_main_code(CodeChunk('''
ssh -t -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} "cd ${PATH_TO_SCRIPTS_SERVER} ; bash"
'''))

	'''     __   __                __   __   __     __  ___         __   __          ___  __      __   __   __           __       ___
	  |    /  \ /  `  /\  |       /__` /  ` |__) | |__)  |     .   /__` /__` |__|     |  /  \    |__) /  \ /  \ |__/    |  \  /\   |   /\
	  |___ \__/ \__, /~~\ |___    .__/ \__, |  \ | |     |     .   .__/ .__/ |  |     |  \__/    |__) \__/ \__/ |  \    |__/ /~~\  |  /~~\ '''
	code_file_ssh_to_book_data = ShellFile('ssh_to_book_data')

	code_file_ssh_to_book_data.add_required_variable_setters(SHELL_VARIABLES_SET_DATABOI)
	code_file_ssh_to_book_data.add_required_variable_setters(SHELL_VARIABLES_SET_SERVER_SIDE)

	code_file_ssh_to_book_data.set_main_code(CodeChunk('''
ssh -t -i ${DATABOI_PEM_PATH} ${DATABOI_USER}@${DATABOI_IP} -p ${DATABOI_PORT} "cd ${PATH_TO_SCRIPTS_FINANCE} ; bash"
'''))

	'''     __   __                __   __   __     __  ___     ___  __             __   ___  ___  __      __   ___  __        ___  __                  ___         ___
	  |    /  \ /  `  /\  |       /__` /  ` |__) | |__)  |  .    |  |__)  /\  |\ | /__` |__  |__  |__)    /__` |__  |__) \  / |__  |__)    | |\ | |    |__  | |    |__
	  |___ \__/ \__, /~~\ |___    .__/ \__, |  \ | |     |  .    |  |  \ /~~\ | \| .__/ |    |___ |  \    .__/ |___ |  \  \/  |___ |  \    | | \| |    |    | |___ |___ '''
	code_file_transfer_server_ini_file = ShellFile('transfer_ini_file_to_servers')

	code_file_transfer_server_ini_file.add_required_variable_setters(SHELL_VARIABLES_SET_QUASAR)
	code_file_transfer_server_ini_file.add_required_variable_setters(SHELL_VARIABLES_SET_DATABOI)
	code_file_transfer_server_ini_file.add_required_variable_setters(SHELL_VARIABLES_SET_CLIENT_SIDE)

	code_file_transfer_server_ini_file.add_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_SUDO)

	code_file_transfer_server_ini_file.set_main_code(CodeChunk('''
# Create the config file directory if it does not exist.
ssh -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} "mkdir -p ${PATH_TO_CONFIG_DIRECTORY_FOR_SERVERS}"

# Create the config file directory if it does not exist.
ssh -i ${DATABOI_PEM_PATH} ${DATABOI_USER}@${DATABOI_IP} -p ${DATABOI_PORT} "mkdir -p ${PATH_TO_CONFIG_DIRECTORY_FOR_SERVERS}"

scp -P ${DATABOI_PORT} -i ${DATABOI_PEM_PATH} ${PATH_TO_LOCAL_CONFIG_FILE_FOR_SERVERS} ${DATABOI_USER}@${DATABOI_IP}:${PATH_TO_CONFIG_FILE_FOR_SERVERS}
scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${PATH_TO_LOCAL_CONFIG_FILE_FOR_SERVERS} ${QUASAR_USER}@${QUASAR_IP}:${PATH_TO_CONFIG_FILE_FOR_SERVERS}
'''))

	'''__     __   ___  __  ___  __   __               __   __                       __   __      __   __   __   ___     ___         ___  __
	  |  \ | |__) |__  /  `  |  /  \ |__) \ /    |    /  \ /  `  /\  |          /\  |  \ |  \    /  ` /  \ |  \ |__     |__  | |    |__  /__`
	  |__/ | |  \ |___ \__,  |  \__/ |  \  |     |___ \__/ \__, /~~\ |___ .    /~~\ |__/ |__/    \__, \__/ |__/ |___    |    | |___ |___ .__/ '''
	quasar_directory.add_code_file(code_file_entity_server_status)
	quasar_directory.add_code_file(code_file_code_push_quasar)
	quasar_directory.add_code_file(code_file_entity_server_restart)
	directory_local.add_code_file(code_file_code_push_all)
	quasar_directory.add_code_file(code_file_ssh_to_quasar)
	directory_local.add_code_file(code_file_ssh_to_book_data)
	directory_local.add_code_file(code_file_transfer_server_ini_file)
