# coding=utf-8

"""This module, run_all_unit_tests.py, will run all found unit python unit tests for this project."""

# TODO : This module will require the subprocess module (it exists but will take time to make a quality assured version).

# So for now test files are ran manually-ish.


# TODO : Have a process that will auto-comment on functions with their latest test results.


# Used to get the current path.
import os


_path_base                              = os.path.abspath(__file__).replace('run_all_unit_tests.py', '')
_path_testing_content                   = _path_base + 'testing_content/'

# The following paths are used for 'useful_file_operations_tests.py'.
_path_files_and_directories             = _path_testing_content + 'files_and_directories/'

path_directory_empty                    = _path_files_and_directories + 'directory_empty/'
path_directory_empty_version_two        = _path_files_and_directories + 'directory_empty.version_two/'
path_directory_non_empty                = _path_files_and_directories + 'directory_non_empty/'
path_directory_non_existent             = _path_files_and_directories + 'directory_non_existent/'

path_text_file_empty                    = path_directory_non_empty + 'text_file_empty.txt'
path_text_file_no_extension             = path_directory_non_empty + 'text_file_no_extension'
path_text_file_extension_of_just_period = path_directory_non_empty + 'text_file_no_extension_with_ending_period.'
path_text_file_multiple_extensions      = path_directory_non_empty + 'text_file_multiple_extensions.png.txt.zip.apples'
path_text_file_non_empty                = path_directory_non_empty + 'text_file_non_empty.txt'
path_text_file_non_existent             = path_directory_non_empty + 'text_file_non_existent.txt'
