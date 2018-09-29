# coding=utf-8

"""This module, css.py, contains the build processes for building CSS files (if needed)."""

from libraries.code_api.code_manager.build_process.build_step import BuildProcessStep
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory

DOMAIN_FLAG_CSS_FILES_THAT_UPDATED = 'CSS_files_that_have_been_updated'


class BuildProcessCSS(BuildProcessStep):
	"""Represents the build process steps for creating CSS files."""

	def __init__(self, domain):
		super().__init__(domain, None)

		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x0))

	def step_0x0(self):
		"""The first step."""
		self.css = CodeDirectory('/quasar/assets/css', base_directory=True)
		self.css.add_extensions_to_ignore(['.min', '.gz'])
		self.css.add_extension_to_match('.css')

		files = self.css.get_all_files()

		for f in files:

			cached_or_updated, file = self.domain.cache_base_file(f)

			if cached_or_updated:
				generated_file_path = self.domain.generated_content_path + f.file_name_with_minified_extension

				updated, child_file = self.domain.cache_child_file_based_off_base_code_file(
					base_code_file=f,
					base_file=file,
					child_path=generated_file_path
				)

				if updated:
					self.domain.add_value_to_flag(DOMAIN_FLAG_CSS_FILES_THAT_UPDATED, generated_file_path)
					#self.finish_early('CSS was updated.')
					self.add_output_line('Cached {' + f.file_name + '}.')
