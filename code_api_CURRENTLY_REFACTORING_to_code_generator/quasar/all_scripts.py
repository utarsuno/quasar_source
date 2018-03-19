# coding=utf-8

"""This module, all_scripts.py, defines all the script files used in Quasar."""

from code_api import code_file as cf
from code_api import code_directory as cd
from universal_code import path_manager as pm
from code_api.code_generator import shell_scripts_generator as ssg

# Utility variables.
RUN_IN_BACKGROUND = 'run_in_background.sh'
TERMINATE         = 'terminate.sh'
LIVE_RUN          = 'live_run.sh'
STATUS            = 'status.sh'
RESTART           = 'restart.sh'

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

'''__   ___  __        ___  __            __             __        __
  /__` |__  |__) \  / |__  |__)    __    /  \ |  |  /\  /__`  /\  |__)
  .__/ |___ |  \  \/  |___ |  \          \__X \__/ /~~\ .__/ /~~\ |  \ '''
# Quasar server scripts.
quasar = server_scripts.add_sub_directory('quasar')

# Restart script.
quasar_restart = quasar.add_code_file(RESTART)
quasar_restart.require_start_and_stop_print()
quasar_restart.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_SUDO)
quasar_restart.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_UBUNTU)
quasar_restart.add_main_logic('''sudo bash /home/git_repos/quasar_source/all_scripts/server/quasar/terminate.sh
sudo bash /home/git_repos/quasar_source/all_scripts/server/quasar/run_in_background.sh''')

# Status script.
quasar_status = quasar.add_code_file(STATUS)
quasar_status.require_start_and_stop_print()
quasar_status.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_UBUNTU)
quasar_status.add_main_logic('''is_django_running=$(python3 /home/git_repos/quasar_source/all_scripts/universal/is_program_running.py 'runserver')
if [ "${is_django_running}" == "true" ]; then
  echo 'Django is currently running!'
else
  echo 'Django is currently not running!'
fi''')

# Terminate script.
quasar_terminate = quasar.add_code_file(TERMINATE)
quasar_terminate.require_start_and_stop_print()
quasar_terminate.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_SUDO)
quasar_terminate.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_UBUNTU)
quasar_terminate.add_main_logic('''sudo pkill -f "runserver"''')

# Run in background script.
quasar_run_in_background = quasar.add_code_file(RUN_IN_BACKGROUND)
quasar_run_in_background.require_start_and_stop_print()
quasar_run_in_background.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_UBUNTU)
quasar_run_in_background.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_SUDO)
quasar_run_in_background.add_main_logic('''is_django_running=$(python3 /home/git_repos/quasar_source/all_scripts/universal/is_program_running.py 'runserver')
if [ "${is_django_running}" == "true" ]; then
  echo 'Django is already running!'
else
  export PYTHONPATH=/home/git_repos/quasar_source/
  python3 /home/git_repos/quasar_source/quasar_site_django/manage.py migrate
  nohup python3 /home/git_repos/quasar_source/quasar_site_django/manage.py runserver 0:80 &
fi''')

# Live run script.
quasar_live_run = quasar.add_code_file(LIVE_RUN)
quasar_live_run.require_start_and_stop_print()
quasar_live_run.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_UBUNTU)
quasar_live_run.add_main_logic('''is_django_running=$(python3 /home/git_repos/quasar_source/all_scripts/universal/is_program_running.py 'runserver')
if [ "${is_django_running}" == "true" ]; then
  echo 'Django is already running!'
else
  export PYTHONPATH=/home/git_repos/quasar_source/
  python3 /home/git_repos/quasar_source/quasar_site_django/manage.py migrate
  python3 /home/git_repos/quasar_source/quasar_site_django/manage.py runserver 0:80
fi''')

'''__   ___  __        ___  __            ___      ___   ___
  /__` |__  |__) \  / |__  |__)    __    |__  |\ |  |  |  |  \ /
  .__/ |___ |  \  \/  |___ |  \          |___ | \|  |  |  |   |  '''
# Entity server scripts.
entity = server_scripts.add_sub_directory('entity')

# Restart script.
entity_restart = entity.add_code_file(RESTART)
entity_restart.require_start_and_stop_print()
entity_restart.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_SUDO)
entity_restart.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_UBUNTU)
entity_restart.add_main_logic('''sudo bash /home/git_repos/quasar_source/all_scripts/server/entity/terminate.sh
sudo bash /home/git_repos/quasar_source/all_scripts/server/entity/run_in_background.sh''')

# Status script.
entity_status = entity.add_code_file(STATUS)
entity_status.require_start_and_stop_print()
entity_status.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_UBUNTU)
entity_status.add_main_logic('''is_entity_server_running=$(python3 /home/git_repos/quasar_source/all_scripts/universal/is_program_running.py '/home/git_repos/quasar_source/servers/entities/entity_server.py')
if [ "${is_entity_server_running}" == "true" ]; then
  echo 'Entity server is currently running!'
else
  echo 'Entity server is currently not running!'
fi''')

# Terminate script.
entity_terminate = entity.add_code_file(TERMINATE)
entity_terminate.require_start_and_stop_print()
entity_terminate.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_SUDO)
entity_terminate.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_UBUNTU)
entity_terminate.add_main_logic('''sudo pkill -f "/home/git_repos/quasar_source/servers/entities/entity_server.py"''')

# Live run script.
entity_live_run = entity.add_code_file(LIVE_RUN)
entity_live_run.require_start_and_stop_print()
entity_live_run.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_UBUNTU)
entity_live_run.add_main_logic('''is_entity_server_running=$(python3 /home/git_repos/quasar_source/all_scripts/universal/is_program_running.py '/home/git_repos/quasar_source/servers/entities/entity_server.py')
if [ "${is_entity_server_running}" == "true" ]; then
  echo 'Entity server is already running!'
else
  export PYTHONPATH=/home/git_repos/quasar_source/
  python3 /home/git_repos/quasar_source/servers/entities/entity_server.py -r
fi''')

# Run in background script.
entity_run_in_background = entity.add_code_file(RUN_IN_BACKGROUND)
entity_run_in_background.require_start_and_stop_print()
entity_run_in_background.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_UBUNTU)
entity_run_in_background.add_required_safety_check(ssg.SAFETY_CHECK_ONLY_ALLOW_SUDO)
entity_run_in_background.add_main_logic('''is_entity_server_running=$(python3 /home/git_repos/quasar_source/all_scripts/universal/is_program_running.py '/home/git_repos/quasar_source/servers/entities/entity_server.py')
if [ "${is_entity_server_running}" == "true" ]; then
  echo 'Entity server is already running!'
else
  export PYTHONPATH=/home/git_repos/quasar_source/
  nohup python3 /home/git_repos/quasar_source/servers/entities/entity_server.py -r &
fi''')

'''                 ___  __   __
  |  | |\ | | \  / |__  |__) /__`  /\  |
  \__/ | \| |  \/  |___ |  \ .__/ /~~\ |___ '''
#universal_scripts = all_scripts.add_sub_directory('universal')