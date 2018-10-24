# coding=utf-8

"""This module, three_js_combined_library.py, contains the build processes for building the combined engine JS file."""

from libraries.code_api.code_manager.build_process.build_step_simple_isolated import BuildProcessStepSimpleAndIsolated
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from libraries.universal_code import useful_file_operations as ufo


class BuildProcessJSIndependentLibraries(BuildProcessStepSimpleAndIsolated):
	"""Represents the build process steps for building the independent JS Libraries."""

	def __init__(self, domain):
		super().__init__(domain, CodeDirectory('/quasar/libraries/front_end/js/third_party/cookies', base_directory=True), 'js', ['min', 'gz'])
		self.minifies = True
		self.gzips    = False

	def handle_minify_setup(self, code_file, minified_path: str, processed_file_path: str=None) -> None:
		"""Handles the minification step setup (if needed)."""
		code_file.minify(minified_path, preserve_first_comment_block=True)

	def handle_minify_end(self, code_file, minified_path: str, updated: bool) -> None:
		"""Handles the minification step end (if needed)."""
		pass

	def handle_gzip_setup(self, base_path: str, gzip_path: str) -> None:
		"""Handles the gzip step setup (if needed)."""
		ufo.file_op_create_gzip(base_path, gzip_path)

	def handle_gzip_end(self, base_path: str, gzip_path: str, base_volume_path: str, gzip_volume_path: str) -> None:
		"""Handles the gzip step end (if needed)."""
		# Now copy the needed files to the volume.
		ufo.file_op_copy(base_path, base_volume_path)
		ufo.file_op_copy(gzip_path, gzip_volume_path)

