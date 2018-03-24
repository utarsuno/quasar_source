# coding=utf-8

"""This module, javascript_production_file.py, provides an abstraction to creating the combined javascript file needed in production version of Quasar."""

from code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from code_api.source_file_abstraction.code_files.js_file import GeneratedJSFile
from code_api.code_abstraction.code_section import CodeSection
from code_api.code_abstraction.code_chunk import CodeChunk
from universal_code import output_coloring as oc


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

	# Old compression rate : compressed{JS:quasar_prod} - {468848b to 312115b} reduction of 33.42938436337576%

	REMOVE_TEXT = '/Users/utarsuno/git_repos/quasar_source/quasar_site_django/static/js/custom'
	TEMP_OUTPUT = '/Users/utarsuno/git_repos/quasar_source/configuration_files/temporary_output'
	PATH_OUTPUT = '/Users/utarsuno/git_repos/quasar_source/quasar_site_django/static/js/custom/quasar'

	def __init__(self, js_files, html_dev_file):
		self.js_files = js_files
		self.ordered_list_of_js_file_names = get_list_of_js_file_names_to_compress(html_dev_file)

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



			currently_in_dev_section = False
			for l in content:

				if 'FOR_DEV_START' in l:
					if currently_in_dev_section:
						print('ERROR, already in DEV start.')
						exit()
					else:
						currently_in_dev_section = True
				elif 'FOR_DEV_END' in l:
					if currently_in_dev_section:
						currently_in_dev_section = False

					#print(l, end='')

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

