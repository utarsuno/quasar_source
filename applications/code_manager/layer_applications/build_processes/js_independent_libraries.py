# coding=utf-8

"""This module, three_js_combined_library.py, contains the build processes for building the combined engine JS file."""

from libraries.code_api.code_manager.build_step_simple_isolated import BuildProcessStepSimpleAndIsolated
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from libraries.universal_code import useful_file_operations as ufo


class BuildProcessJSIndependentLibraries(BuildProcessStepSimpleAndIsolated):
	"""Represents the build process steps for building the independent JS Libraries."""

	def __init__(self, domain):
		super().__init__(domain, CodeDirectory('/quasar_source/libraries/front_end/js/third_party/cookies', base_directory=True), 'js', ['min', 'gz'])
		self.minifies = True
		self.gzips    = False

	def handle_minify_setup(self, code_file, minified_path: str, processed_file_path: str=None) -> None:
		"""Handles the minification step setup (if needed)."""
		code_file.minify(minified_path, preserve_first_comment_block=True)

	def handle_minify_end(self, code_file, minified_path: str, updated: bool) -> None:
		"""Handles the minification step end (if needed)."""
		pass

