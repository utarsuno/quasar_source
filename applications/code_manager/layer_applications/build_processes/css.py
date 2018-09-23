# coding=utf-8

"""This module, css.py, contains the build processes for building CSS files (if needed)."""

from libraries.code_api.code_manager.build_process.build_step import BuildProcessStep
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory

from libraries.universal_code import output_coloring as oc
from libraries.universal_code import useful_file_operations as ufo
from libraries.code_api.source_file_abstraction.code_files import code_file
from libraries.database_abstraction.sql.query_abstraction import sql_query as sql


DOMAIN_FLAG_CSS_FILES_THAT_UPDATED = 'CSS_files_that_have_been_updated'


class BuildProcessCSS(BuildProcessStep):
	"""Represents the build process steps for creating CSS files."""

	def __init__(self, domain):
		super().__init__(domain, None)

		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x0))

	def step_0x0(self):
		"""The first step."""
		self.css = CodeDirectory('/quasar/assets/css', base_directory=True, generated_output_directory='/quasar/generated_output/web_assets/')
		self.css.add_extensions_to_ignore(['.min', '.gz'])
		self.css.add_extension_to_match('.css')

		files = self.css.get_all_files()

		for f in files:

			cached_or_updated, file = self.domain.cache_single_file(
				code_file.FILE_TYPE_CSS,
				'CALCULATE',
				f.full_path,
				'CALCULATE',
				sql.SQL_VALUE_NOW,
			)

			if cached_or_updated:
				generated_file_path = '/quasar/generated_output/web_assets/' + f.file_name_with_extension.replace('.css', '.min.css')
				f.minify(generated_file_path)

				child_cached_or_updated, child_file = self.domain.cache_single_file(
					code_file.FILE_TYPE_CSS,
					'CALCULATE',
					generated_file_path,
					'CALCULATE',
					sql.SQL_VALUE_NOW
				)

				self.domain.link_child_file_to_parent(child_file, file)

				self.domain.add_value_to_flag(DOMAIN_FLAG_CSS_FILES_THAT_UPDATED, generated_file_path)
