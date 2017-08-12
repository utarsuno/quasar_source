# coding=utf-8

"""This module, run_all_unit_tests.py, will run all found unit python unit tests for this project."""

# TODO : This module will require the subprocess module (it exists but will take time to make a quality assured version).

# So for now test files are ran manually-ish.


# TODO : Have a process that will auto-comment on functions with their latest test results.


# Used to get the current path.
import os


_path_base                       = os.path.abspath(__file__).replace('run_all_unit_tests.py', '')
_path_testing_content            = _path_base + 'testing_content/'

# The following paths are used for 'useful_file_operations_tests.py'.
_path_files_and_directories      = _path_testing_content + 'files_and_directories/'

PATH_DIRECTORY_EMPTY             = _path_files_and_directories + 'directory_empty/'
PATH_DIRECTORY_EMPTY_VERSION_TWO = _path_files_and_directories + 'directory_empty.version_two/'
PATH_DIRECTORY_NON_EMPTY         = _path_files_and_directories + 'directory_non_empty/'
PATH_DIRECTORY_NON_EXISTENT      = _path_files_and_directories + 'directory_non_existent/'

# The names of all test files.
FILE_EMPTY                       = 'file_empty.txt'
FILE_NO_EXTENSION                = 'file_no_extension'
FILE_EXTENSION_JUST_PERIOD       = 'file_extension_just_period.'
FILE_MULTIPLE_EXTENSIONS         = 'file_multiple_extensions.png.txt.zip.apples'
FILE_NON_EMPTY                   = 'file_non_empty.txt'
FILE_NON_EXISTENT                = 'file_non_existent.txt'
FILE_DICTIONARY_INI              = 'dictionaries.ini'
FILE_HELLO_WORLD_SCRIPT          = 'hello_world.script'
ALL_FILE_NAMES                   = [FILE_EMPTY, FILE_NO_EXTENSION, FILE_EXTENSION_JUST_PERIOD, FILE_MULTIPLE_EXTENSIONS, FILE_NON_EMPTY, FILE_DICTIONARY_INI, FILE_HELLO_WORLD_SCRIPT]

PATH_FILE_EMPTY                  = PATH_DIRECTORY_NON_EMPTY + FILE_EMPTY
PATH_FILE_NO_EXTENSION           = PATH_DIRECTORY_NON_EMPTY + FILE_NO_EXTENSION
PATH_FILE_EXTENSION_JUST_PERIOD  = PATH_DIRECTORY_NON_EMPTY + FILE_EXTENSION_JUST_PERIOD
PATH_FILE_MULTIPLE_EXTENSIONS    = PATH_DIRECTORY_NON_EMPTY + FILE_MULTIPLE_EXTENSIONS
PATH_FILE_NON_EMPTY              = PATH_DIRECTORY_NON_EMPTY + FILE_NON_EMPTY
PATH_FILE_NON_EXISTENT           = PATH_DIRECTORY_NON_EMPTY + FILE_NON_EXISTENT
PATH_FILE_DICTIONARY_INI         = PATH_DIRECTORY_NON_EMPTY + FILE_DICTIONARY_INI
PATH_FILE_HELLO_WORLD_SCRIPT     = _path_testing_content + 'hello_world.script'
ALL_FILE_PATHS                   = [PATH_FILE_EMPTY, PATH_FILE_NO_EXTENSION, PATH_FILE_EXTENSION_JUST_PERIOD, PATH_FILE_MULTIPLE_EXTENSIONS, PATH_FILE_NON_EMPTY, PATH_FILE_DICTIONARY_INI, PATH_FILE_HELLO_WORLD_SCRIPT]
