# coding=utf-8

"""This module, server_scripts.py, manages the server scripts directory for the QuasarSource project."""

#from code_api.discrete_projects.predefined_code.shell_code import safety_checks as shell_safety_checks
from code_api.discrete_projects.predefined_code.shell_code import variable_setters as shell_variable_setters
from code_api.source_file_abstraction.code_files.shell_file import *


def load_server_scripts(directory_all_scripts, code_file_script_utilities, code_file_config_reader):
	"""Loads the server scripts."""

	'''__     __   ___  __  ___  __   __          __   ___  __        ___  __      __   __   __     __  ___  __
	  |  \ | |__) |__  /  `  |  /  \ |__) \ /    /__` |__  |__) \  / |__  |__)    /__` /  ` |__) | |__)  |  /__`
	  |__/ | |  \ |___ \__,  |  \__/ |  \  |     .__/ |___ |  \  \/  |___ |  \    .__/ \__, |  \ | |     |  .__/ '''
	directory_server = directory_all_scripts.add_new_child_code_directory_from_current_path('server', ShellDirectory)
	directory_server.add_shell_required_library(code_file_script_utilities)

	'''__   __   __   ___     ___         ___           __   __       ___  ___     __   __   __   ___
	  /  ` /  \ |  \ |__     |__  | |    |__  .   |  | |__) |  \  /\   |  |__     /  ` /  \ |  \ |__
	  \__, \__/ |__/ |___    |    | |___ |___ .   \__/ |    |__/ /~~\  |  |___    \__, \__/ |__/ |___ '''
	code_file_update_code = ShellFile('update_code')
	code_file_update_code.treat_paths_as_server_paths()
	code_file_update_code.add_required_library(code_file_config_reader)
	code_file_update_code.add_required_variable_setters(shell_variable_setters.SHELL_VARIABLES_SET_SERVER_SIDE)
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
	code_file_update_code.treat_paths_as_server_paths()
	code_file_force_update_code.add_required_library(code_file_config_reader)
	code_file_force_update_code.add_required_variable_setters(shell_variable_setters.SHELL_VARIABLES_SET_SERVER_SIDE)
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
