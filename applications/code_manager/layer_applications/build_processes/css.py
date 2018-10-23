# coding=utf-8

"""This module, css.py, contains the build processes for building CSS files (if needed)."""

from libraries.code_api.code_manager.build_process.build_step_simple_isolated import BuildProcessStepSimpleAndIsolated
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory

DOMAIN_FLAG_CSS_FILES_THAT_UPDATED = 'CSS_files_that_have_been_updated'


class BuildProcessCSS(BuildProcessStepSimpleAndIsolated):
	"""Represents the build process steps for creating CSS files."""

	def __init__(self, domain):
		super().__init__(
			domain,
			CodeDirectory('/quasar/assets/css', base_directory=True),
			['.css'],
			['.min', '.gz']
		)

	def handle_cached_file(self, f, file):
		"""Code file is 'f', DB file is 'file'."""
		generated_file_path = self.domain.generated_content_path + f.file_name_with_minified_extension

		f.minify(generated_file_path)

		updated, child_file = self.domain.cache_child_file_based_off_base_code_file(
			base_code_file = f,
			base_file = file,
			child_path = generated_file_path
		)

		if updated:
			self.domain.flag_add_value(DOMAIN_FLAG_CSS_FILES_THAT_UPDATED, generated_file_path)
			self.log_sub_file_cached(f.file_name_with_minified_extension)
