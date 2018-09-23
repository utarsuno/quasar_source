# coding=utf-8

"""This module, three_js_combined_library.py, contains the build processes for building the combined engine JS file."""

from libraries.code_api.code_manager.build_process.build_step import BuildProcessStep
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from libraries.universal_code import output_coloring as oc
from libraries.universal_code import useful_file_operations as ufo
from libraries.code_api.source_file_abstraction.code_files import code_file
from libraries.database_abstraction.sql.query_abstraction import sql_query as sql
from applications.code_manager.layer_applications.build_processes import three_js_library


class BuildProcessThreeJSCombinedLibrary(BuildProcessStep):
	"""Represents the build process steps for updating the ThreeJS library."""

	def __init__(self, domain):
		super().__init__(domain, None)

		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x0))
		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x1))
		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x2))

	def step_0x0(self):
		"""The first step."""

		self.js_libs = CodeDirectory('/quasar/libraries/front_end/js/third_party/three_js', base_directory=True, generated_output_directory='/quasar/generated_output/web_assets/')
		self.js_libs.add_extensions_to_ignore(['.min', '.gz'])
		self.js_libs.add_extension_to_match('.js')

		files = self.js_libs.get_all_files()

		any_file_cached = False

		for f in files:
			#print(f.full_path)

			cached_or_updated, file = self.domain.cache_single_file(
				code_file.FILE_TYPE_JS,
				None,
				f.full_path,
				'CALCULATE',
				sql.SQL_VALUE_NOW,
				#parent_f_id=None,
				#child_f_id=None,
				#content='CALCULATE'
			)

			if cached_or_updated:
				any_file_cached = True

				f.minify(
					'/quasar/generated_output/web_assets/' + f.file_name_with_extension.replace('.js', '.min.js'),
					preserve_first_comment_block=True
				)

		three_js_base_library_updated = self.domain.get_flag(three_js_library.DOMAIN_FLAG_THREE_JS_LIBRARY_UPDATED)

		if not any_file_cached and not three_js_base_library_updated:
			self.finish_early('combined ThreeJS already cached')

	def step_0x1(self):
		"""Create the combined library file."""
		files = self.js_libs.get_all_files()

		library_path = '/quasar/libraries/front_end/js/third_party/three_js/three.min.js'
		library_destination = '/quasar/generated_output/web_assets/three_js.min.js'

		ufo.file_op_copy(
			path_source=library_path,
			path_destination=library_destination
		)

		for f in files:
			minified_path = '/quasar/generated_output/web_assets/' + f.file_name_with_extension.replace('.js', '.min.js')
			ufo.file_op_append_files_content(source_path=library_destination, append_file_path=minified_path)

	def step_0x2(self):
		"""Transfer the created library file to the volume and create a gzipped version."""
		library_destination = '/quasar/generated_output/web_assets/three_js.min.js'

		cached_or_updated, file = self.domain.cache_single_file(
			code_file.FILE_TYPE_JS,
			'CALCULATE',
			library_destination,
			'CALCULATE',
			sql.SQL_VALUE_NOW
		)

		if cached_or_updated or file.child_f_id is None:

			volume_file_path    = '/nexus_volume/three_js.min.js.gz'
			generated_file_path = '/quasar/generated_output/web_assets/three_js.min.js.gz'
			ufo.file_op_create_gzip(library_destination, generated_file_path)

			child_cached_or_updated, child_file = self.domain.cache_single_file(
				code_file.FILE_TYPE_JS,
				'CALCULATE',
				generated_file_path,
				'CALCULATE',
				sql.SQL_VALUE_NOW
			)

			self.domain.link_child_file_to_parent(child_file, file)

			# Copy the two files into the Volume.
			ufo.file_op_copy(
				'/quasar/generated_output/web_assets/three_js.min.js',
				'/nexus_volume/three_js.min.js'
			)
			ufo.file_op_copy(generated_file_path, volume_file_path)


