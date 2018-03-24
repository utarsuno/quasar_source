# coding=utf-8

"""This module, project_maintenance.py, provides an abstraction to the maintenance and generation of code projects."""


from code_api.discrete_projects.quasar_source.quasar_project import *
from universal_code import output_coloring as oc
from code_api.discrete_projects.quasar_source.quasar_site.javascript_production_file import QuasarProductionJSFile
import time


class CodeProjectMaintainer(object):
	"""Provides an abstraction to code project maintenance."""

	def __init__(self, code_project):
		self._code_project = code_project

	def prompt_user(self):
		"""Prompt the user for the action to take."""
		oc.print_title('Select an action to take :')
		oc.print_data_with_red_dashes_at_start('0: print general information')
		oc.print_data_with_red_dashes_at_start('1: generate code project')
		oc.print_data_with_red_dashes_at_start('2: quasar site testing')

		invalid_input = False

		user_input = input()
		try:
			user_input = int(user_input)
		except ValueError:
			invalid_input = True

		if not invalid_input:
			if user_input != 0 and user_input != 1 and user_input != 2:
				invalid_input = True

		if invalid_input:
			oc.print_error('The provided input{' + str(user_input) + '} is not a valid option!')
		else:
			if user_input == 0:
				self._print_general_information()
			elif user_input == 1:
				self._generate_code_project()
			elif user_input == 2:
				self._generate_production_version_of_quasar()

	def _print_general_information(self):
		"""Print general information on this project."""
		print('TODO : PRINT GENERAL PROJECT INFORMATION')

	'''__   ___       ___  __       ___  ___     __   __   __   __        __  ___    __
	  / _` |__  |\ | |__  |__)  /\   |  |__     |__) |__) /  \ |  \ |  | /  `  |  | /  \ |\ |
	  \__> |___ | \| |___ |  \ /~~\  |  |___    |    |  \ \__/ |__/ \__/ \__,  |  | \__/ | \| '''
	def _generate_production_version_of_quasar(self):
		"""Generates the production version of quasar."""
		oc.print_title('Creating the production version of Quasar.')

		# CSS.
		oc.print_data_with_red_dashes_at_start('compressing css files')
		css_component = self._code_project.get_all_components_that_have_tags([QUASAR_COMPONENT_TAG_CSS, QUASAR_COMPONENT_TAG_CLIENT_SIDE])[0]
		all_files = css_component.all_files
		for f in all_files:
			f.compression.generate_minified_file()
			oc.print_pink('\t' + f.compression.compression_statistics)

		# HTML.
		oc.print_data_with_red_dashes_at_start('compressing html files')
		html_component = self._code_project.get_all_components_that_have_tags([QUASAR_COMPONENT_TAG_HTML, QUASAR_COMPONENT_TAG_CLIENT_SIDE])[0]
		html_prod = html_component.get_file_by_name('prod')
		html_prod.compression.generate_minified_file()
		oc.print_pink('\t' + html_prod.compression.compression_statistics)

		# JAVASCRIPT.
		js_component = self._code_project.get_all_components_that_have_tags([QUASAR_COMPONENT_TAG_JS, QUASAR_COMPONENT_TAG_CLIENT_SIDE])[0]

		production_js_maker = QuasarProductionJSFile(js_component.all_files, html_component.get_file_by_name('dev'))
		production_js_maker.generate()

		# TODO : ASSET MANAGMENT



	'''__   __   __   ___     __   ___       ___  __       ___    __
	  /  ` /  \ |  \ |__     / _` |__  |\ | |__  |__)  /\   |  | /  \ |\ |
	  \__, \__/ |__/ |___    \__> |___ | \| |___ |  \ /~~\  |  | \__/ | \| '''
	def _generate_code_project(self):
		"""Generate this code project."""
		start_time = time.time()

		project_components = self._code_project.components

		for c in project_components:
			if not c.has_tag(QUASAR_COMPONENT_TAG_CLIENT_SIDE):
				oc.print_data('Generating {' + str(c) + '}')

				base_code_directories = c.base_code_directories
				for bcd in base_code_directories:
					if bcd.generatable:
						self._generate_code_directory_recursively(bcd)

		elapsed_time = time.time() - start_time
		oc.print_title('Project generation completed in{' + str(elapsed_time) + ' seconds}')

	def _generate_code_directory_recursively(self, code_directory):
		"""Generates this code directory, it's contents, and do the same for ALL child directories."""
		oc.print_green('\tgenerating directory{' + str(code_directory) + '}')
		code_directory.create_directory_if_needed()

		# Generate all code files needed.
		all_code_files = code_directory.code_files
		for code_file in all_code_files:
			self._generate_code_file(code_file)

		# Now generate all child code directories.
		all_child_directories = code_directory.child_code_directories
		for child_directory in all_child_directories:
			if child_directory.generatable:
				self._generate_code_directory_recursively(child_directory)

	def _generate_code_file(self, code_file):
		"""Generates the specified code file."""
		oc.print_pink('\t\tgenerating{' + str(code_file) + '}')
		code_file.generate_file_code()
		code_file.create_or_update_file()






quasar_project_maintainer = CodeProjectMaintainer(load_quasar_source_project())
#quasar_project_maintainer.prompt_user()

# TEMPORARY
quasar_project_maintainer._generate_production_version_of_quasar()

