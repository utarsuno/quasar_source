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
