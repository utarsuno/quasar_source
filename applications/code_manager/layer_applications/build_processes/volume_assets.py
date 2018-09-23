# coding=utf-8

"""This module, volume_assets.py, contains the build processes for building Volume assets (if needed)."""

from libraries.code_api.code_manager.build_process.build_step import BuildProcessStep
from libraries.universal_code import useful_file_operations as ufo


class BuildProcessVolumeAssets(BuildProcessStep):
	"""Represents the build process steps for creating Volume asset files."""

	def __init__(self, domain):
		super().__init__(domain, None)

		self.needed_volume_files = {
			self.domain.volume_path + 'p0.png'     : '/quasar/assets/texture/spritesheet/icons.png',
			self.domain.volume_path + 'p1.png'     : '/quasar/assets/texture/third_party/transition.png',
			self.domain.volume_path + 'favicon.png': '/quasar/assets/favicon/favicon.png'
		}

		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x0))

	def step_0x0(self):
		"""The first step."""
		for vf in self.needed_volume_files:
			if not ufo.file_get_is_file(self.domain.volume_path + 'icons.png'):
				ufo.file_op_copy(
					path_destination=vf,
					path_source=self.needed_volume_files[vf]
				)


