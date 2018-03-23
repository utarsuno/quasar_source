# coding=utf-8

"""This module, project_maintenance.py, provides an abstraction to the maintenance and generation of code projects."""


from code_api.discrete_projects.quasar_source.quasar_project import *
from universal_code import output_coloring as oc
import time
from code_api.source_file_abstraction.code_files.js_file import GeneratedJSFile
from code_api.code_abstraction.code_section import CodeSection
from code_api.code_abstraction.code_chunk import CodeChunk


def get_list_of_js_file_names_to_compress(file_text):
	"""Utility function."""
	file_names = []
	dev_lines = file_text.contents
	for l in dev_lines:
		if 'js/custom/' in l:
			f = l[l.index('\'') + 1:l.rindex('\'')]
			f = f.replace('js/custom', '')
			file_names.append(f)
	return file_names


class QuasarProductionJSFile(object):
	"""Utility class to create the combined production javascript file."""

	REMOVE_TEXT = '/Users/utarsuno/git_repos/quasar_source/quasar_site_django/static/js/custom'
	TEMP_OUTPUT = '/Users/utarsuno/git_repos/quasar_source/configuration_files/temporary_output'
	PATH_OUTPUT = '/Users/utarsuno/git_repos/quasar_source/quasar_site_django/static/js/custom/quasar'

	def __init__(self, js_files, html_dev_file):
		self.js_files = js_files
		self.ordered_list_of_js_file_names = get_list_of_js_file_names_to_compress(html_dev_file)

		#for js in js_files_to_compress:
		#	for f in all_files:
		#		if f.file_name in str(js):
		#			break
		#	print(matched)

	def generate(self):
		"""Generates the combined production JS file."""
		ordered_js_files = []

		for file_to_get in self.ordered_list_of_js_file_names:
			for js in self.js_files:
				text_to_match = js.full_path.replace(QuasarProductionJSFile.REMOVE_TEXT, '')
				if file_to_get == text_to_match:
					ordered_js_files.append(js)

		combined_lines = []

		for js in ordered_js_files:
			content = js.contents
			if 'use strict' in content[0]:
				content = content[1:]

			for l in content:
				combined_lines.append(l)

		combined_lines.insert(0, "'use strict';\n")

		combined_javascript_file = GeneratedJSFile('quasar_prod', '.js')
		combined_javascript_file.add_code_section(CodeSection('all_code'))
		all_code = combined_javascript_file.get_code_section('all_code')

		all_code.add_code_chunk(CodeChunk(combined_lines))

		output_directory = CodeDirectory(QuasarProductionJSFile.TEMP_OUTPUT)
		output_directory.add_code_file(combined_javascript_file)

		combined_javascript_file.create_or_update_file()
		combined_javascript_file.compression.generate_minified_file()
		oc.print_pink('\t' + combined_javascript_file.compression.compression_statistics)

		# TODO : Copy the created file over to its respective spot.


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

