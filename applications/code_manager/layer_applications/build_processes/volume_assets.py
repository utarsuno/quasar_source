# coding=utf-8

"""This module, volume_assets.py, contains the build processes for building Volume assets (if needed)."""

from libraries.code_api.code_manager.build_process.build_step import BuildProcessStep
from libraries.universal_code import useful_file_operations as ufo


class BuildProcessVolumeAssets(BuildProcessStep):
	"""Represents the build process steps for creating Volume asset files."""

	def __init__(self, domain):
		super().__init__(domain, None)

		self.needed_volume_files = {}
		self._add_volume_file_reference('p0.png'                        , 'assets/texture/spritesheet/icons.png')
		self._add_volume_file_reference('p1.png'                        , 'assets/texture/third_party/transition.png')
		self._add_volume_file_reference('p2.png'                        , 'assets/favicon/favicon/favicon.pn')
		self._add_volume_file_reference('gentilis_regular.typeface.json', 'assets/fonts/three_js_fonts/gentilis_regular.typeface.json')

		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x0))

	def _add_volume_file_reference(self, destination, source):
		"""Utility function."""
		self.needed_volume_files[self.domain.volume_path + destination] = '/quasar/' + source

	def step_0x0(self):
		"""The first step."""

		# TODO: get if asset file has changed!

		for vf in self.needed_volume_files:
			#if not ufo.file_get_is_file(self.domain.volume_path + 'icons.png'):
			if not ufo.file_get_is_file(vf):
				ufo.file_op_copy(
					path_destination=vf,
					path_source=self.needed_volume_files[vf]
				)
				self.add_output_line('Added {' + vf + '} to volume.')

