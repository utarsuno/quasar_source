# coding=utf-8

"""This module, javascript_manager.py, deals with pre-processing javascript files, combining them, and minimizing them."""

from quasar_libraries_and_scripts.code_api.project_abstraction.project_component import ProjectComponent
from quasar_libraries_and_scripts.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from quasar_libraries_and_scripts.code_api.source_file_abstraction.code_files.js_file import GeneratedJSFile
from quasar_libraries_and_scripts.code_api.code_abstraction.code_section import CodeSection
from quasar_libraries_and_scripts.universal_code import debugging as dbg
from quasar_libraries_and_scripts.universal_code import output_coloring as oc
from quasar_libraries_and_scripts.code_api.code_abstraction.code_chunk import CodeChunk

FOR_DEV_START  = 'FOR_DEV_START'
FOR_DEV_END    = 'FOR_DEV_END'
FOR_QA_START   = 'FOR_QA_START'
FOR_QA_END     = 'FOR_QA_END'
FOR_PROD_START = 'FOR_PROD_START'
FOR_PROD_END   = 'FOR_PROD_END'


class PreProcessConstant(object):
	"""Represents a constant to pre-process."""

	def __init__(self, raw_line):
		self._raw      = raw_line
		self._variable = None
		self._value    = None
		self._initialize()

	def _initialize(self):
		"""Gets the constant name."""
		r = self._raw.lstrip().rstrip()
		r = r[r.index('const ') + len('const '):]
		r = r[:r.index(';')]

		self._variable = r[:r.index('=')].lstrip().rstrip()
		self._value    = r[r.index('=') + 1:].lstrip().rstrip()

	@property
	def variable(self) -> str:
		"""Returns the name of this constant/variable."""
		return self._variable

	@property
	def value(self) -> str:
		"""Returns the value of this constant/variable."""
		return self._value


def parse_out_constants(lines_to_parse):
	"""Returns the lines with certain constants parsed out."""

	constants = []

	first_pass = []
	final_pass = []

	for l in lines_to_parse:
		if 'const' in l and '#pre-process_global_constant' in l:
			constants.append(PreProcessConstant(l))
			#print(l, end='')
		else:
			first_pass.append(l)

	for l in first_pass:

		line_currently = l

		for c in constants:
			if c.variable in line_currently:
				#print(line_currently, end='')
				line_currently = line_currently.replace(c.variable, c.value)
				#print(line_currently, end='')
				#print()

		final_pass.append(line_currently)

	#exit()

	return final_pass



def parse_in_shaders(lines_to_parse, assets):
	"""Returns the lines with certain constants parsed out."""

	final_pass = []

	for l in lines_to_parse:
		if '#pre-process_get_shader' in l:
			s = l[l.index('#pre-process_get_shader'):].rstrip()
			shader_name = s.replace('#pre-process_get_shader_', '')
			shader_file = assets.get_file_by_full_name(shader_name)
			final_pass.append(l.replace('\'\';', shader_file.get_shader_as_javascript_string()))
		else:
			final_pass.append(l)

	return final_pass


def _get_parsed_javascript_content(file_lines):
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

	# Go through the content and remove the 'FOR_QA' sections.
	cleaner_lines = []
	currently_in_qa_section = False
	for l in range(len(clean_lines)):
		line = clean_lines[l]

		if FOR_QA_START in line:
			if currently_in_qa_section:
				dbg.raise_exception('FOR_QA_START inside of a FOR_QA_START!')
			currently_in_qa_section = True
		elif FOR_QA_END in line:
			if not currently_in_qa_section:
				dbg.raise_exception('FOR_QA_END without starting FOR_QA_START')
			currently_in_qa_section = False
		else:
			if not currently_in_qa_section:
				cleaner_lines.append(line)

	#return clean_lines
	return cleaner_lines


class JavascriptManager(object):
	"""This class performs multiple passes of tasks over the javascript files."""

	def __init__(self, rendering_engine_builder):
		self.engine          = rendering_engine_builder
		self.js_files_needed = []

	def build_js(self):
		"""Builds the needed javascript files."""

		# Get the files needed to be combined.
		js_files_needed = []
		for file_needed in self.js_files_needed:

			match_found = False

			for js_file in self.js.all_files:
				if file_needed in js_file.full_path:
					match_found = True
					js_files_needed.append(js_file)
					break

			if not match_found:
				oc.print_error('MISSING {' + str(file_needed) + '}')
				dbg.raise_exception('Javascript file to match not found!')

		combined_lines = []

		for f in js_files_needed:
			content = _get_parsed_javascript_content(f.contents)
			for l in content:
				combined_lines.append(l)

		combined_lines.insert(0, "'use strict';\n")

		# Now create the combined javascript file.
		if self.engine.is_build_nexus_local:
			combined_javascript_file = GeneratedJSFile('nexus_local.js')
		elif self.engine.is_build_quasar:
			combined_javascript_file = GeneratedJSFile('quasar.js')

		combined_javascript_file.add_code_section(CodeSection('all_code'))
		all_code = combined_javascript_file.get_code_section('all_code')

		# ///// Generate shader code.
		#combined_lines = parse_in_shaders(combined_lines, self._assets)
		# /////

		# /////
		combined_lines = parse_out_constants(combined_lines)
		# /////

		all_code.add_code_chunk(CodeChunk(combined_lines))

		if self.engine.is_build_nexus_local:
			output_directory = CodeDirectory('/quasar/source/quasar_libraries_and_scripts/front_end/js/nexus/nexus')
		elif self.engine.is_build_quasar:
			output_directory = CodeDirectory('/quasar/source/quasar_libraries_and_scripts/front_end/js/quasar/quasar')

		output_directory.add_code_file(combined_javascript_file)

		combined_javascript_file.create_or_update_file()

		# Now minify the file and transfer it to its needed location.
		loaded_javascript_file = combined_javascript_file.get_created_file_as_loaded_file()
		#loaded_javascript_file.set_reduced_file_to_copy_out_of_configuration_files()
		loaded_javascript_file.generate_minified_file()
		oc.print_pink('\t' + loaded_javascript_file.compression_statistics)
		self.engine._original_total_size += loaded_javascript_file.file_size
		self.engine._new_total_size += loaded_javascript_file.compressed_size

	def load_all_content(self):
		"""Return the needed ProjectComponent."""
		self.js = ProjectComponent('quasar_rendering_engine_js')
		self.js.add_extension_to_ignore('.min')
		self.js.add_base_code_directory(CodeDirectory('/quasar/source/quasar_libraries_and_scripts/front_end/js/rendering_engine'))

		# Main engine.
		self.js_files_needed.append('engine/engine.js')
		self.js_files_needed.append('engine/core/time_value_buffer.js')
		self.js_files_needed.append('engine/core/heap_management/heap_manager.js')
		self.js_files_needed.append('engine/assets_json/helvetiker_regular.js')
		#self.js_files_needed.append('engine/core/typing_buffer.js')
		# Globals.
		self.js_files_needed.append('global/globals.js')
		# HTML_GUI.
		self.js_files_needed.append('engine/html_gui/dom_element.js')
		# Client class.
		self.js_files_needed.append('engine/client/client.js')
		# Loading and assets.

		# Rendering manager.
		self.js_files_needed.append('engine/rendering/renderer_manager.js')

		# Player.
		self.js_files_needed.append('player/player.js')
		self.js_files_needed.append('player/player_state.js')

		# Controls.
		self.js_files_needed.append('engine/controls/fps_controls.js')

		# Worlds.
		self.js_files_needed.append('engine/worlds/world_manager/world_manager.js')
		self.js_files_needed.append('engine/worlds/world_manager/world_manager_input.js')
		self.js_files_needed.append('engine/worlds/world_abstracts/world_input.js')
		self.js_files_needed.append('engine/worlds/world_abstracts/world_state.js')
		self.js_files_needed.append('engine/worlds/world_abstracts/world_base.js')
		self.js_files_needed.append('engine/worlds/singleton/world_environment.js')

		# Inheritables.
		self.js_files_needed.append('engine/models/inheritables/attachmentable.js')
		self.js_files_needed.append('engine/models/inheritables/interactive.js')
		self.js_files_needed.append('engine/models/inheritables/singleton.js')
		self.js_files_needed.append('engine/models/inheritables/visibility.js')

		# Models.
		self.js_files_needed.append('engine/models/floating_elements/abstractions/button/button_state.js')
		self.js_files_needed.append('engine/models/floating_elements/abstractions/text/syntax_rules/email.js')
		self.js_files_needed.append('engine/models/floating_elements/abstractions/text/syntax_rules/maximum_length.js')
		self.js_files_needed.append('engine/models/floating_elements/abstractions/text/syntax_rules/minimum_length.js')
		self.js_files_needed.append('engine/models/floating_elements/abstractions/text/syntax_rules/syntax_rule.js')
		self.js_files_needed.append('engine/models/floating_elements/abstractions/text/syntax_types/syntax_email.js')
		self.js_files_needed.append('engine/models/floating_elements/abstractions/text/syntax_types/syntax_password.js')
		self.js_files_needed.append('engine/models/floating_elements/abstractions/text/syntax_types/syntax_repeat_password.js')
		self.js_files_needed.append('engine/models/floating_elements/abstractions/text/syntax_types/syntax_username.js')
		self.js_files_needed.append('engine/models/floating_elements/abstractions/color_abstraction.js')
		self.js_files_needed.append('engine/models/floating_elements/abstractions/text_abstraction.js')
		self.js_files_needed.append('engine/models/floating_elements/base/2d_text/canvas_abstraction.js')
		self.js_files_needed.append('engine/models/floating_elements/base/2d_text/canvas_font.js')
		self.js_files_needed.append('engine/models/floating_elements/base/2d_text/canvas_texture.js')

		self.js_files_needed.append('engine/models/floating_elements/base/floating_button.js')
		self.js_files_needed.append('engine/models/floating_elements/base/floating_element.js')
		self.js_files_needed.append('engine/models/floating_elements/base/floating_icon.js')
		self.js_files_needed.append('engine/models/floating_elements/base/text_2d.js')
		self.js_files_needed.append('engine/models/floating_elements/base/text_3d.js')

		self.js_files_needed.append('engine/models/floating_elements/discrete_object_types/floating_text_3D.js')

		# Asset Managers.
		self.js_files_needed.append('engine/asset_management/asset_manager.js')	
		self.js_files_needed.append('engine/asset_management/asset_managers/asset_manager_abstraction.js')
		self.js_files_needed.append('engine/asset_management/asset_managers/texture_manager.js')
		self.js_files_needed.append('engine/asset_management/asset_managers/spritesheet_manager.js')
		self.js_files_needed.append('engine/asset_management/asset_managers/shader_manager.js')
		self.js_files_needed.append('engine/asset_management/shaders/shader_material_abstraction.js')
		self.js_files_needed.append('engine/asset_management/shaders/shader_material_noise.js')
		self.js_files_needed.append('engine/asset_management/shaders/shader_material_spritesheet.js')
		self.js_files_needed.append('engine/asset_management/shaders/shader_material_transition.js')


		if self.engine.is_build_nexus_local:
			self.js.add_base_code_directory(CodeDirectory('/quasar/source/quasar_libraries_and_scripts/front_end/js/nexus'))
			# Add js files needed.
			self.js_files_needed.append('nexus/_nexus_local.js')
			self.js_files_needed.append('nexus/world/world_dev_tools.js')
		elif self.engine.is_build_quasar:
			self.js.add_base_code_directory(CodeDirectory('/quasar/source/quasar_libraries_and_scripts/front_end/js/quasar'))
			# Add js files needed.

		self.js.load_all_content()

		return self.js

