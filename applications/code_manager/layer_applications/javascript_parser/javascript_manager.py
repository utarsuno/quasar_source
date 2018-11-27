# coding=utf-8

"""This module, nexus_local.py, provides utility to specifying the needed JS files needed to create Nexus Local (client side)."""


class JavascriptManager(object):
	"""Provides an abstraction to generating Nexus Local JS files."""

	def __init__(self, domain):
		self.domain          = domain
		self.js_files_needed = []

	def _add_js_file(self, path: str):
		"""Adds a required JS file."""
		if not path.endswith('.js'):
			path += '.js'
		self.js_files_needed.append(path)

	def _add_paths(self, base: str, paths: list):
		"""Adds multiple required JS files."""
		if not base.endswith('/'):
			base += '/'
		for p in paths:
			self._add_js_file(base + p)

	def _add_linked_lists(self, paths):
		"""Utility function."""
		for p in paths:
			self._add_js_file('data_structures/linked_lists/' + p + '/node_' + p)
			self._add_js_file('data_structures/linked_lists/' + p + '/linked_list_' + p)

	def _add_files_engine(self):
		"""Adds the JS files needed for the overall engine."""
		# Global pre-processes.
		self._add_paths('core_global_pre_processes', ['pp_globals', 'pp_arguments', 'pp_assets', 'pp_dom_elements', 'pp_elements', 'pp_inputs', 'pp_player', 'pp_shaders', 'pp_singleton', 'pp_three_js', 'pp_time'])

		# Main engine.
		self._add_js_file('core_engine/engine')

		# Data structures.
		self._add_paths('data_structures/bitwise_flags', ['max_size_31', 'max_size_60'])
		self._add_paths('data_structures/display_cache', ['display_cache', 'date_time', 'engine', 'fps', 'memory', 'normal', 'position'])
		self._add_paths('data_structures/state_machine', ['state', 'finite_state_machine'])
		self._add_linked_lists(['base', 'interactive', 'row', 'row_element'])

		# Engine extensions.
		self._add_paths('core_engine/extensions/engine_static_data', ['colors', 'fonts'])
		self._add_paths('core_engine/extensions/engine_features'   , ['math', 'errors', 'script_loader'])
		self._add_paths('core_engine/extensions/engine_data'       , ['cache', 'flags', 'frames', 'state'])
		self._add_paths('core_engine/extensions/inputs'            , ['inputs', 'keyboard', 'mouse'])
		self._add_paths('core_engine/extensions/web_features'      , ['wf_cookies', 'wf_event_window_resize', 'wf_full_screen', 'wf_pointer_lock'])
		self._add_js_file('core_engine/extensions/rendering/renderer')
		self._add_js_file('core_engine/heap_manager')

		# Font. (TODO: Move).
		self.js_files_needed.append('assets_json/helvetiker_regular.js')

		# Features/extensions.
		self._add_paths('inheritable_features/static/three_js_abstractions', ['feature_geometry', 'feature_material', 'feature_mesh'])
		self._add_paths('inheritable_features/static'                      , ['feature_text', 'feature_color', 'feature_size', 'feature_animation_sequence'])

		self._add_paths('inheritable_features/dynamic'               , ['feature_animation_step'])
		self._add_paths('inheritable_features/dynamic/attachments'   , ['feature_row', 'feature_title_bar'])
		self._add_paths('inheritable_features/dynamic/interactions'  , ['feature_button', 'feature_interactive', 'feature_lookable', 'feature_typing'])

		# ----------------------------------------------------------------------------------------------------------------
		self._add_paths('elements/base', ['element'])
		self._add_js_file('elements/base/element_extensions/meta_data')
		self._add_js_file('elements/base/floating_element')
		self._add_js_file('elements/singleton/singleton')
		self._add_paths('elements/base', ['element_singleton'])
		self._add_paths('elements/base/element_extensions', ['attachment', 'normal', 'position', 'visibility', '_three_js_internals'])
		self._add_js_file('elements/base/floating_element_color')
		self._add_js_file('elements/base/floating_element_text')
		self._add_js_file('elements/base/floating_rows')
		self._add_js_file('elements/base/floating_wall')
		self._add_paths('elements/environment', ['hexagon_grid', 'light_ambient', 'light_point', 'skybox', 'skybox_space', 'tile_cube'])
		# ----------------------------------------------------------------------------------------------------------------

		# DOM element abstraction.
		self._add_paths('dom_elements/dom_element'               , ['base', 'base_external', 'base_internal'])
		self._add_paths('dom_elements/text'                      , ['text_external'])
		self._add_paths('dom_elements/link'                      , ['link_internal', 'canvas_saver'])
		self._add_paths('dom_elements/canvas'                    , ['canvas', 'canvas_external', 'canvas_internal', 'canvas_internal_texture'])

		self._add_paths('dom_elements/canvas/rendering/abstraction', ['base'])
		self._add_paths('dom_elements/canvas/rendering/icon'       , ['r_icon', 'r_icon_cursor'])
		self._add_paths('dom_elements/canvas/rendering/text'       , ['canvas_text_row', 'renderer', 'text_line', 'text_lines'])

		#
		self._add_paths('core_engine/extensions/engine_features', ['text_2d_helper'])
		#

		#
		self._add_paths('elements/discrete/2d/text', ['text_2d', 'button_2d'])
		self._add_paths('elements/discrete/2d/icon', ['e_icon', 'e_icon_button'])
		self._add_paths('elements/discrete/2d'     , ['checkbox'])
		self._add_paths('elements/discrete/3d'     , ['text_3d'])
		self._add_paths('elements/discrete/wall'   , ['confirmation_prompt'])
		#

		# Time abstraction.
		self._add_paths('time_abstraction', ['time_instance', 'time_manager'])

		# HUDs.
		self._add_paths('core_engine/extensions/hud', ['hud', 'hud_abstractions', 'hud_date_time', 'hud_debug', 'hud_logs', 'hud_user_typing', 'hud_pause_menu'])

		# Player.
		self._add_paths('player'           , ['player', 'player_state'])
		self._add_paths('player/cursor'    , ['cursor', 'cursor_default', 'cursor_icon'])
		self._add_paths('player/controls'  , ['mouse', 'movement'])
		self._add_paths('player/flashlight', ['flashlight'])
		self._add_paths('player/menu'      , ['menu_abstract'])
		self._add_paths('player/menu/row'  , ['action_row', 'action_create', 'action_close', 'action_fullscreen', 'action_teleport'])
		self._add_paths('player/menu'      , ['menu_teleport', 'menu'])

		# Worlds.
		self._add_paths('worlds/world'                   , ['world_base'])
		self._add_paths('worlds/world/extensions'        , ['elements', 'elements_interactive', 'elements_root', 'elements_tab_target', 'input', 'state'])
		self._add_paths('worlds/world_manager'           , ['world_manager'])
		self._add_paths('worlds/world_manager/extensions', ['input', 'singletons'])
		self._add_paths('worlds/world/discrete'          , ['settings_world'])
		self._add_paths('worlds/world/discrete/demo'     , ['demo_room_tile', 'demo_room', 'demo_room_ceiling', 'demo_room_floor', 'demo_room_lights', 'demo_room_walls', 'demo_world'])

		# Shaders.
		shaders_path = 'core_engine/extensions/rendering/shaders'
		self._add_paths(shaders_path                  , ['shader_material_abstraction'])
		self._add_paths(shaders_path + '/background'  , ['shader_material_background', 'background'])
		self._add_paths(shaders_path + '/fxaa'        , ['fxaa'])
		self._add_paths(shaders_path + '/noise'       , ['noise', 'shader_material_noise'])
		self._add_paths(shaders_path + '/outline_glow', ['outline_glow'])
		self._add_paths(shaders_path + '/spritesheet' , ['shader_material_spritesheet'])
		self._add_paths(shaders_path + '/transition'  , ['shader_material_transition'])

		# Assets.
		self._add_paths('asset_management'              , ['asset_manager', 'asset_batch', 'asset_file'])
		self._add_paths('asset_management/asset_batches', ['tile_batch'])

		# Websockets.
		self._add_paths('web_sockets', ['web_socket_manager', 'web_socket_sessions', 'request_buffer'])

