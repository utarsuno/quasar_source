# coding=utf-8

"""This module, nexus_local.py, runs the build process to create nexus_local.js (if needed)."""


from libraries.code_api.code_manager.build_step import BuildProcessStep
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from libraries.universal_code import useful_file_operations as ufo


_PREPROCESSED = '.preprocessed'


class BuildProcessShaders(BuildProcessStep):
	"""Represents the build process steps for building shaders (if needed)."""

	def __init__(self, domain):
		super().__init__(domain, None)

		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x0))

	def step_0x0(self):
		"""The first step."""

		# Shaders.
		self.shaders = CodeDirectory('/quasar_source/assets/shaders/', base_directory=True)
		self.shaders.add_extensions_to_match(['frag', 'vert'])
		self.shaders.add_extension_to_ignore('md')

		files = self.shaders.get_all_files()

		for f in files:
			if _PREPROCESSED in f.full_path:

				needed_file = f.full_path.replace(_PREPROCESSED, '')
				temp_path   = '/usr/lib/' + f.file_name_with_extension.replace(_PREPROCESSED, '')

				if not ufo.file_get_is_file(needed_file):

					ufo.file_op_copy(
						path_source      = f.full_path,
						path_destination = temp_path
					)

					o = self.run_bash_step(
						'glslify ' + temp_path + ' -o ' + needed_file,
						cwd='/usr/lib'
					)
