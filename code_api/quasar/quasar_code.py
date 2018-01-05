# coding=utf-8

"""This module, quasar_builder.py, is used for producing the DEV, QA, and PROD versions of Quasar."""

import sys

from fuzzywuzzy import process
from lazyme.string import color_print
from universal_code import output_coloring as oc
from universal_code import system_os as sos

from code_api import code_file as cf
from code_api import code_file_manager as cfm
from code_api import universal_constants as uc
from universal_code import useful_file_operations as ufo
from code_api.quasar import all_scripts
from code_api.code_generator import shell_scripts_generator

CODE_SOURCE_BASE = '/Users/utarsuno/git_repos/quasar_source/'

# Program arguments.
ARGUMENT_BUILD_PRODUCTION = '-bp'
ARGUMENT_RUN_ANALYSIS     = '-ra'
ARGUMENT_FEATURE_TESTING  = '-ft'

# Production Javascript combining order.
# TODO : This needs to get updated!!
# TODO : Make this automatically/dynamically get determined (the order of file adds that is)
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
                         # TODO : add floating_text_base
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
                         '36': 'quasar.js'}


PYTHON     = 'python'
JAVASCRIPT = 'javascript'


def _get_all_javascript_files(get_minified_files=False):
	"""Returns a list of CodeFile objects of all the Quasar javascript files (with a flag to determine if minified files returned or non-minified files returned."""
	all_javascript_files_path = CODE_SOURCE_BASE + 'quasar_source_code/quasar_site_django/static/js/custom'
	all_javascript_files = ufo.get_all_file_paths_inside_directory(all_javascript_files_path)
	files_to_ignore = ['helvetiker_regular.typeface.json.js', 'quasar_data.js']
	files_to_return = []
	if get_minified_files:
		for f in all_javascript_files:
			file_name = ufo.get_file_basename(f)
			if file_name not in files_to_ignore and '.prod.' not in file_name:
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
		files_to_return.append(shell_scripts_generator.CodeFileShellScript(f))
	return files_to_return


class QuasarCode(object):
	"""An abstraction to the entire Quasar code base."""

	def __init__(self):
		self._javascript_manager = cfm.CodeFileManager(_get_all_javascript_files())
		self._python_manager     = cfm.CodeFileManager(_get_all_python_files())
		self._script_manager     = cfm.CodeFileManager(_get_all_shell_scripts())

		# Javascript settings files.
		self._eslint_code_file   = cf.CodeFileJavaScript(CODE_SOURCE_BASE + 'configurations/.eslintrc.js')
		self._eslint_code_file._is_eslint_file = True

		# Create universal constants that Quasar requires.
		self.quasar_universal_constant_groups = []

		# Floating text types.
		self.floating_text_types = uc.UniversalConstantGroup('TYPE_', 'Floating text types.', uc.CONSTANT_TYPE_GLOBAL_VARIABLE)
		self.floating_text_types.add_universal_constant('INPUT_PASSWORD'        , 'input_password')
		self.floating_text_types.add_universal_constant('INPUT_REGULAR'         , 'input_regular')
		self.floating_text_types.add_universal_constant('LABEL'                 , 'label')
		self.floating_text_types.add_universal_constant('BUTTON'                , 'button')
		self.floating_text_types.add_universal_constant('STATUS'                , 'status')
		self.floating_text_types.add_universal_constant('TITLE'                 , 'title')
		self.floating_text_types.add_universal_constant('CHECK_BOX'             , 'check_box')
		self.floating_text_types.add_universal_constant('SUPER_TITLE'           , 'super_title')
		self.floating_text_types.add_universal_constant('CONSTANT_TEXT'         , 'constant_text')
		self.floating_text_types.add_universal_constant('SLIDER'                , 'slider')
		self.floating_text_types.add_universal_constant('TWO_DIRECTIONAL_SLIDER', 'two_directional_slider')

		# POST URLs.
		self.post_urls = uc.UniversalConstantGroup('POST_URL_', 'POST URLs for client-server communication.', uc.CONSTANT_TYPE_POST_URLS)
		self.post_urls.add_universal_constant('DELETE_ENTITY'        , 'delete_entity')
		self.post_urls.add_universal_constant('SAVE_ENTITY'          , 'save_entity')
		self.post_urls.add_universal_constant('GET_USER_ENTITIES'    , 'get_user_entities')
		self.post_urls.add_universal_constant('GET_PUBLIC_ENTITIES'  , 'get_public_entities')
		self.post_urls.add_universal_constant('CREATE_ACCOUNT'       , 'create_account')
		self.post_urls.add_universal_constant('LOGIN'                , 'login')
		self.post_urls.add_universal_constant('ENTITY_MANAGER_STATUS', 'server_side_print_entity_manager_status')
		self.post_urls.add_universal_constant('GET_DATABASE_DATA'    , 'get_database_data')
		self.post_urls.add_universal_constant('GET_ALL_SERVER_CACHE' , 'get_all_server_cache')
		self.post_urls.add_universal_constant('GET_SERVER_LOGS'      , 'get_server_logs')
		self.quasar_universal_constant_groups.append(self.post_urls)

		# Entity types.
		self.entity_types = uc.UniversalConstantGroup('ENTITY_TYPE_', 'Entity types.', uc.CONSTANT_TYPE_GLOBAL_VARIABLE)
		self.entity_types.add_universal_constant('BASE', 'Entity')
		self.entity_types.add_universal_constant('BASE', 'EntityTask')
		self.entity_types.add_universal_constant('BASE', 'EntityTime')
		self.entity_types.add_universal_constant('BASE', 'EntityWall')
		self.entity_types.add_universal_constant('BASE', 'EntityOwner')
		self.entity_types.add_universal_constant('BASE', 'EntityTextReminder')
		# TODO : Implement this function!
		self.entity_types.add_universal_constant_all()

		# Entity Properties.
		self.entity_properties = uc.UniversalConstantGroup('ENTITY_PROPERTY_', 'Entity property keys.', uc.CONSTANT_TYPE_GLOBAL_VARIABLE)
		self.entity_properties.add_universal_constant('START_TOKEN'       , 'ep_')
		self.entity_properties.add_universal_constant('PUBLIC'            , 'public')
		self.entity_properties.add_universal_constant('OWNER'             , 'owner')
		self.entity_properties.add_universal_constant('PASSWORD'          , 'password')
		self.entity_properties.add_universal_constant('USERNAME'          , 'username')
		self.entity_properties.add_universal_constant('EMAIL'             , 'email')
		self.entity_properties.add_universal_constant('NAME'              , 'name')
		self.entity_properties.add_universal_constant('POSITION'          , 'position')
		self.entity_properties.add_universal_constant('WIDTH'             , 'width')
		self.entity_properties.add_universal_constant('HEIGHT'            , 'height')
		self.entity_properties.add_universal_constant('HORIZONTAL_OFFSET' , 'horizontal_offset')
		self.entity_properties.add_universal_constant('VERTICAL_OFFSET'   , 'vertical_offset')
		self.entity_properties.add_universal_constant('NORMAL_DEPTH'      , 'normal_depth')
		self.entity_properties.add_universal_constant('NORMAL'            , 'normal')
		self.entity_properties.add_universal_constant('COMPLETED'         , 'completed')
		self.entity_properties.add_universal_constant('PHONE_NUMBER'      , 'phone_number')
		self.entity_properties.add_universal_constant('PHONE_CARRIER'     , 'phone_carrier')
		self.entity_properties.add_universal_constant('CREATED_AT_DATE'   , 'created_at_date')
		self.entity_properties.add_universal_constant('DUE_DATE'          , 'due_date')
		self.entity_properties.add_universal_constant('DUE_TIME'          , 'due_time')
		self.entity_properties.add_universal_constant('IMPORTANCE'        , 'importance')
		self.entity_properties.add_universal_constant('TEXT_CONTENTS'     , 'text_contents')
		self.entity_properties.add_universal_constant('EXECUTE_DATE'      , 'execute_date')
		self.entity_properties.add_universal_constant('EXECUTE_TIME'      , 'execute_time')
		self.entity_properties.add_universal_constant('SERVER_ID'         , '_id')
		self.quasar_universal_constant_groups.append(self.entity_properties)

		# Entity Default Properties.
		self.entity_default_properties = uc.UniversalConstantGroup('ENTITY_DEFAULT_PROPERTY_', 'Entity default property keys.', uc.CONSTANT_TYPE_GLOBAL_VARIABLE)
		self.entity_default_properties.add_universal_constant('TYPE'       , 'type')
		self.entity_default_properties.add_universal_constant('CHILD_IDS'  , 'child_ids')
		self.entity_default_properties.add_universal_constant('PARENT_IDS' , 'parent_ids')
		self.entity_default_properties.add_universal_constant('RELATIVE_ID', 'relative_id')
		self.quasar_universal_constant_groups.append(self.entity_default_properties)

		# Entity POST parameters.
		self.entity_post_parameters = uc.UniversalConstantGroup('ENTITY_POST_', 'Entity POST keys.', uc.CONSTANT_TYPE_GLOBAL_VARIABLE)
		self.entity_post_parameters.add_universal_constant('SAVE_DATA', 'save_data')
		self.quasar_universal_constant_groups.append(self.entity_post_parameters)

		# TODO : Get a list of remaining universal constants needed to be put in!

	def feature_testing_string_stuff(self):
		"""Temporary function for feature testing."""
		#jsliterals = self._javascript_manager.get_all_string_literals()
		js_words = self._javascript_manager.get_all_words()

		literals = []

		for l in js_words:
			literals.append(l[0])

		# matches = process.extract(asset_to_find, list_of_asset_names, limit=1)

		print('\n\n------------------\n\n')

		for cg in self.quasar_universal_constant_groups:
			print(cg)

			print('\n')

			for c in cg.universal_constants:

				print('\n' + c.name)

				test_matches = process.extract(c.name, literals)
				#test_matches = process.extract('player', literals)

				for m in test_matches:
					print(m)

			print('\n')

	def feature_testing(self):
		"""The current feature to be tested."""
		# Verify the 'all_scripts' directory.
		oc.print_data(self._script_manager.get_data())
		oc.print_title('Generate all scripts!')
		all_scripts.local_scripts.generate()
		oc.print_success('finished!')

	def run_analysis(self):
		"""Prints an analysis report on the Quasar Source code base."""
		oc.print_title('Printing Quasar Analysis!')
		oc.print_data(self._javascript_manager.get_data())
		oc.print_data(self._python_manager.get_data())
		oc.print_data(self._script_manager.get_data())

		# Make sure all the Universal Constants are synchronized across the code base.
		self._javascript_manager.sync_universal_constants(self.quasar_universal_constant_groups)
		self._python_manager.sync_universal_constants(self.quasar_universal_constant_groups)
		for g in self.quasar_universal_constant_groups:
			self._eslint_code_file.sync_for(g)

		#jsliterals = self._javascript_manager.get_all_string_literals()
		#pythonliterals = self._python_manager.get_all_string_literals()

		#for js in jsliterals:
		#	if js[1] != 1:
		#		print(js)

		#print('\n\n@@@@@@@@@@@@@\n\n')

		#for py in pythonliterals:
		#	if py[1] != 1:
		#		print(py)

		oc.print_success('Universal Constants inspection completed!')

	def build_production(self):
		"""Builds the production version of Quasar."""
		color_print('Building Quasar Production!', color='red', bold=True)

		original_size = self._javascript_manager.get_total_size()
		print('Original Javascript size : ' + str(original_size) + ' bytes.')

		production_javascript_build = cf.CodeFileJavaScript(CODE_SOURCE_BASE + 'quasar_source_code/quasar_site_django/static/js/custom/quasar/quasar.prod.min.js', False)
		production_javascript_build.add_line('\'use_strict\';')

		i = 0
		while i < len(PRODUCTION_FILE_ORDER):

			#color_print(str(i), color='blue')

			t = self._javascript_manager.get_code_file_by_name(PRODUCTION_FILE_ORDER[str(i)]).get_minified_production_javascript_text()
			t = t.replace("'use strict';", '')

			#print(t)

			s = t.split('\n')

			for l in s:
				#print('Adding line ' + str(l))
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
		production_size = production_javascript_build.file_size
		print('Production is size : ' + str(production_size) + ' bytes.')

		color_print('Compressed ' + str(1.0 - production_size / original_size) + ' %', color='blue', bold=True)


# Check if this file is being ran as a script.
if __name__ == '__main__':
	quasar_code = QuasarCode()

	arguments = sys.argv[1:]
	for a in arguments:
		if a == ARGUMENT_BUILD_PRODUCTION:
			quasar_code.build_production()
		elif a == ARGUMENT_RUN_ANALYSIS:
			quasar_code.run_analysis()
		elif a == ARGUMENT_FEATURE_TESTING:
			quasar_code.feature_testing()
		else:
			# TODO : Automate/add colored terminal printing
			color_print('The argument passed {' + str(a) + '} is not valid!', color='red')


# TODO :
	#print('Total size before : ' + str(total_original_size))
	#print('New size : ' + str(total_reduced_size))
	#print('Size reduction % : ' + str(1.0 - (total_reduced_size / total_original_size)))
# Quick test