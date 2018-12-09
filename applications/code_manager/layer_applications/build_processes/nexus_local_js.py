# coding=utf-8

"""This module, nexus_local.py, runs the build process to create nexus_local.js (if needed)."""

from applications.code_manager.layer_applications import nexus_local
from libraries.code_api.code_manager.build_step import BuildProcessStep
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from libraries.universal_code import useful_file_operations as ufo


class BuildProcessJSNexusLocal(BuildProcessStep):
	"""Represents the build process steps for building nexus_local.js (if needed)."""

	def __init__(self, domain):
		super().__init__(domain, None)

		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x0))
		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x1))

		# TODO: AUTOMATICALLY CHECK FOR CHANGES IN THE SHADER FILES!

	def step_0x0(self):
		"""The first step."""

		# Shaders.
		self.shaders = CodeDirectory('/quasar/assets/shaders/', base_directory=True)
		self.shaders.add_extensions_to_match(['frag', 'vert'])
		self.shaders.add_extension_to_ignore('md')

		# JS
		self.javascript_manager = nexus_local.JavascriptManagerNexusLocal(self.domain)
		self.js                 = self.javascript_manager.load_all_content()

		files = self.js.get_all_files()

		file_changed = False

		for f in files:
			cached_or_updated, file = self.domain.cache_single_file(
				f.file_type,
				None,
				f.full_path,
				'CALCULATE'
			)
			if cached_or_updated:
				file_changed = True

		if file_changed:
			f = self.javascript_manager.build_js(self.shaders)
			self.all_files = [f]
		else:
			self.finish_early('No engine JS files changed!')

	def step_0x1(self):
		"""Builds the JS engine file."""
		for f in self.all_files:

			minified_path           = self.domain.path_output + f.file_name_with_minified_extension
			gzip_path               = minified_path + '.gz'
			volume_file_path        = self.domain.path_volume + f.file_name_with_minified_extension

			if 'nexus_local' in volume_file_path:
				volume_file_path = volume_file_path.replace('nexus_local', 'nl')

			updated_or_cached, file = self.domain.cache_base_file(f)
			if updated_or_cached:
				f.minify(output_path=minified_path)

				updated_or_cached, minified_file = self.domain.cache_child_file_based_off_base_code_file(
					base_code_file=f,
					base_file=file,
					child_path=minified_path
				)

				ufo.file_op_create_gzip(minified_path, gzip_path)

				# Gzip.
				updated_or_cached, gzip_file = self.domain.cache_child_file_based_off_base_code_file(
					base_code_file=f,
					base_file=minified_file,
					child_path=gzip_path
				)

				# Now copy the needed files to the volume.
				ufo.file_op_copy(minified_path, volume_file_path)
				ufo.file_op_copy(gzip_path    , volume_file_path + '.gz')

				#self.finish_early('NexusLocal was generated.')
				self.add_output_line('Cached {' + f.file_name + '}.')

			else:
				# Ensure volume file exists.
				if not ufo.file_get_is_file(volume_file_path):
					ufo.file_op_copy(minified_path, volume_file_path)
					ufo.file_op_copy(gzip_path, volume_file_path + '.gz')
