# coding=utf-8

"""This module, three_js_combined_library.py, contains the build processes for building the combined engine JS file."""

from libraries.code_api.code_manager.build_process.build_step import BuildProcessStep
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from libraries.universal_code import useful_file_operations as ufo


class BuildProcessJSIndependentLibraries(BuildProcessStep):
	"""Represents the build process steps for building the independent JS Libraries."""

	def __init__(self, domain):
		super().__init__(domain, None)

		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x0))

	def step_0x0(self):
		"""The first step."""

		self.js_libs = CodeDirectory('/quasar/libraries/front_end/js/third_party/cookies', base_directory=True)
		self.js_libs.add_extensions_to_ignore(['.min', '.gz'])
		self.js_libs.add_extension_to_match('.js')

		files = self.js_libs.get_all_files()

		for f in files:

			cached_or_updated, file = self.domain.cache_base_file(f)

			if cached_or_updated:

				# Now minify.
				minified_path = self.domain.generated_content_path + f.file_name_with_minified_extension
				f.minify(minified_path, preserve_first_comment_block=True)

				cached_or_updated, minified_file = self.domain.cache_child_file_based_off_base_code_file(
					base_code_file=f,
					base_file=file,
					child_path=minified_path
				)

				# Now GZIP.
				gzip_path = minified_path + '.gz'
				ufo.file_op_create_gzip(minified_path, gzip_path)

				gzip_cached_or_updated, gzip_file = self.domain.cache_child_file_based_off_base_code_file(
					base_code_file=f,
					base_file=minified_file,
					child_path=gzip_path
				)

				# Now copy the needed files to the volume.
				volume_file_path = self.domain.volume_path + f.file_name_with_minified_extension
				ufo.file_op_copy(minified_path, volume_file_path)
				ufo.file_op_copy(gzip_path    , volume_file_path + '.gz')

				#self.finish_early('JS Library was updated.')
