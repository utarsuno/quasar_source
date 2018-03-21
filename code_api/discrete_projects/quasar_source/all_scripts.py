# coding=utf-8

"""This module, all_scripts.py, manages the all_scripts directory for the QuasarSource project."""

from code_api.project_abstraction.project_component import ProjectComponent
from code_api.source_file_abstraction.code_directory import *
from code_api.source_file_abstraction.code_files.code_file import *
from code_api.source_file_abstraction.code_files.shell_file import *
from universal_code import path_manager as pm
from code_api.discrete_projects.predefined_code.shell_code import safety_checks as shell_safety_checks
from code_api.discrete_projects.predefined_code.shell_code import variable_setters as shell_variable_setters

quasar_component_all_scripts = ProjectComponent('all_scripts')


# Create the specific code directories and their files that make up the 'all_scripts_component'.


directory_all_scripts = CodeDirectory(pm.DIRECTORY_QUASAR_SOURCE_BASE + 'all_scripts')

# LOCAL DIRECTORY.
directory_local = directory_all_scripts.add_new_child_code_directory_from_current_path('local', ShellDirectory)
directory_local.add_shell_required_safety_check(shell_safety_checks.SHELL_SAFETY_CHECK_TERMINATE_IF_UBUNTU)

directory_server = directory_all_scripts.add_new_child_code_directory_from_current_path('server')
directory_libraries = directory_all_scripts.add_new_child_code_directory_from_current_path('libraries')


# Library script utilities.
code_file_script_utilities = ShellFile('script_utilities')
directory_libraries.add_code_file(code_file_script_utilities)

# Library config reader.
code_file_config_reader = ShellFile('config_reader')
directory_libraries.add_code_file(code_file_config_reader)


# Local scripts.
code_file_code_push = ShellFile('code_push')

code_file_code_push.add_required_library(code_file_script_utilities)
code_file_code_push.add_required_library(code_file_config_reader)

code_file_code_push.add_required_variable_setters(shell_variable_setters.SHELL_VARIABLES_SET_QUASAR)
code_file_code_push.add_required_variable_setters(shell_variable_setters.SHELL_VARIABLES_SET_DATABOI)
code_file_code_push.add_required_variable_setters(shell_variable_setters.SHELL_VARIABLES_SET_SERVER_SIDE)

code_file_code_push.add_safety_check_for_script_arguments(['commit_message'])

code_file_code_push.set_main_code(CodeChunk('''
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
    ssh -i ${QUASAR_PEM_PATH} "${QUASAR_USER}@${QUASAR_IP}" -p ${QUASAR_PORT} << HERE
    bash "${PATH_TO_UPDATE_SERVER_SCRIPT}";
HERE

    # Data server for historical book orders.
    ssh "${DATABOI_USER}@${DATABOI_IP}" << HERE
    bash "${PATH_TO_UPDATE_SERVER_SCRIPT}";
HERE

fi
'''))


directory_local.add_code_file(code_file_code_push)






code_file_code_push.generate_file_code()
code_file_code_push.create_or_update_file()

#file_code = code_file_code_push.file_code
#
#for l in file_code:
#	print(l, end='')




