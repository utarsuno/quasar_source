# coding=utf-8

"""This module, all_scripts.py, manages the all_scripts directory for the QuasarSource project."""

from code_api.project_abstraction.project_component import ProjectComponent
from code_api.source_file_abstraction.code_directory import CodeDirectory
from code_api.source_file_abstraction.code_files.code_file import *
from code_api.source_file_abstraction.code_files.shell_file import *
from universal_code import path_manager as pm



quasar_component_all_scripts = ProjectComponent('all_scripts')


# Create the specific code directories and their files that make up the 'all_scripts_component'.


directory_all_scripts = CodeDirectory(pm.DIRECTORY_QUASAR_SOURCE_BASE + 'all_scripts')

directory_local = directory_all_scripts.add_new_child_code_directory_from_current_path('local')
directory_server = directory_all_scripts.add_new_child_code_directory_from_current_path('server')
directory_libraries = directory_all_scripts.add_new_child_code_directory_from_current_path('libraries')


# Script utilities script.
code_file_script_utilities = ShellFile('script_utilities')
directory_libraries.add_code_file(code_file_script_utilities)

# Local scripts.
code_file_code_push = ShellFile('code_push')
code_file_code_push.add_required_library(code_file_script_utilities)

directory_local.add_code_file(code_file_code_push)





code_file_code_push.generate_file_code()
file_code = code_file_code_push.file_code

for l in file_code:
	print(l, end='')
