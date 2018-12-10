# coding=utf-8

"""This module, javascript_manager.py, deals with pre-processing javascript files, combining them, and minimizing them."""

from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from libraries.code_api.source_file_abstraction.code_files.js_file import GeneratedJSFile
from libraries.code_api.code_abstraction.code_section import CodeSection
from libraries.universal_code import debugging as dbg
from libraries.universal_code import output_coloring as oc
from libraries.code_api.code_abstraction.code_chunk import CodeChunk
from applications.code_manager.layer_applications.javascript_parser import pre_process_constant
from applications.code_manager.layer_applications.javascript_parser import pre_process_shaders
from applications.code_manager.layer_applications.javascript_parser import pre_process_environment
from applications.code_manager.layer_applications.javascript_parser.javascript_manager import JavascriptManager


class JavascriptManagerNexusLocal(JavascriptManager):
	"""This class performs multiple passes of tasks over the javascript files."""

	def __init__(self, domain):
		super().__init__(domain)

	def build_js(self, assets):
		"""Builds the needed javascript files."""
		# Get the files needed to be combined.
		js_files_needed = []
		for file_needed in self.js_files_needed:
			_match = self.js.get_file_by_partial_match_on_full_path(file_needed)
			if _match is None:
				oc.print_error('Missing JS file {' + file_needed + '}')
				dbg.raise_exception('Javascript file to match not found! {' + file_needed + '}')
			else:
				js_files_needed.append(_match)

		combined_lines = []

		for f in js_files_needed:
			content = pre_process_environment.get_parsed_javascript_content(f.contents)
			for l in content:
				combined_lines.append(l)

		combined_lines.insert(0, "'use strict';\n")

		# Now create the combined javascript file.
		combined_javascript_file = GeneratedJSFile('nexus_local.js')

		combined_javascript_file.add_code_section(CodeSection('all_code'))
		all_code = combined_javascript_file.get_code_section('all_code')

		# Fill in any shader string variables.
		combined_lines = pre_process_shaders.parse_in_shaders(combined_lines, assets)

		# Pre-process marked constants.
		combined_lines = pre_process_constant.parse_out_constants(combined_lines)

		all_code.add_code_chunk(CodeChunk(combined_lines))

		output_directory = CodeDirectory(self.domain.path_output)

		# TODO: refactor this?
		output_directory.add_code_file(combined_javascript_file)

		combined_javascript_file.create_or_update_file()

		# Now minify the file and transfer it to its needed location.
		return combined_javascript_file.get_created_file_as_loaded_file()

	def _add_files_nexus_local(self):
		"""Adds the JS files needed for Nexus Local."""
		# Nexus Local specific.
		self.js.add_external_code_directory('/quasar_source/applications/nexus_client')
		# Add js files needed.
		self.js_files_needed.append('nexus/nexus_local')
		self.js_files_needed.append('world/world_dev_tools')
		self.js_files_needed.append('web_socket_requests/message_handler')
		self.js_files_needed.append('models/floating_terminal')

	def load_all_content(self):
		"""Return the needed ProjectComponent."""
		self.js = CodeDirectory('/quasar_source/libraries/front_end/js/engine', base_directory=True)
		self.js.add_extensions_to_ignore(['min', 'gz'])
		self.js.add_extension_to_match('js')

		self._add_files_engine()
		self._add_files_nexus_local()

		return self.js

