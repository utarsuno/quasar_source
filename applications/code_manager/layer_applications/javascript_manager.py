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

	constants  = []

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

	return cleaner_lines


class JavascriptManager(object):
	"""This class performs multiple passes of tasks over the javascript files."""

	def __init__(self, build_for, domain):
		self.domain          = domain
		self.build_for       = build_for
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
		if self.build_for == 'NEXUS_LOCAL':
			combined_javascript_file = GeneratedJSFile('nexus_local.js')
		#elif self.engine.is_build_quasar:
		#	combined_javascript_file = GeneratedJSFile('quasar.js')

		combined_javascript_file.add_code_section(CodeSection('all_code'))
		all_code = combined_javascript_file.get_code_section('all_code')

		# ///// Generate shader code.
		combined_lines = parse_in_shaders(combined_lines, assets)
		# /////

		# /////
		combined_lines = parse_out_constants(combined_lines)
		# /////

		all_code.add_code_chunk(CodeChunk(combined_lines))

		if self.build_for == 'NEXUS_LOCAL':
			#output_directory = CodeDirectory('/quasar/generated_output/web_assets')
			output_directory = CodeDirectory(self.domain.generated_content_path)
		#elif self.engine.is_build_quasar:
		#	output_directory = CodeDirectory('/quasar/libraries/front_end/js/quasar/quasar')

		# TODO: refactor this?
		output_directory.add_code_file(combined_javascript_file)

		combined_javascript_file.create_or_update_file()

		# Now minify the file and transfer it to its needed location.
		loaded_javascript_file = combined_javascript_file.get_created_file_as_loaded_file()

		return loaded_javascript_file

	def _add_js_file(self, path):
		"""Adds a required JS file."""
		if not path.endswith('.js'):
			path += '.js'
		self.js_files_needed.append(path)

	def _add_display_caches(self, paths):
		"""Utility function."""
		for p in paths:
			if p != '':
				self._add_js_file('data_structures/display_cache/display_cache_' + p)
			else:
				self._add_js_file('data_structures/display_cache/display_cache.js')

	def _add_boolean_flags(self, paths):
		"""Utility function."""
		for p in paths:
			self._add_js_file('data_structures/boolean_flags/boolean_flags_' + p)

	def _add_linked_lists(self, paths):
		"""Utility function."""
		for p in paths:
			self._add_js_file('data_structures/linked_lists/' + p + '/linked_list_' + p)
			self._add_js_file('data_structures/linked_lists/' + p + '/node_' + p)

	def _add_core(self, path):
		"""Utility function."""
		self._add_js_file('core/' + path)

	def _add_core_extensions(self, paths):
		"""Utility function."""
		for p in paths:
			self._add_js_file('core/engine_extensions/' + p)

	def _add_client(self, path):
		"""Utility function."""
		self._add_js_file('client/' + path)

	def _add_feature(self, path):
		"""Utility function."""
		self._add_js_file('inheritable_features/' + path)

	def _add_static_feature(self, path):
		"""Utility function."""
		self._add_js_file('inheritable_features/static/' + path)

	def _add_dynamic_feature(self, path):
		"""Utility function."""
		self._add_js_file('inheritable_features/dynamic/' + path)

	def _add_dom_element(self, path):
		"""Utility function."""
		self._add_js_file('dom_elements/' + path)

	def _add_hud(self, path):
		"""Utility function."""
		self._add_js_file('hud/' + path)

	def _add_client(self, path):
		"""Utility function."""
		self._add_js_file('client/' + path)

	def _add_client_extensions(self, paths):
		"""Utility function."""
		for p in paths:
			self._add_js_file('client/extensions/' + p)

	def _add_client_functionalities(self, paths):
		"""Utility function."""
		for p in paths:
			self._add_js_file('client/functionality/' + p)

	def _add_renderings(self, paths):
		"""Utility function."""
		for p in paths:
			self._add_js_file('rendering/' + p)

	def _add_players(self, paths):
		"""Utility function."""
		for p in paths:
			self._add_js_file('player/' + p)

	def _add_controls(self, paths):
		"""Utility function."""
		for p in paths:
			self._add_js_file('controls/' + p)

	def _add_worlds(self, paths):
		"""Utility function."""
		for p in paths:
			self._add_js_file('worlds/' + p)

	def _add_world_extensions(self, paths):
		"""Utility function."""
		for p in paths:
			self._add_js_file('worlds/world/extensions/' + p)

	def _add_elements(self, path):
		"""Utility function."""
		self._add_js_file('elements/' + path)

	def _add_element_base(self, path):
		"""Utility function."""
		self._add_js_file('elements/base/' + path)

	def _add_element_base_extensions(self, paths):
		"""Utility function."""
		for p in paths:
			self._add_js_file('elements/base/element_extensions/' + p)

	def _add_shaders(self, paths):
		"""Utility function."""
		for p in paths:
			self._add_js_file('asset_management/shaders/' + p)

	def _add_asset_managements(self, paths):
		"""Utility function."""
		for p in paths:
			self._add_js_file('asset_management/' + p)

	def load_all_content(self):
		"""Return the needed ProjectComponent."""
		self.js = CodeDirectory('/quasar/libraries/front_end/js/engine', base_directory=True)
		self.js.add_extensions_to_ignore(['.min', '.gz'])
		self.js.add_extension_to_match('.js')

		# Main engine.
		self._add_js_file('core/engine')

		# Data structures.
		self._add_boolean_flags(['dynamic', 'static'])
		self._add_display_caches(['', 'engine', 'fps', 'memory', 'normal', 'position'])
		self._add_linked_lists(['base', 'interactive', 'row', 'row_element'])

		# Engine extensions.
		self._add_core_extensions(['cache', 'colors', 'errors', 'fonts', 'frames', 'math', 'settings'])
		self._add_core('heap_manager')

		# Font. (TODO: Move).
		self.js_files_needed.append('assets_json/helvetiker_regular.js')

		# Features/extensions.
		self._add_static_feature('text/feature_text')
		self._add_static_feature('text/feature_typing')
		self._add_static_feature('text/lines/feature_line')
		self._add_static_feature('three_js_abstractions/feature_geometry')
		self._add_static_feature('three_js_abstractions/feature_material')
		self._add_static_feature('three_js_abstractions/feature_mesh')
		self._add_static_feature('feature_color')
		self._add_static_feature('feature_size')

		self._add_dynamic_feature('attachments/feature_row')
		self._add_dynamic_feature('attachments/feature_title_bar')
		self._add_dynamic_feature('interactions/feature_button')
		self._add_dynamic_feature('interactions/feature_interactive')
		self._add_dynamic_feature('mouse_actions/feature_mouse_move')
		self._add_dynamic_feature('mouse_actions/feature_mouse_scale')

		# ----------------------------------------------------------------------------------------------------------------
		self._add_element_base('element')
		self._add_element_base_extensions(['meta_data'])
		self._add_element_base('floating_element')
		self._add_element_base_extensions(['attachment', 'normal', 'position', 'visibility'])
		self._add_element_base('wall/wall_abstraction')
		self._add_element_base('wall/floating_wall')
		self._add_elements('discrete/confirmation_prompt')
		self._add_elements('discrete/icon')
		self._add_elements('discrete/text_3d')
		self._add_elements('environment/hexagon_grid')
		self._add_elements('environment/light_ambient')
		self._add_elements('environment/light_point')
		# ----------------------------------------------------------------------------------------------------------------

		# DOM element abstraction.
		self._add_dom_element('pre_process')
		self._add_dom_element('base/dom_element')
		self._add_dom_element('text/dom_element_text')
		self._add_dom_element('canvas/dom_element_canvas')
		self._add_dom_element('canvas/rendering/canvas_rendering_text_line')
		self._add_dom_element('canvas/rendering/canvas_rendering_text_lines')
		self._add_dom_element('canvas/rendering/line_of_text')
		self._add_dom_element('canvas/rendering/visible_row')

		# HUD.
		self._add_hud('manager/hud_manager')
		self._add_hud('manager/extensions/pause_menu')
		self._add_hud('hud_debug')
		self._add_hud('hud_logs')
		self._add_hud('hud_user_typing')

		# Globals.
		self.js_files_needed.append('global/globals.js')
		self.js_files_needed.append('global/global_pre_process.js')

		# Client class.
		self._add_client('client')
		self._add_client_extensions(['features', 'cookies', 'event_window_resize'])
		self._add_client_functionalities(['full_screen', 'pointer_lock'])

		# Loading and assets.

		# Rendering manager.
		self._add_renderings(['renderer_manager', 'outline_glow', 'film_pass'])

		# Player.
		self._add_players(['player', 'player_state', 'player_cursor'])

		# Controls.
		self._add_controls(['fps_controls', 'mouse_controls', 'input_manager'])

		# Worlds.
		self._add_worlds(['world/world_base', 'world_manager/world_manager', 'world_manager/extensions/input', 'world_manager/extensions/singletons'])
		self._add_world_extensions(['elements', 'elements_interactive', 'elements_root', 'elements_tab_target', 'input', 'state'])

		# Asset Managers.
		self._add_shaders(['pre_process', 'shader_material_abstraction', 'shader_material_noise', 'shader_material_spritesheet', 'shader_material_transition'])
		self._add_asset_managements(['asset_manager', 'asset_batch', 'asset_file', 'icon_manager'])

		# Websockets.
		self.js_files_needed.append('web_sockets/web_socket_manager.js')
		self.js_files_needed.append('web_sockets/web_socket_sessions.js')
		self.js_files_needed.append('web_sockets/request_buffer.js')

		if self.build_for == 'NEXUS_LOCAL':
			#self.js.add_external_code_directory('/quasar/libraries/front_end/js/nexus')
			self.js.add_external_code_directory('/quasar/applications/nexus_client')
			# Add js files needed.
			self.js_files_needed.append('nexus/nexus_local.js')
			self.js_files_needed.append('world/world_dev_tools.js')
			self.js_files_needed.append('web_socket_requests/message_handler.js')
			self.js_files_needed.append('models/floating_terminal.js')
			self.js_files_needed.append('world/world_environment.js')


		#elif self.engine.is_build_quasar:
			#self.js.add_base_directory('/quasar/libraries/front_end/js/quasar')
		#	self.js.add_external_code_directory('/quasar/libraries/front_end/js/quasar')
			# Add js files needed.

		#self.js.load_all_content()

		return self.js

