# coding=utf-8

"""This module, volume_assets.py, contains the build processes for building Volume assets (if needed)."""

from libraries.code_api.code_manager.build_process.build_step import BuildProcessStep
from libraries.universal_code import useful_file_operations as ufo


class BuildProcessVolumeAssets(BuildProcessStep):
	"""Represents the build process steps for creating Volume asset files."""

	def __init__(self, domain):
		super().__init__(domain, None)

		self.needed_volume_files = {}
		self._add_volume_file_reference('p0.png'                        , 'texture/spritesheet/icons.png')
		self._add_volume_file_reference('p1.png'                        , 'texture/third_party/transition.png')
		self._add_volume_file_reference('p2.png'                        , 'favicon/favicon.png')

		self._add_volume_file_reference('p3_0.jpg', 'texture/third_party/tile/Tiles_009_COLOR.jpg')
		self._add_volume_file_reference('p3_1.png', 'texture/third_party/tile/Tiles_009_DISP.png')
		self._add_volume_file_reference('p3_2.jpg', 'texture/third_party/tile/Tiles_009_NORM.jpg')
		self._add_volume_file_reference('p3_3.jpg', 'texture/third_party/tile/Tiles_009_OCC.jpg')
		self._add_volume_file_reference('p3_4.jpg', 'texture/third_party/tile/Tiles_009_SPEC.jpg')

		self._add_volume_file_reference('p4_0.png', 'texture/third_party/hardwood/wood_parquet_02_ALB_1.png')
		self._add_volume_file_reference('p4_1.png', 'texture/third_party/hardwood/wood_parquet_02_GLOSS_med.png')
		self._add_volume_file_reference('p4_2.png', 'texture/third_party/hardwood/wood_parquet_02_NRM.png')
		self._add_volume_file_reference('p4_3.png', 'texture/third_party/hardwood/wood_parquet_02_SPEC.png')

		self._add_volume_file_reference('ba.jpg', 'texture/skybox/ba.jpg')
		self._add_volume_file_reference('bo.jpg', 'texture/skybox/bo.jpg')
		self._add_volume_file_reference('f.jpg' , 'texture/skybox/f.jpg')
		self._add_volume_file_reference('l.jpg' , 'texture/skybox/l.jpg')
		self._add_volume_file_reference('r.jpg' , 'texture/skybox/r.jpg')
		self._add_volume_file_reference('t.jpg' , 'texture/skybox/t.jpg')

		self._add_volume_file_reference('gentilis_regular.typeface.json', 'fonts/three_js_fonts/gentilis_regular.typeface.json')

		# TEMPORARY SOLUTION
		self._add_volume_file_reference_raw('three_js.min.js', '/quasar/generated_output/web_assets/three_js.min.js')
		self._add_volume_file_reference_raw('three_js.min.js.gz', '/quasar/generated_output/web_assets/three_js.min.js.gz')

		self._add_volume_file_reference_raw('cookie.min.js', '/quasar/generated_output/web_assets/cookie.min.js')
		self._add_volume_file_reference_raw('cookie.min.js.gz', '/quasar/generated_output/web_assets/cookie.min.js.gz')

		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x0))

	def _add_volume_file_reference(self, destination, source):
		"""Utility function."""
		self.needed_volume_files[self.domain.volume_path + destination] = '/quasar/assets/' + source

	def _add_volume_file_reference_raw(self, destination, source):
		"""Utility function."""
		self.needed_volume_files[self.domain.volume_path + destination] = source

	def step_0x0(self):
		"""The first step."""

		# TODO: get if asset file has changed!

		for vf in self.needed_volume_files:
			if not ufo.file_get_is_file(vf):
				ufo.file_op_copy(
					path_destination=vf,
					path_source=self.needed_volume_files[vf]
				)
				self.add_output_line('Added {' + vf + '} to volume.')


