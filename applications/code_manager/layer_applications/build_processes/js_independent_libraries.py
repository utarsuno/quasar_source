# coding=utf-8

"""This module, three_js_combined_library.py, contains the build processes for building the combined engine JS file."""

from libraries.code_api.code_manager.build_process.build_step import BuildProcessStep
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from libraries.universal_code import useful_file_operations as ufo
from libraries.code_api.source_file_abstraction.code_files import code_file
from libraries.database_abstraction.sql.query_abstraction import sql_query as sql


class BuildProcessJSIndependentLibraries(BuildProcessStep):
	"""Represents the build process steps for building the independent JS Libraries."""

	def __init__(self, domain):
		super().__init__(domain, None)

		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x0))

	def step_0x0(self):
		"""The first step."""

		self.js_libs = CodeDirectory('/quasar/libraries/front_end/js/third_party/cookies', base_directory=True, generated_output_directory='/quasar/generated_output/web_assets/')
		self.js_libs.add_extensions_to_ignore(['.min', '.gz'])
		self.js_libs.add_extension_to_match('.js')

		files = self.js_libs.get_all_files()

		for f in files:

			cached_or_updated, file = self.domain.cache_single_file(
				code_file.FILE_TYPE_JS,
				'CALCULATE',
				f.full_path,
				'CALCULATE',
				sql.SQL_VALUE_NOW
			)

			if cached_or_updated:

				# Now minify.
				minified_path = '/quasar/generated_output/web_assets/' + f.file_name_with_extension.replace('.js', '.min.js')

				f.minify(minified_path, preserve_first_comment_block=True)

				cached_or_updated, minified_file = self.domain.cache_single_file(
					code_file.FILE_TYPE_JS,
					'CALCULATE',
					minified_path,
					'CALCULATE',
					sql.SQL_VALUE_NOW
				)
				self.domain.link_child_file_to_parent(minified_file, file)

				# Now GZIP.
				gzip_path = minified_path + '.gz'
				ufo.file_op_create_gzip(minified_path, gzip_path)

				gzip_cached_or_updated, gzip_file = self.domain.cache_single_file(
					code_file.FILE_TYPE_JS,
					'CALCULATE',
					gzip_path,
					'CALCULATE',
					sql.SQL_VALUE_NOW
				)
				self.domain.link_child_file_to_parent(gzip_file, minified_file)

				# Now copy the needed files to the volume.
				_f_name = f.file_name_with_extension.replace('.js', '.min.js')
				volume_file_path = '/nexus_volume/' + _f_name
				ufo.file_op_copy(minified_path, volume_file_path)
				ufo.file_op_copy(gzip_path, volume_file_path + '.gz')

