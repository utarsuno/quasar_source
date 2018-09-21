# coding=utf-8

"""This module, javascript_manager.py, deals with pre-processing javascript files, combining them, and minimizing them."""

from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from libraries.code_api.source_file_abstraction.code_files.js_file import GeneratedJSFile
from libraries.code_api.code_abstraction.code_section import CodeSection
from libraries.universal_code import debugging as dbg
from libraries.universal_code import output_coloring as oc
from libraries.code_api.code_abstraction.code_chunk import CodeChunk

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

			shader_text = '\'' + shader_file.get_shader_as_javascript_string()[1:-2].replace('\'', '\\\'') + '\';'

			final_pass.append(l.replace('\'\';', shader_text))
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


def _check_that_no_line_is_longer_than_600_characters(todo):
	"""Helps certain V8 optimizations."""
	y = todo


class JavascriptManager(object):
	"""This class performs multiple passes of tasks over the javascript files."""

	def __init__(self, rendering_engine_builder):
		self.engine          = rendering_engine_builder
		self.js_files_needed = []

	def build_js(self, assets):
		"""Builds the needed javascript files."""

		# Get the files needed to be combined.
		js_files_needed = []
		for file_needed in self.js_files_needed:

			match_found = False

			all_js_files = self.js.get_all_files()
			for js_file in all_js_files:
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
		combined_lines = parse_in_shaders(combined_lines, assets)
		# /////

		# /////
		combined_lines = parse_out_constants(combined_lines)
		# /////

		all_code.add_code_chunk(CodeChunk(combined_lines))

		if self.engine.is_build_nexus_local:
			output_directory = CodeDirectory('/quasar/generated_output/web_assets')
		elif self.engine.is_build_quasar:
			output_directory = CodeDirectory('/quasar/libraries/front_end/js/quasar/quasar')

		# TODO: refactor this?
		output_directory.add_code_file(combined_javascript_file)

		combined_javascript_file.create_or_update_file()

		# Now minify the file and transfer it to its needed location.
		loaded_javascript_file = combined_javascript_file.get_created_file_as_loaded_file()

		return loaded_javascript_file
		#loaded_javascript_file.generate_minified_file()

		#
		# TODO: CHECK THAT NO LINES ARE LONGER THAN 600 CHARACTERS!
		print('TODO : Check that no line is longer than 600 characters.')
		#

	def load_all_content(self):
		"""Return the needed ProjectComponent."""
		self.js = CodeDirectory('/quasar/libraries/front_end/js/engine', base_directory=True, generated_output_directory='/quasar/generated_output/web_assets/')
		self.js.add_extensions_to_ignore(['.min', '.gz'])
		self.js.add_extension_to_match('.js')

		# Main engine.
		self.js_files_needed.append('core/engine.js')
		self.js_files_needed.append('core/frame_counter.js')
		self.js_files_needed.append('core/heap_manager.js')
		self.js_files_needed.append('assets_json/helvetiker_regular.js')

		# GUI 2D.
		self.js_files_needed.append('hud/hud_manager.js')
		self.js_files_needed.append('hud/debug_information.js')
		self.js_files_needed.append('hud/message_logs.js')
		self.js_files_needed.append('hud/player_typing_input.js')

		# Globals.
		self.js_files_needed.append('global/globals.js')
		self.js_files_needed.append('global/global_pre_process.js')
		self.js_files_needed.append('global/color_manager.js')

		# HTML_GUI.
		self.js_files_needed.append('dom_elements/dom_element.js')
		self.js_files_needed.append('dom_elements/dom_element_canvas.js')
		self.js_files_needed.append('dom_elements/dom_element_text.js')
		self.js_files_needed.append('dom_elements/canvas_abstraction/canvas_texture.js')
		self.js_files_needed.append('dom_elements/canvas_abstraction/canvas_gui_2d.js')
		self.js_files_needed.append('dom_elements/canvas_abstraction/rendering/canvas_rendering.js')
		self.js_files_needed.append('dom_elements/canvas_abstraction/rendering/canvas_rendering_icon.js')
		self.js_files_needed.append('dom_elements/canvas_abstraction/rendering/canvas_rendering_text_line.js')
		self.js_files_needed.append('dom_elements/canvas_abstraction/rendering/canvas_rendering_text_lines.js')

		# Client class.
		self.js_files_needed.append('client/client.js')
		self.js_files_needed.append('client/features/feature.js')
		self.js_files_needed.append('client/features/canvas.js')
		self.js_files_needed.append('client/features/webgl.js')
		self.js_files_needed.append('client/features/mobile.js')
		self.js_files_needed.append('client/features/pointer_lock.js')
		self.js_files_needed.append('client/features/virtual_reality.js')
		self.js_files_needed.append('client/features/web_workers.js')
		self.js_files_needed.append('client/features/full_screen.js')
		self.js_files_needed.append('client/functionality/cookies.js')
		self.js_files_needed.append('client/functionality/pause_menu.js')
		self.js_files_needed.append('client/functionality/window_focus.js')
		self.js_files_needed.append('client/functionality/full_screen.js')
		self.js_files_needed.append('client/functionality/pointer_lock.js')
		self.js_files_needed.append('client/functionality/window_resize.js')

		# Loading and assets.

		# Rendering manager.
		self.js_files_needed.append('rendering/renderer_manager.js')
		self.js_files_needed.append('rendering/outline_glow.js')
		self.js_files_needed.append('rendering/film_pass.js')

		# Player.
		self.js_files_needed.append('player/player.js')
		self.js_files_needed.append('player/player_state.js')
		self.js_files_needed.append('player/player_cursor.js')

		# Controls.
		self.js_files_needed.append('controls/fps_controls.js')
		self.js_files_needed.append('controls/input_manager.js')
		self.js_files_needed.append('controls/mouse_controls.js')

		# Worlds.
		self.js_files_needed.append('worlds/world_manager/world_manager.js')
		self.js_files_needed.append('worlds/world_manager/world_manager_input.js')
		self.js_files_needed.append('worlds/world_abstracts/world_input.js')
		self.js_files_needed.append('worlds/world_abstracts/world_state.js')
		self.js_files_needed.append('worlds/world_abstracts/world_base.js')
		self.js_files_needed.append('worlds/world_abstracts/world_elements.js')
		self.js_files_needed.append('worlds/world_abstracts/world_elements_interactive.js')
		self.js_files_needed.append('worlds/world_abstracts/world_elements_root.js')
		self.js_files_needed.append('worlds/world_abstracts/world_elements.js')

		'''
		# Inheritables.
		self.js_files_needed.append('models/features/feature_element_root.js')
		self.js_files_needed.append('models/features/feature_meta_data.js')

		self.js_files_needed.append('models/features/physics/feature_size.js')

		self.js_files_needed.append('models/features/interactions/feature_interactive.js')
		self.js_files_needed.append('models/features/interactions/feature_clickable.js')
		self.js_files_needed.append('models/features/interactions/feature_tab_target.js')

		self.js_files_needed.append('models/features/mouse_actions/feature_mouse_scale.js')
		self.js_files_needed.append('models/features/mouse_actions/feature_mouse_move.js')
		self.js_files_needed.append('models/features/mouse_actions/feature_cursor.js')

		self.js_files_needed.append('models/features/visuals/feature_visibility.js')
		self.js_files_needed.append('models/features/visuals/feature_color.js')

		self.js_files_needed.append('models/features/three_js_abstractions/feature_geometry.js')
		self.js_files_needed.append('models/features/three_js_abstractions/feature_material.js')
		self.js_files_needed.append('models/features/three_js_abstractions/feature_mesh.js')

		self.js_files_needed.append('models/features/text/feature_syntax.js')
		self.js_files_needed.append('models/features/text/feature_style.js')
		self.js_files_needed.append('models/features/text/feature_state.js')

		self.js_files_needed.append('models/features/button/feature_button.js')
		self.js_files_needed.append('models/features/button/feature_state.js')

		# Models.
		self.js_files_needed.append('models/elements/abstractions/text/syntax_rules/email.js')
		self.js_files_needed.append('models/elements/abstractions/text/syntax_rules/maximum_length.js')
		self.js_files_needed.append('models/elements/abstractions/text/syntax_rules/minimum_length.js')
		self.js_files_needed.append('models/elements/abstractions/text/syntax_rules/syntax_rule.js')
		self.js_files_needed.append('models/elements/abstractions/text/syntax_types/syntax_email.js')
		self.js_files_needed.append('models/elements/abstractions/text/syntax_types/syntax_password.js')
		self.js_files_needed.append('models/elements/abstractions/text/syntax_types/syntax_repeat_password.js')
		self.js_files_needed.append('models/elements/abstractions/text/syntax_types/syntax_username.js')

		self.js_files_needed.append('models/elements/base/floating_button.js')
		self.js_files_needed.append('models/elements/base/floating_element.js')
		self.js_files_needed.append('models/elements/base/floating_icon.js')

		#self.js_files_needed.append('models/elements/base/text_2d.js')
		'''

		# ----------------------------------------------------------------------------------------------------------------
		self.js_files_needed.append('elements/base/element.js')
		self.js_files_needed.append('elements/base/floating_element.js')

		self.js_files_needed.append('common_inheritable_features/text/feature_text.js')
		self.js_files_needed.append('common_inheritable_features/text/feature_typing.js')

		self.js_files_needed.append('common_inheritable_features/text/lines/feature_line.js')
		self.js_files_needed.append('common_inheritable_features/text/lines/feature_lines.js')

		#self.js_files_needed.append('inheritable_features/feature_recycle.js')

		self.js_files_needed.append('elements/inheritable_features/attachments/feature_attachment.js')
		self.js_files_needed.append('elements/inheritable_features/attachments/feature_title_bar.js')

		self.js_files_needed.append('elements/inheritable_features/interactions/feature_clickable.js')
		self.js_files_needed.append('elements/inheritable_features/interactions/feature_interactive.js')
		self.js_files_needed.append('elements/inheritable_features/interactions/feature_tab_target.js')

		self.js_files_needed.append('elements/inheritable_features/visuals/feature_color.js')
		self.js_files_needed.append('elements/inheritable_features/visuals/feature_visibility.js')

		self.js_files_needed.append('elements/inheritable_features/physics/feature_position.js')
		self.js_files_needed.append('elements/inheritable_features/physics/feature_relative_position.js')
		self.js_files_needed.append('elements/inheritable_features/physics/feature_normal.js')
		self.js_files_needed.append('elements/inheritable_features/physics/feature_relative_normal.js')

		self.js_files_needed.append('elements/inheritable_features/three_js_abstractions/feature_geometry.js')
		self.js_files_needed.append('elements/inheritable_features/three_js_abstractions/feature_material.js')
		self.js_files_needed.append('elements/inheritable_features/three_js_abstractions/feature_mesh.js')

		self.js_files_needed.append('elements/environment/hexagon_grid.js')
		self.js_files_needed.append('elements/environment/light_ambient.js')
		self.js_files_needed.append('elements/environment/light_point.js')

		self.js_files_needed.append('elements/discrete/text_3d.js')
		# ----------------------------------------------------------------------------------------------------------------

		# Asset Managers.
		self.js_files_needed.append('asset_management/asset_manager.js')
		self.js_files_needed.append('asset_management/asset_batch.js')
		self.js_files_needed.append('asset_management/asset_file.js')
		self.js_files_needed.append('asset_management/icon_manager.js')

		self.js_files_needed.append('asset_management/shaders/shader_material_abstraction.js')
		self.js_files_needed.append('asset_management/shaders/shader_material_noise.js')
		self.js_files_needed.append('asset_management/shaders/shader_material_spritesheet.js')
		self.js_files_needed.append('asset_management/shaders/shader_material_transition.js')

		# Websockets.
		self.js_files_needed.append('web_sockets/web_socket_manager.js')
		self.js_files_needed.append('web_sockets/web_socket_sessions.js')
		self.js_files_needed.append('web_sockets/request_buffer.js')

		#print(self.engine)
		#print('IS BUILD NEXUS LOCAL')
		#print(self.engine.is_build_nexus_local)

		if self.engine.is_build_nexus_local:
			#self.js.add_base_directory('/quasar/libraries/front_end/js/nexus')
			self.js.add_external_code_directory('/quasar/libraries/front_end/js/nexus')
			# Add js files needed.
			self.js_files_needed.append('nexus/nexus_local.js')
			self.js_files_needed.append('nexus/world/world_dev_tools.js')
			self.js_files_needed.append('nexus/web_socket_requests/message_handler.js')
			self.js_files_needed.append('nexus/models/floating_terminal.js')
			self.js_files_needed.append('nexus/world/world_environment.js')
		elif self.engine.is_build_quasar:
			#self.js.add_base_directory('/quasar/libraries/front_end/js/quasar')
			self.js.add_external_code_directory('/quasar/libraries/front_end/js/quasar')
			# Add js files needed.

		#self.js.load_all_content()

		return self.js

