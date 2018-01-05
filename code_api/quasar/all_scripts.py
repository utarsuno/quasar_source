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
local_code_api_feature_test.add_main_logic('''python3 /Users/utarsuno/git_repos/quasar_source/code_api/quasar/quasar_code.py -ft''')

# Code push script.
local_dev_code_push = local_scripts.add_code_file('dev_code_push.sh')
local_dev_code_push.add_required_safety_check(ssg.SAFETY_CHECK_DONT_ALLOW_SUDO)
local_dev_code_push.require_start_and_stop_print()
local_dev_code_push.add_required_argument('the commit message')
local_dev_code_push.add_required_function(ssg._FUNCTION_PRINT_DOTTED_LINE)
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
local_ssh_to_nexus.add_required_variable(ssg._VARIABLE_NEXUS_IP)
local_ssh_to_nexus.add_required_variable(ssg._VARIABLE_NEXUS_PORT)
local_ssh_to_nexus.add_required_variable(ssg._VARIABLE_NEXUS_PEM_PATH)
local_ssh_to_nexus.add_required_variable(ssg._VARIABLE_NEXUS_USER)
local_ssh_to_nexus.add_main_logic('''ssh -t -i ${nexus_pem_path} "${nexus_user}@${nexus_ip}" -p ${nexus_port} "cd /home/git_repos/quasar_source/all_scripts/server/ ; bash"''')

'''__   ___  __        ___  __
  /__` |__  |__) \  / |__  |__)
  .__/ |___ |  \  \/  |___ |  \ '''
server_scripts = all_scripts.add_sub_directory('server')

# Update server code script.
server_scripts_update_server_code = server_scripts.add_code_file('update_server_code.sh')
server_scripts_update_server_code.require_start_and_stop_print()
#server_scripts_update_server_code.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_UBUNTU)
server_scripts_update_server_code.add_main_logic('''# Go to the projects base directory.
cd /home/git_repos/quasar_source;
git fetch --all;
reslog=$(git log HEAD..origin/master --oneline)
if [[ "${reslog}" != "" ]] ; then
    print_script_text "Updating the code base."
    # This resets to master.
    git reset --hard origin/master;
else
    # We do not have to update the code.
    print_script_text "The code base is already up to date so a pull will not be performed."
fi''')

# Update server code force clean script.
server_scripts_update_server_code_force_clean = server_scripts.add_code_file('update_server_code_force_clean.sh')
server_scripts_update_server_code_force_clean.require_start_and_stop_print()
server_scripts_update_server_code_force_clean.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_UBUNTU)
server_scripts_update_server_code_force_clean.add_main_logic('''# Go to the projects base directory.
cd /home/git_repos/quasar_source;
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
fi''')

# Quasar server scripts.
quasar = server_scripts.add_sub_directory('quasar')



# Status script.
quasar_status = quasar.add_code_file('status.sh')
quasar_status.require_start_and_stop_print()
quasar_status.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_UBUNTU)
quasar_status.add_main_logic('''is_django_running=$(python3 /home/git_repos/quasar_source/all_scripts/universal/is_program_running.py 'runserver')
if [ "${is_django_running}" == "true" ]; then
  echo 'Django is already running!'
else
  echo 'Django is not currently running!'
fi''')

# Terminate script.
quasar_terminate = quasar.add_code_file('terminate.sh')
quasar_terminate.require_start_and_stop_print()
quasar_terminate.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_SUDO)
quasar_terminate.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_UBUNTU)
quasar_terminate.add_main_logic('''sudo pkill -f "runserver"''')

# Run in background script.
quasar_run_in_background = quasar.add_code_file('run_in_background.sh')
quasar_run_in_background.require_start_and_stop_print()
quasar_run_in_background.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_UBUNTU)
quasar_run_in_background.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_SUDO)
quasar_run_in_background.add_main_logic('''is_django_running=$(python3 /home/git_repos/quasar_source/all_scripts/universal/is_program_running.py 'runserver')
if [ "${is_django_running}" == "true" ]; then
  echo 'Django is already running!'
else
  export PYTHONPATH=/home/git_repos/quasar_source/
  python3 /home/git_repos/quasar_source/quasar_source_code/quasar_site_django/manage.py migrate
  nohup python3 /home/git_repos/quasar_source/quasar_source_code/quasar_site_django/manage.py runserver 0:80 &
fi''')

# Live run script.
quasar_live_run = quasar.add_code_file('live_run.sh')
quasar_live_run.require_start_and_stop_print()
quasar_live_run.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_UBUNTU)
quasar_live_run.add_main_logic('''is_django_running=$(python3 /home/git_repos/quasar_source/all_scripts/universal/is_program_running.py 'runserver')
if [ "${is_django_running}" == "true" ]; then
  echo 'Django is already running!'
else
  export PYTHONPATH=/home/git_repos/quasar_source/
  python3 /home/git_repos/quasar_source/quasar_source_code/quasar_site_django/manage.py migrate
  python3 /home/git_repos/quasar_source/quasar_source_code/quasar_site_django/manage.py runserver 0:80
fi''')


# Entity server scripts.
entity = server_scripts.add_sub_directory('entity')


# Entity run script.
"""
entity_live_run = entity.add_code_file('live_run.sh')
entity_live_run.require_start_and_stop_print()
entity_live_run.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_UBUNTU)
entity_live_run.add_main_logic('''is_quasar_running=$(python3 /home/git_repos/quasar_source/all_scripts/universal/is_program_running.py 'quasar_live_run_flag')
if [ "${is_quasar_running}" == "true" ]; then
  echo 'Quasar is already running!'
else
  export PYTHONPATH=/home/git_repos/quasar_source/
  echo "TODO : Run Quasar here"
  #python3 /home/git_repos/quasar_source/quasar_source_code/quasar_site_django/manage.py migrate
  #python3 /home/git_repos/quasar_source/quasar_source_code/quasar_site_django/manage.py runserver 0:80
fi''')
"""

# Finance server scripts.


'''                 ___  __   __
  |  | |\ | | \  / |__  |__) /__`  /\  |
  \__/ | \| |  \/  |___ |  \ .__/ /~~\ |___ '''
#universal_scripts = all_scripts.add_sub_directory('universal')






# test push