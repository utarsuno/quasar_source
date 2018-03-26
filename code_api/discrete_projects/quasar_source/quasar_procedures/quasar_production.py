# coding=utf-8

"""This module, quasar_production.py, performs all needed steps to create the production environment for Quasar."""


from universal_code import output_coloring as oc
from universal_code import debugging as dbg
from code_api.source_file_abstraction.code_files.js_file import GeneratedJSFile
from code_api.code_abstraction.code_section import CodeSection
from code_api.code_abstraction.code_chunk import CodeChunk
from code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory

TEMPORARY_OUTPUT = '/Users/utarsuno/git_repos/quasar_source/configuration_files/static/js/custom/quasar'
REMOVE_TEXT = '/Users/utarsuno/git_repos/quasar_source/quasar_site_django/static/js/custom'
FOR_DEV_START = 'FOR_DEV_START'
FOR_DEV_END   = 'FOR_DEV_END'


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


def get_parsed_javascript_content(file_lines):
	"""Parses the javascript file text so its ready to be combined into the single Quasar javascript file."""
	# Parse out 'use strict' as each file has one. This will get added once at the end.
	if 'use strict' in file_lines[0]:
		file_lines = file_lines[1:]

	# Go through the content and remove the 'FOR_DEV' sections.
	clean_lines = []

	currently_in_dev_section = False
	for l in range(len(file_lines)):
		line = file_lines[l]

		if FOR_DEV_START in line:
			if currently_in_dev_section:
				dbg.raise_exception('FOR_DEV_START inside of a FOR_DEV_START!')
			currently_in_dev_section = True
		elif FOR_DEV_END in line:
			if not currently_in_dev_section:
				dbg.raise_exception('FOR_DEV_END without starting FOR_DEV_START')
			currently_in_dev_section = False
		else:
			if not currently_in_dev_section:
				clean_lines.append(line)

	return clean_lines


class QuasarProduction(object):
	"""Utility object for generating the Quasar Production environment code and assets."""

	def __init__(self, css_component, html_component, js_component, assets_component):
		self._css    = css_component
		self._html   = html_component
		self._js     = js_component
		self._assets = assets_component

		self._original_total_size = 0
		self._new_total_size      = 0

	def generate(self):
		"""Generates the production environment of Quasar."""
		self._step_css()
		self._step_html()
		self._step_js()
		oc.print_data_with_red_dashes_at_start('SKIPPING ASSET COMPRESSION, enable manually')
		#self._step_assets()

		oc.print_data_with_red_dashes_at_start('Original data size : ' + str(self._original_total_size))
		oc.print_data_with_red_dashes_at_start('New data size : ' + str(self._new_total_size))

		reduction_percent = (1.0 - float(self._new_total_size) / float(self._original_total_size)) * 100.0

		oc.print_data_with_red_dashes_at_start('Reduction of : ' + str(self._original_total_size - self._new_total_size) + ' or ' + str(reduction_percent) + '%')

	def _step_assets(self):
		"""Produces the compressed assets needed for Quasar."""
		oc.print_data_with_red_dashes_at_start('compressing asset files')
		files = self._assets.all_files

		for f in files:
			if not f.file_name.startswith('c_'):

				if 'skybox' in f.file_name:
					f.convert_to_jpg_then_compress()
					oc.print_pink('\t' + f.compression_statistics)
				else:
					f.create_compressed_file()
					oc.print_pink('\t' + f.compression_statistics)

				self._original_total_size += f.file_size
				self._new_total_size += f.compressed_size

	def _step_css(self):
		"""Produces production version of the CSS files."""
		oc.print_data_with_red_dashes_at_start('compressing css files')
		files = self._css.all_files
		for f in files:
			f.generate_minified_file()
			self._original_total_size += f.file_size
			self._new_total_size += f.compressed_size
			oc.print_pink('\t' + f.compression_statistics)

	def _step_html(self):
		"""Produces production version of the HTML files."""
		oc.print_data_with_red_dashes_at_start('compressing html files')
		html_prod = self._html.get_file_by_name('prod')

		html_prod.generate_minified_file()
		self._original_total_size += html_prod.file_size
		self._new_total_size += html_prod.compressed_size
		oc.print_pink('\t' + html_prod.compression_statistics)

	def _step_js(self):
		"""Produces production version of the JS files."""
		oc.print_data_with_red_dashes_at_start('compressing js files')

		# All the custom made JS files for Quasar.
		js_files = self._js.all_files

		js_files_needed = get_list_of_js_file_names_to_compress(self._html.get_file_by_name('dev'))
		ordered_js_files = []

		for file_to_get in js_files_needed:
			for js in js_files:
				text_to_match = js.full_path.replace(REMOVE_TEXT, '')
				if file_to_get == text_to_match:
					ordered_js_files.append(js)

		# Now combine all the texts of the gathered javascript files.
		combined_lines = []

		for f in ordered_js_files:
			content = get_parsed_javascript_content(f.contents)
			for l in content:
				combined_lines.append(l)

		combined_lines.insert(0, "'use strict';\n")

		# Now create the combined javascript file.
		combined_javascript_file = GeneratedJSFile('quasar_prod', '.js')
		combined_javascript_file.add_code_section(CodeSection('all_code'))
		all_code = combined_javascript_file.get_code_section('all_code')

		all_code.add_code_chunk(CodeChunk(combined_lines))

		output_directory = CodeDirectory(TEMPORARY_OUTPUT)
		output_directory.add_code_file(combined_javascript_file)

		combined_javascript_file.create_or_update_file()

		# Now minify the file and transfer it to its needed location.
		loaded_javascript_file = combined_javascript_file.get_created_file_as_loaded_file()
		loaded_javascript_file.set_reduced_file_to_copy_out_of_configuration_files()
		loaded_javascript_file.generate_minified_file()
		oc.print_pink('\t' + loaded_javascript_file.compression_statistics)
		self._original_total_size += loaded_javascript_file.file_size
		self._new_total_size += loaded_javascript_file.compressed_size
