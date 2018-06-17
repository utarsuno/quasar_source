# coding=utf-8

"""This module, library_scripts.py, manages the library scripts directory for the QuasarSource project."""

from code_api.source_file_abstraction.code_files.shell_file import *


def load_library_scripts(directory_all_scripts):
	"""Loads the library scripts."""
	'''__     __   ___  __  ___  __   __                 __   __        __          __   __   __     __  ___  __
	  |  \ | |__) |__  /  `  |  /  \ |__) \ /    |    | |__) |__)  /\  |__) \ /    /__` /  ` |__) | |__)  |  /__`
	  |__/ | |  \ |___ \__,  |  \__/ |  \  |     |___ | |__) |  \ /~~\ |  \  |     .__/ \__, |  \ | |     |  .__/ '''
	directory_libraries = directory_all_scripts.add_new_child_code_directory_from_current_path('libraries')
	directory_libraries.set_to_non_generatable()

	'''__   __   __     __  ___            __   __        __     ___  __
	  /__` /  ` |__) | |__)  |     |    | |__) |__)  /\  |__) | |__  /__`
	  .__/ \__, |  \ | |     |     |___ | |__) |  \ /~~\ |  \ | |___ .__/ '''
	# Library script utilities.
	code_file_script_utilities = ShellFile('script_utilities')

	# Library config reader local.
	code_file_config_reader_local = ShellFile('config_reader_local')
	# Library config reader server.
	code_file_config_reader_server = ShellFile('config_reader_server')

	'''__     __   ___  __  ___  __   __                 __   __        __                 __   __      __   __   __   ___     ___         ___  __
	  |  \ | |__) |__  /  `  |  /  \ |__) \ /    |    | |__) |__)  /\  |__) \ /       /\  |  \ |  \    /  ` /  \ |  \ |__     |__  | |    |__  /__`
	  |__/ | |  \ |___ \__,  |  \__/ |  \  |     |___ | |__) |  \ /~~\ |  \  |  .    /~~\ |__/ |__/    \__, \__/ |__/ |___    |    | |___ |___ .__/ '''
	directory_libraries.add_code_file(code_file_script_utilities)
	directory_libraries.add_code_file(code_file_config_reader_local)
	directory_libraries.add_code_file(code_file_config_reader_server)

	return code_file_script_utilities, code_file_config_reader_local, code_file_config_reader_server
