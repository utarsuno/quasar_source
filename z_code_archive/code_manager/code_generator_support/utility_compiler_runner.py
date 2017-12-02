# coding=utf-8

"""
This module, utility_compiler_runner.py, enables the compiler to be easily run through a bash script like interface.
"""

from os import listdir
from os.path import isfile, join
from code_manager.code_generator_support import code_generator_compiler
from code_manager.code_generator_support import generator_parser

import sys
sys.path.append('/Users/utarsuno/git_repos/urbtek/urbtek')
print(sys.path)

base = '/Users/utarsuno/git_repos/urbtek/urbtek/code_manager/'
abstract_definitions_path           = base + 'abstract_definitions'
code_generation_projects_path       = base + 'code_generation_projects/'
temporary_output_path               = code_generation_projects_path + 'temporary_output/'
urbtek_generator_path               = code_generation_projects_path + 'urbtek_generator/'
code_generator_compiler_path        = base + 'code_generator_compiler'
miscellaneous_scripts_path          = base + 'miscellaneous_scripts'


all_files_in_urbtek_generator = [f for f in listdir(urbtek_generator_path) if isfile(join(urbtek_generator_path, f))]
all_files_in_urbtek_generator.remove('__init__.py')


files = []
for i, f in enumerate(all_files_in_urbtek_generator):
	files.append([i, f])
	print(str(i) + '\t' + str(f))
print('Enter in the file to get compiled and generated : ', end='')

user_input = int(input())

if user_input < 0 or user_input > len(files):
	print('The input ' + str(user_input) + ' is out of range of [0...' + str(len(files)) + ']')
	print('Program is now terminating.')
	exit(0)

lazy_solution = {'table_definitions_generator.py'     : ['/Users/utarsuno/git_repos/urbtek/urbtek/code_manager/code_generation_projects/urbtek_generator/table_definitions_generator.py', '/Users/utarsuno/git_repos/urbtek/urbtek/code_manager/code_generation_projects/temporary_output/table_definitions_temp.py', '/Users/utarsuno/git_repos/urbtek/urbtek/database/table_definitions.py'],
                 'database_api_generator.py'          : ['/Users/utarsuno/git_repos/urbtek/urbtek/code_manager/code_generation_projects/urbtek_generator/database_api_generator.py', '/Users/utarsuno/git_repos/urbtek/urbtek/code_manager/code_generation_projects/temporary_output/database_api_temp.py', '/Users/utarsuno/git_repos/urbtek/urbtek/database/database_api.py'],
                 'anything_time_related_generator.py' : ['/Users/utarsuno/git_repos/urbtek/urbtek/code_manager/code_generation_projects/urbtek_generator/anything_time_related_generator.py', '/Users/utarsuno/git_repos/urbtek/urbtek/code_manager/code_generation_projects/temporary_output/anything_time_related_temp.py', '/Users/utarsuno/git_repos/urbtek/urbtek/universal_code/anything_time_related.py']}

user_choice = files[user_input][1]

if user_choice not in lazy_solution.keys():
	print('Sorry that generation file is not supported yet!')
	exit(0)
else:
	print('Run the generation here!')
	codes = generator_parser.get_generation_file_as_code_objects(lazy_solution[user_choice][0])
	code_generator_compiler.compile_generation_file(codes, lazy_solution[user_choice][1], lazy_solution[user_choice][2])


