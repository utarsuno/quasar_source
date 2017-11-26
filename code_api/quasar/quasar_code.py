# coding=utf-8

"""This module, quasar_builder.py, is used for producing the DEV, QA, and PROD versions of Quasar."""

from quasar_source_code.universal_code import useful_file_operations as ufo

# Pretty printing!
from lazyme.string import color_print
# Used to get arguments passed into the program.
import sys
# Abstraction to code files.
from code_api import lines_of_code as loc
from code_api import code_file as cf
from code_api import universal_constants as uc


from quasar_source_code.universal_code import system_os as sos

if sos.is_linux():
	CODE_SOURCE_BASE = '/home/git_repos/quasar_source/'
elif sos.is_mac():
	CODE_SOURCE_BASE = '/Users/utarsuno/git_repos/quasar_source/'

# Program arguments.
ARGUMENT_BUILD_PRODUCTION = '-bp'
ARGUMENT_RUN_ANALYSIS     = '-ra'

# Production Javascript combining order.
PRODUCTION_FILE_ORDER = {'0' : 'globals.js',
                         '1' : 'time_abstraction.js',
                         '2' : 'web_socket_client.js',
                         '3' : 'multiplayer_manager.js',
                         '4' : 'renderer_api.js',
                         '5' : 'shader_api.js',
                         '6' : 'ajax_api.js',
                         '7' : 'custom_smooth_step.js',
                         '8' : 'audio_api.js',
                         '9' : 'input_text_processor.js',
                         '10': 'entity.js',
                         '11': 'entity_owner.js',
                         '12': 'entity_manager.js',
                         '13': 'fps_controls.js',
                         '14': 'pointer_lock_api.js',
                         '15': 'stats_api.js',
                         '16': 'data_display.js',
                         '17': 'paused_menu.js',
                         '18': 'typing_interface.js',
                         '19': 'dom_element.js',
                         '20': 'player.js',
                         '21': 'interactive.js',
                         '22': 'visibility.js',
                         '23': 'plane_api.js',
                         '24': 'floating_wall.js',
                         '25': 'floating_2d_text.js',
                         '26': 'floating_3d_text.js',
                         '27': 'floating_slider.js',
                         '28': 'checkbox.js',
                         '29': 'create_entity.js',
                         '30': 'entity_wall.js',
                         '31': 'world_base.js',
                         '32': 'world_manager.js',
                         '33': 'login_world.js',
                         '34': 'home_world.js',
                         '35': 'settings_world.js',
                         '36': 'quasar_data.js'}


PYTHON     = 'python'
JAVASCRIPT = 'javascript'


def _get_all_javascript_files(get_minified_files=False):
	"""Returns a list of CodeFile objects of all the Quasar javascript files (with a flag to determine if minified files returned or non-minified files returned."""
	all_javascript_files_path = CODE_SOURCE_BASE + 'quasar_source_code/quasar_site_django/static/js/custom'
	all_javascript_files = ufo.get_all_file_paths_inside_directory(all_javascript_files_path)
	files_to_ignore = ['helvetiker_regular.typeface.json.js']
	files_to_return = []
	if get_minified_files:
		for f in all_javascript_files:
			file_name = ufo.get_file_basename(f)
			if file_name not in files_to_ignore and '.min.js' in file_name and '.prod.' not in file_name:
				files_to_return.append(cf.CodeFileJavaScript(f))
	else:
		for f in all_javascript_files:
			file_name = ufo.get_file_basename(f)
			if file_name not in files_to_ignore and '.min.js' not in file_name and '.prod.' not in file_name:
				files_to_return.append(cf.CodeFileJavaScript(f))
	return files_to_return


def _get_all_python_files():
	"""Returns a list of CodeFile objects of all the Quasar Python files."""
	all_python_files_path = CODE_SOURCE_BASE
	files_to_ignore = ['__init__.py',
	                   'settings.py',
	                   'wsgi.py',
	                   'manage.py',
	                   'finance_classes.py',
	                   'finance_database.py',
	                   'robinhood_data.py',
	                   'example.py',
	                   'exceptions.py',
	                   'Robinhood.py',
	                   'trade_history_downloader.py',
	                   'setup.py',
	                   'conftest.py',
	                   'helpers.py',
	                   'test_getdata.py',
	                   'test_portfolio.py']
	all_python_files = ufo.get_all_file_paths_inside_directory(all_python_files_path)
	files_to_return = []
	for f in all_python_files:
		file_name = ufo.get_file_basename(f)
		if file_name.endswith('.py'):
			if file_name not in files_to_ignore:
				# TODO : check for ... and 'third_party_libraries' not in file_path
				files_to_return.append(cf.CodeFilePython(f))
	return files_to_return


def _get_all_shell_scripts():
	"""Returns a list of CodeFile objects of all the Quasar script files."""
	all_script_files_path = CODE_SOURCE_BASE + 'all_scripts'
	all_script_files = ufo.get_all_file_paths_inside_directory(all_script_files_path)
	files_to_return = []
	for f in all_script_files:
		files_to_return.append(cf.CodeFileShellScript(f))
	return files_to_return


class QuasarCode(object):
	"""An abstraction to the entire Quasar code base."""

	def __init__(self):
		self._javascript_manager = cf.CodeFileManager(_get_all_javascript_files())
		self._python_manager     = cf.CodeFileManager(_get_all_python_files())
		self._script_manager     = cf.CodeFileManager(_get_all_shell_scripts())

		# Create universal constants that Quasar requires.
		post_urls = uc.UniversalConstantGroup('POST_URL_', 'POST URLs for client-server communication.')
		post_urls.add_universal_constant('DELETE_ENTITY'        , '/delete_entity')
		post_urls.add_universal_constant('SAVE_ENTITY'          , '/save_entity')
		post_urls.add_universal_constant('GET_USER_ENTITIES'    , '/get_user_entities')
		post_urls.add_universal_constant('GET_PUBLIC_ENTITIES'  , '/get_public_entities')
		post_urls.add_universal_constant('CREATE_ACCOUNT'       , '/create_account')
		post_urls.add_universal_constant('LOGIN'                , '/login')
		post_urls.add_universal_constant('ENTITY_MANAGER_STATUS', '/server_side_print_entity_manager_status')
		post_urls.add_universal_constant('GET_ALL_DATA'         , '/get_all_data')
		post_urls.add_universal_constant('GET_ALL_SERVER_CACHE' , '/get_all_server_cache')

	def run_analysis(self):
		"""Prints an analysis report on the Quasar Source code base."""
		color_print('Printing Quasar Analysis!', color='red', bold=True)
		self._javascript_manager.print_data()
		self._python_manager.print_data()
		self._script_manager.print_data()

	def build_production(self):
		"""Builds the production version of Quasar."""
		color_print('Building Quasar Production!', color='red', bold=True)

		####
		####

		# TODO : Organize these / create a system.
		# TODO : GLOBAL_CONSTANTS

		production_javascript_build = cf.CodeFileJavaScript(CODE_SOURCE_BASE + 'quasar_source_code/quasar_site_django/static/js/custom/quasar/quasar.prod.min.js', False)
		production_javascript_build.add_line('\'use_strict\';')

		i = 0
		while i < len(PRODUCTION_FILE_ORDER):

			t = self._javascript_manager.get_code_file_by_name(PRODUCTION_FILE_ORDER[str(i)]).get_minified_production_javascript_text()
			t = t.replace("'use strict';", '')

			s = t.split('\n')

			for l in s:
				production_javascript_build.add_line(l)

			#print(len(s))

			'''
			text = self._javascript_manager.get_code_file_by_name(PRODUCTION_FILE_ORDER[str(i)]).get_minified_javascript_text()
			lines = text.split('\n')
			for l in lines:
				production_javascript_build.add_line(l.replace("'use strict';", ''))
			'''
			i += 1

		production_javascript_build.create_file_and_minify()
		print('Production is size : ' + str(production_javascript_build.file_size) + 'bytes.')


# Check if this file is being ran as a script.
if __name__ == '__main__':
	#color_print('Building Quasar Production', color='red', bold=True)

	quasar_code = QuasarCode()

	arguments = sys.argv[1:]
	for a in arguments:
		if a == ARGUMENT_BUILD_PRODUCTION:
			quasar_code.build_production()
		elif a == ARGUMENT_RUN_ANALYSIS:
			quasar_code.run_analysis()

# TODO :
	#print('Total size before : ' + str(total_original_size))
	#print('New size : ' + str(total_reduced_size))
	#print('Size reduction % : ' + str(1.0 - (total_reduced_size / total_original_size)))
# Quick test