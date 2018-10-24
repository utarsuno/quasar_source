# coding=utf-8

"""This module, css.py, contains the build processes for building CSS files (if needed)."""

from libraries.code_api.code_manager.build_process.build_step_simple_isolated import BuildProcessStepSimpleAndIsolated
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory

DOMAIN_FLAG_CSS_FILES_THAT_UPDATED = 'CSS_files_that_have_been_updated'


class BuildProcessCSS(BuildProcessStepSimpleAndIsolated):
	"""Represents the build process steps for creating CSS files."""

	def __init__(self, domain):
		super().__init__(domain, CodeDirectory('/quasar/assets/css', base_directory=True), 'css', ['min', 'gz'])
		self.minifies = True
		self.gzips    = False

	def handle_minify_setup(self, code_file, minified_path: str, processed_file_path: str=None) -> None:
		"""Handles the minification step setup (if needed)."""
		code_file.minify(minified_path)

	def handle_minify_end(self, code_file, minified_path: str, updated: bool) -> None:
		"""Handles the minification step end (if needed)."""
		if updated:
			self.domain.flag_add_value(DOMAIN_FLAG_CSS_FILES_THAT_UPDATED, minified_path)
			self.log_sub_file_cached(code_file.file_name_with_minified_extension)
