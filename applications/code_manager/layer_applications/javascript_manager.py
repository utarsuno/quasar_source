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

FOR_DEV_START  = 'FOR_DEV_START'
FOR_DEV_END    = 'FOR_DEV_END'
FOR_QA_START   = 'FOR_QA_START'
FOR_QA_END     = 'FOR_QA_END'
FOR_PROD_START = 'FOR_PROD_START'
FOR_PROD_END   = 'FOR_PROD_END'


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

		combined_javascript_file.add_code_section(CodeSection('all_code'))
		all_code = combined_javascript_file.get_code_section('all_code')

		# Fill in any shader string variables.
		combined_lines = pre_process_shaders.parse_in_shaders(combined_lines, assets)

		# Pre-process marked constants.
		combined_lines = pre_process_constant.parse_out_constants(combined_lines)

		all_code.add_code_chunk(CodeChunk(combined_lines))

		if self.build_for == 'NEXUS_LOCAL':
			output_directory = CodeDirectory(self.domain.generated_content_path)

		# TODO: refactor this?
		output_directory.add_code_file(combined_javascript_file)

		combined_javascript_file.create_or_update_file()

		# Now minify the file and transfer it to its needed location.
		return combined_javascript_file.get_created_file_as_loaded_file()

	def _add_js_file(self, path):
		"""Adds a required JS file."""
		if not path.endswith('.js'):
			path += '.js'
		self.js_files_needed.append(path)

	def _add_paths(self, base, paths):
		"""Utility function."""
		for p in paths:
			self._add_js_file(base + p)

	def _add_display_caches(self, paths):
		"""Utility function."""
		for p in paths:
			if p != '':
				self._add_js_file('data_structures/display_cache/display_cache_' + p)
			else:
				self._add_js_file('data_structures/display_cache/display_cache.js')

	def _add_boolean_flags(self, paths):
		"""Utility function."""
		self._add_paths('data_structures/boolean_flags/boolean_flags_', paths)

	def _add_linked_lists(self, paths):
		"""Utility function."""
		for p in paths:
			self._add_js_file('data_structures/linked_lists/' + p + '/node_' + p)
			self._add_js_file('data_structures/linked_lists/' + p + '/linked_list_' + p)

	def _add_core(self, path):
		"""Utility function."""
		self._add_js_file('core/' + path)

	def _add_core_extensions(self, paths):
		"""Utility function."""
		self._add_paths('core/engine_extensions/', paths)

	def _add_core_renderings(self, paths):
		""""Utility function."""
		self._add_paths('core/engine_extensions/rendering/', paths)

	def _add_core_web_features(self, paths):
		"""Utility function."""
		self._add_paths('core/engine_extensions/web_features/', paths)

	def _add_core_huds(self, paths):
		"""Utility function."""
		self._add_paths('core/engine_extensions/hud/', paths)

	def _add_client(self, path):
		"""Utility function."""
		self._add_js_file('client/' + path)

	def _add_feature(self, path):
		"""Utility function."""
		self._add_js_file('inheritable_features/' + path)

	def _add_static_features(self, paths):
		"""Utility function."""
		self._add_paths('inheritable_features/static/', paths)

	def _add_three_js_abstractions(self, paths):
		"""Utility function."""
		self._add_paths('inheritable_features/static/three_js_abstractions/', paths)

	def _add_dynamic_feature(self, path):
		"""Utility function."""
		self._add_js_file('inheritable_features/dynamic/' + path)

	def _add_dom_element(self, path):
		"""Utility function."""
		self._add_js_file('dom_elements/' + path)

	def _add_canvas_renderings(self, path):
		"""Utility function."""
		self._add_paths('dom_elements/canvas/rendering/', path)

	def _add_players(self, paths):
		"""Utility function."""
		self._add_paths('player/', paths)

	def _add_controls(self, paths):
		"""Utility function."""
		self._add_paths('controls/', paths)

	def _add_worlds(self, paths):
		"""Utility function."""
		self._add_paths('worlds/', paths)

	def _add_world_extensions(self, paths):
		"""Utility function."""
		self._add_paths('worlds/world/extensions/', paths)

	def _add_elements(self, path):
		"""Utility function."""
		self._add_js_file('elements/' + path)

	def _add_element_base(self, path):
		"""Utility function."""
		self._add_js_file('elements/base/' + path)

	def _add_environments(self, paths):
		"""Utility function."""
		self._add_paths('elements/environment/', paths)

	def _add_element_base_extensions(self, paths):
		"""Utility function."""
		self._add_paths('elements/base/element_extensions/', paths)

	def _add_shaders(self, paths):
		"""Utility function."""
		self._add_paths('core/engine_extensions/rendering/shaders/', paths)

	def _add_asset_managements(self, paths):
		"""Utility function."""
		self._add_paths('asset_management/', paths)

	def _add_time_abstractions(self, paths):
		"""Utility function."""
		self._add_paths('time_abstraction/', paths)

	def load_all_content(self):
		"""Return the needed ProjectComponent."""
		self.js = CodeDirectory('/quasar/libraries/front_end/js/engine', base_directory=True)
		self.js.add_extensions_to_ignore(['min', 'gz'])
		self.js.add_extension_to_match('js')

		# Main engine.
		self._add_js_file('core/engine')

		# Data structures.
		self._add_boolean_flags(['dynamic', 'static'])
		self._add_display_caches(['', 'date_time', 'engine', 'fps', 'memory', 'normal', 'position'])
		self._add_linked_lists(['base', 'interactive', 'row', 'row_element'])

		# Engine extensions.
		self._add_core_extensions(['cache', 'colors', 'errors', 'fonts', 'frames', 'math', 'flags', 'inputs/pre_process', 'inputs/inputs'])
		self._add_core_web_features(['cookies', 'event_window_resize', 'full_screen', 'pointer_lock'])
		self._add_core_renderings(['renderer'])
		self._add_core('heap_manager')

		# Font. (TODO: Move).
		self.js_files_needed.append('assets_json/helvetiker_regular.js')

		# Features/extensions.
		self._add_three_js_abstractions(['pre_process', 'feature_geometry', 'feature_material', 'feature_mesh'])
		self._add_static_features(['feature_text', 'feature_color', 'feature_size'])

		self._add_dynamic_feature('attachments/feature_row')
		self._add_dynamic_feature('attachments/feature_title_bar')
		self._add_dynamic_feature('interactions/feature_button')
		self._add_dynamic_feature('interactions/feature_interactive')
		self._add_dynamic_feature('interactions/feature_typing')

		# ----------------------------------------------------------------------------------------------------------------
		self._add_element_base('element')
		self._add_element_base_extensions(['meta_data'])
		self._add_element_base('floating_element')
		self._add_element_base_extensions(['attachment', 'normal', 'position', 'visibility'])
		self._add_element_base('floating_wall')
		self._add_environments(['hexagon_grid', 'light_ambient', 'light_point', 'skybox'])
		# ----------------------------------------------------------------------------------------------------------------

		# DOM element abstraction.
		self._add_dom_element('pre_process')
		self._add_dom_element('base/dom_element')
		self._add_dom_element('text/dom_element_text')
		self._add_dom_element('canvas/dom_element_canvas')
		self._add_canvas_renderings(['text_renderer', 'text_line', 'text_lines', 'visible_row'])

		#
		self._add_core_extensions(['text_2d_helper'])
		#

		#
		self._add_elements('discrete/confirmation_prompt')
		self._add_elements('discrete/icon')
		self._add_elements('discrete/text_3d')
		self._add_elements('discrete/text_2d')
		#


		# Time abstraction.
		self._add_time_abstractions(['pre_process', 'time_instance', 'time_manager'])

		self._add_core_huds(['hud', 'hud_date_time', 'hud_debug', 'hud_logs', 'hud_user_typing'])

		# Globals.
		self.js_files_needed.append('global/globals.js')
		self.js_files_needed.append('global/global_pre_process.js')

		# Loading and assets.

		# Player.
		self._add_players(['player', 'player_state', 'cursor/cursor', 'cursor/cursor_default', 'cursor/cursor_icon', 'controls/mouse', 'controls/movement'])

		# Worlds.
		self._add_worlds(['world/world_base', 'world_manager/world_manager', 'world_manager/extensions/input', 'world_manager/extensions/singletons'])
		self._add_world_extensions(['elements', 'elements_interactive', 'elements_root', 'elements_tab_target', 'input', 'state'])

		# Asset Managers.
		self._add_shaders(['pre_process', 'shader_material_abstraction',
		                   'background/shader_material_background', 'background/background',
		                   'fxaa/fxaa',
		                   'noise/noise', 'noise/shader_material_noise',
		                   'outline_glow/outline_glow',
		                   'spritesheet/shader_material_spritesheet',
		                   'transition/shader_material_transition'
		                   ])
		self._add_asset_managements(['pre_process', 'asset_manager', 'asset_batch', 'asset_file'])

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

		return self.js

