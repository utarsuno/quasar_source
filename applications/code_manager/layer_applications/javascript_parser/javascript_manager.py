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
		# Main engine.
		self._add_js_file('core/engine')

		# Data structures.
		self._add_paths('data_structures/boolean_flags', ['dynamic', 'static_one_bucket'])
		self._add_paths('data_structures/display_cache', ['display_cache', 'date_time', 'engine', 'fps', 'memory', 'normal', 'position'])
		self._add_paths('data_structures/state_machine', ['state', 'finite_state_machine'])
		self._add_linked_lists(['base', 'interactive', 'row', 'row_element'])

		# Engine extensions.
		self._add_paths('core/engine_extensions'             , ['cache', 'colors', 'errors', 'fonts', 'frames', 'math', 'flags', 'state'])
		self._add_paths('core/engine_extensions/inputs'      , ['pre_process', 'inputs', 'keyboard', 'mouse'])
		self._add_paths('core/engine_extensions/web_features', ['cookies', 'event_window_resize', 'full_screen', 'pointer_lock'])
		self._add_js_file('core/engine_extensions/rendering/renderer')
		self._add_js_file('core/heap_manager')

		# Font. (TODO: Move).
		self.js_files_needed.append('assets_json/helvetiker_regular.js')

		# Features/extensions.
		self._add_paths('inheritable_features/static/three_js_abstractions', ['pre_process', 'feature_geometry', 'feature_material', 'feature_mesh'])
		self._add_paths('inheritable_features/static'                      , ['feature_text', 'feature_color', 'feature_size', 'feature_animation_sequence'])

		self._add_paths('inheritable_features/dynamic/animations'  , ['feature_animation_step'])
		self._add_paths('inheritable_features/dynamic/attachments' , ['feature_row', 'feature_title_bar'])
		self._add_paths('inheritable_features/dynamic/interactions', ['feature_button', 'feature_interactive', 'feature_typing'])

		# ----------------------------------------------------------------------------------------------------------------
		self._add_paths('elements/base', ['element'])
		self._add_js_file('elements/base/element_extensions/meta_data')
		self._add_js_file('elements/base/floating_element')
		self._add_js_file('elements/singleton/singleton')
		self._add_paths('elements/base', ['element_singleton'])
		self._add_paths('elements/base/element_extensions', ['attachment', 'normal', 'position', 'visibility'])
		self._add_js_file('elements/base/floating_wall')
		self._add_paths('elements/environment', ['hexagon_grid', 'light_ambient', 'light_point', 'skybox', 'tile_cube'])
		# ----------------------------------------------------------------------------------------------------------------

		# DOM element abstraction.
		self._add_paths('dom_elements'                           , ['pre_process'])
		self._add_paths('dom_elements/dom_element'               , ['base', 'base_external', 'base_internal'])
		self._add_paths('dom_elements/text'                      , ['text_external'])
		self._add_paths('dom_elements/link'                      , ['link_internal', 'canvas_saver'])
		self._add_paths('dom_elements/canvas'                    , ['canvas', 'canvas_external', 'canvas_internal', 'canvas_internal_texture'])

		self._add_paths('dom_elements/canvas/rendering/abstraction', ['base'])
		self._add_paths('dom_elements/canvas/rendering/icon'       , ['icon', 'icon_cursor'])
		self._add_paths('dom_elements/canvas/rendering/text'       , ['canvas_text_row', 'renderer', 'text_line', 'text_lines'])

		#
		self._add_js_file('core/engine_extensions/text_2d_helper')
		#

		#
		self._add_paths('elements/discrete/2d/text', ['text_2d', 'button_2d'])
		self._add_paths('elements/discrete/2d/icon', ['icon', 'icon_button'])
		self._add_paths('elements/discrete/2d'     , ['checkbox'])
		self._add_paths('elements/discrete/3d'     , ['text_3d'])
		self._add_paths('elements/discrete/wall'   , ['confirmation_prompt'])
		#

		# Time abstraction.
		self._add_paths('time_abstraction', ['pre_process', 'time_instance', 'time_manager'])

		# HUDs.
		self._add_paths('core/engine_extensions/hud', ['hud', 'hud_date_time', 'hud_debug', 'hud_logs', 'hud_user_typing'])

		# Globals.
		self._add_paths('global', ['globals', 'global_pre_process'])

		# Player.
		self._add_paths('player'           , ['player', 'player_state'])
		self._add_paths('player/cursor'    , ['cursor', 'cursor_default', 'cursor_icon'])
		self._add_paths('player/controls'  , ['mouse', 'movement'])
		self._add_paths('player/flashlight', ['flashlight'])
		#self._add_paths('player/menu'      , ['menu_abstract', 'menu', 'menu_teleport', 'action_row', 'action_fullscreen', 'action_create', 'action_teleport'])
		self._add_paths('player/menu', ['menu_abstract', 'action_row', 'action_create', 'action_fullscreen', 'menu_teleport', 'action_teleport', 'menu'])

		# Worlds.
		self._add_paths('worlds/world'                   , ['world_base'])
		self._add_paths('worlds/world/extensions'        , ['elements', 'elements_interactive', 'elements_root', 'elements_tab_target', 'input', 'state'])
		self._add_paths('worlds/world_manager'           , ['world_manager'])
		self._add_paths('worlds/world_manager/extensions', ['input', 'singletons'])
		self._add_paths('worlds/world/discrete'          , ['settings_world'])

		# Shaders.
		shaders_path = 'core/engine_extensions/rendering/shaders'
		self._add_paths(shaders_path                  , ['pre_process', 'shader_material_abstraction'])
		self._add_paths(shaders_path + '/background'  , ['shader_material_background', 'background'])
		self._add_paths(shaders_path + '/fxaa'        , ['fxaa'])
		self._add_paths(shaders_path + '/noise'       , ['noise', 'shader_material_noise'])
		self._add_paths(shaders_path + '/outline_glow', ['outline_glow'])
		self._add_paths(shaders_path + '/spritesheet' , ['shader_material_spritesheet'])
		self._add_paths(shaders_path + '/transition'  , ['shader_material_transition'])

		# Assets.
		self._add_paths('asset_management'              , ['pre_process', 'asset_manager', 'asset_batch', 'asset_file'])
		self._add_paths('asset_management/asset_batches', ['tile_batch'])

		# Websockets.
		self._add_paths('web_sockets', ['web_socket_manager', 'web_socket_sessions', 'request_buffer'])

