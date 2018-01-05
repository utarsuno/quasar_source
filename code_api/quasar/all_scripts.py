# coding=utf-8

"""This module, all_scripts.py, defines all the script files used in Quasar."""

from code_api import code_file as cf
from code_api import code_directory as cd
from universal_code import path_manager as pm
from code_api.code_generator import shell_scripts_generator as ssg


all_scripts = cd.CodeDirectory(pm.PATH_TO_ALL_SCRIPTS_DIRECTORY)

'''     __   __
  |    /  \ /  `  /\  |
  |___ \__/ \__, /~~\ |___ '''
# Local scripts.
local_scripts = all_scripts.add_sub_directory('local')
# Code API scripts.
local_code_api = local_scripts.add_sub_directory('code_api')
# Feature test script.
local_code_api_feature_test = local_code_api.add_code_file('feature_test.sh')
local_code_api_feature_test.add_required_safety_check(ssg.SAFETY_CHECK_DONT_ALLOW_SUDO)
local_code_api_feature_test.add_required_safety_check(ssg.SAFETY_CHECK_DONT_ALLOW_UBUNTU)
local_code_api_feature_test.require_start_and_stop_print()

# Code push script.
local_dev_code_push = local_scripts.add_code_file('dev_code_push.sh')
local_dev_code_push.add_required_safety_check(ssg.SAFETY_CHECK_DONT_ALLOW_SUDO)
local_dev_code_push.add_required_safety_check(ssg.SAFETY_CHECK_DONT_ALLOW_UBUNTU)
local_dev_code_push.require_start_and_stop_print()
local_dev_code_push.add_required_argument('the commit message')
local_dev_code_push.add_required_function(ssg._FUNCTION_PRINT_DASHED_LINE_WITH_TEXT)
local_dev_code_push.add_required_variable(ssg._VARIABLE_NEXUS_IP)
local_dev_code_push.add_required_variable(ssg._VARIABLE_NEXUS_PORT)
local_dev_code_push.add_required_variable(ssg._VARIABLE_NEXUS_PEM_PATH)
local_dev_code_push.add_required_variable(ssg._VARIABLE_NEXUS_USER)
local_dev_code_push.add_main_logic('''if output=$(git status --porcelain) && [ -z "$output" ]; then
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

    ssh -i ${nexus_pem_path} "${nexus_user}@${nexus_ip}" -p ${nexus_port} << HERE
    bash /home/git_repos/quasar_source/all_scripts/server/update_server_code.sh;
HERE

fi''')

# Connect to server script.
local_ssh_to_nexus = local_scripts.add_code_file('ssh_to_nexus.sh')

'''__   ___  __        ___  __
  /__` |__  |__) \  / |__  |__)
  .__/ |___ |  \  \/  |___ |  \ '''
#server_scripts = all_scripts.add_sub_directory('server')


'''                 ___  __   __
  |  | |\ | | \  / |__  |__) /__`  /\  |
  \__/ | \| |  \/  |___ |  \ .__/ /~~\ |___ '''
#universal_scripts = all_scripts.add_sub_directory('universal')





