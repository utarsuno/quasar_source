# coding=utf-8

"""This module, quasar.py, generates all the local scripts that manage the Quasar server."""

from code_api.discrete_projects.predefined_code.shell_code.safety_checks import *
from code_api.discrete_projects.predefined_code.shell_code.variable_setters import *
from code_api.source_file_abstraction.code_files.shell_file import *
from code_api.source_file_abstraction.code_directories.shell_directory import ShellDirectory


def load_local_quasar_scripts(directory_local_scripts, code_file_script_utilities, code_file_config_reader):
	"""Loads the local scripts."""
	directory_quasar = directory_local_scripts.add_new_child_code_directory_from_current_path('quasar', ShellDirectory)
	directory_quasar.add_shell_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_UBUNTU)
	directory_quasar.add_shell_required_library(code_file_script_utilities)
	directory_quasar.add_shell_required_library(code_file_config_reader)

	directory_quasar.add_code_file(load_script_ssh())
	directory_quasar.add_code_file(load_script_generate_server_scripts())
	directory_quasar.add_code_file(load_code_push())

	return directory_quasar


def load_code_push():
	"""Generates the code push for Quasar script."""
	s = ShellFile('code_push')
	s.add_required_variable_setters(SHELL_VARIABLES_QUASAR_CONNECTION)
	s.add_required_variable_setters(SHELL_VARIABLES_SET_QUASAR_MAINTENANCE)
	s.add_required_variable_setters(SHELL_VARIABLES_QUASAR_PROJECT_SETUP)
	s.add_required_safety_check(SHELL_SAFETY_CHECK_TERMINATE_IF_SUDO)
	#s.add_safety_check_for_script_arguments(['commit_message', 'ensure_quasar_is_running'])
	s.add_safety_check_for_script_arguments(['commit_message'])
	s.set_main_code(CodeChunk('''
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
${UPDATE_SERVER_CODE_SERVER};
${HEALTH_CHECK_SERVER};
HERE

	# Now restart the Quasar server + ensure that it is running.
	#${PATH_TO_LOCAL_PYTHON3} ${PATH_TO_RESTART_QUASAR_SERVER}

fi
'''))
	return s


def load_script_ssh():
	"""Generate the SSH script."""
	script = ShellFile('ssh')
	script.add_required_variable_setters(SHELL_VARIABLES_QUASAR_CONNECTION)
	script.set_main_code(CodeChunk('''
ssh -t -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} "cd ${PATH_TO_SCRIPTS_SERVER} ; bash"
'''))
	return script


def load_script_generate_server_scripts():
	"""Generates the script that generates, transfers, and sets up the server scripts."""
	script = ShellFile('generate_server_scripts')
	script.add_required_variable_setters(SHELL_VARIABLES_QUASAR_CONNECTION)
	script.add_required_variable_setters(SHELL_VARIABLES_QUASAR_PROJECT_SETUP)
	script.set_main_code(CodeChunk('''
ssh -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} << HERE
mkdir -p ${QUASAR_PROJECT_BASE_DIRECTORY};
cd ${QUASAR_PROJECT_BASE_DIRECTORY};
mkdir -p ./all_scripts;
mkdir -p ./configurations;
cd ./all_scripts;
mkdir -p ./quasar_server;
mkdir -p ./entity_server;
HERE

scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${QUASAR_LIVE_RUN_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${QUASAR_LIVE_RUN_SERVER}
scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${QUASAR_RESTART_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${QUASAR_RESTART_SERVER}
scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${QUASAR_RUN_IN_BACKGROUND_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${QUASAR_RUN_IN_BACKGROUND_SERVER}
scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${QUASAR_TERMINATE_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${QUASAR_TERMINATE_SERVER}

scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${ENTITY_LIVE_RUN_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${ENTITY_LIVE_RUN_SERVER}
scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${ENTITY_RESTART_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${ENTITY_RESTART_SERVER}
scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${ENTITY_RUN_IN_BACKGROUND_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${ENTITY_RUN_IN_BACKGROUND_SERVER}
scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${ENTITY_TERMINATE_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${ENTITY_TERMINATE_SERVER}

scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${UPDATE_SERVER_CODE_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${UPDATE_SERVER_CODE_SERVER}
scp -P ${QUASAR_PORT} -i ${QUASAR_PEM_PATH} ${HEALTH_CHECK_LOCAL} ${QUASAR_USER}@${QUASAR_IP}:${HEALTH_CHECK_SERVER}

ssh -i ${QUASAR_PEM_PATH} ${QUASAR_USER}@${QUASAR_IP} -p ${QUASAR_PORT} << HERE
cd ${QUASAR_PROJECT_BASE_DIRECTORY};
cd ./all_scripts;
sudo chmod +x ./update_code.sh;
sudo chmod +x ./health_check.sh;
cd ./entity_server;
sudo chmod +x ./live_run.sh;
sudo chmod +x ./restart.sh;
sudo chmod +x ./run_in_background.sh;
sudo chmod +x ./terminate.sh;
cd ..;
cd ./quasar_server;
sudo chmod +x ./live_run.sh;
sudo chmod +x ./restart.sh;
sudo chmod +x ./run_in_background.sh;
sudo chmod +x ./terminate.sh;
HERE
'''))
	return script
