# coding=utf-8

"""This module, volume_assets.py, contains the build processes for building Volume assets (if needed)."""

from libraries.code_api.code_manager.build_step import BuildProcessStep
from libraries.universal_code import useful_file_operations as ufo


class BuildProcessVolumeAssets(BuildProcessStep):
	"""Represents the build process steps for creating Volume asset files."""

	def __init__(self, domain):
		super().__init__(domain, None)

		self.needed_files_volume     = {}
		self.needed_files_compressed = {}

		self._add_volume_file_reference('p0.png', 'texture/spritesheet/icons.png')
		self._add_volume_file_reference('p1.jpg', 'texture/third_party/transition.png')
		self._add_volume_file_reference('p2.png', 'favicon/favicon.png')

		self._add_volume_file_reference('p4_0.jpg', 'texture/third_party/hardwood/wood_parquet_02_ALB_1.png')
		self._add_volume_file_reference('p4_1.jpg', 'texture/third_party/hardwood/wood_parquet_02_GLOSS_med.png')
		self._add_volume_file_reference('p4_2.jpg', 'texture/third_party/hardwood/wood_parquet_02_NRM.png')
		self._add_volume_file_reference('p4_3.jpg', 'texture/third_party/hardwood/wood_parquet_02_SPEC.png')

		self._add_volume_file_reference('ba.jpg', 'texture/skybox/ba.jpg')
		self._add_volume_file_reference('bo.jpg', 'texture/skybox/bo.jpg')
		self._add_volume_file_reference('f.jpg' , 'texture/skybox/f.jpg')
		self._add_volume_file_reference('l.jpg' , 'texture/skybox/l.jpg')
		self._add_volume_file_reference('r.jpg' , 'texture/skybox/r.jpg')
		self._add_volume_file_reference('t.jpg' , 'texture/skybox/t.jpg')

		self._add_volume_file_reference('gentilis_regular.typeface.json', 'fonts/three_js_fonts/gentilis_regular.typeface.json')

		# TEMPORARY SOLUTION
		self._add_volume_file_reference_raw('Inconsolata.woff', '/quasar_source/assets/fonts/Inconsolata.woff')

		self._add_volume_file_reference_raw('manifest.webmanifest', '/quasar_source/configs/js/manifest.webmanifest')

		self._add_volume_file_reference_raw('_3js.min.js', '/quasar_source/generated_output/web_assets/three_js.min.js')
		self._add_volume_file_reference_raw('_3js.min.js.gz', '/quasar_source/generated_output/web_assets/three_js.min.js.gz')
		self._add_volume_file_reference_raw('nl.min.js', '/quasar_source/generated_output/web_assets/nexus_local.min.js')
		self._add_volume_file_reference_raw('nl.min.js.gz', '/quasar_source/generated_output/web_assets/nexus_local.min.js.gz')
		self._add_volume_file_reference_raw('nl.min.html', '/quasar_source/generated_output/web_assets/nexus_local.min.html')
		self._add_volume_file_reference_raw('nl.min.html.gz', '/quasar_source/generated_output/web_assets/nexus_local.min.html.gz')

		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x0))

	def _add_volume_file_reference(self, destination, source):
		"""Utility function."""
		self.needed_files_volume[self.domain.path_volume + destination] = '/quasar_source/assets/' + source
		self.needed_files_compressed['/quasar_source/assets/' + source] = '/quasar_source/generated_output/local/code_manager/' + destination

	def _add_volume_file_reference_raw(self, destination, source):
		"""Utility function."""
		self.needed_files_volume[self.domain.path_volume + destination] = source

	def step_0x0(self):
		"""The first step."""

		# TODO: get if asset file has changed!

		for vf in self.needed_files_volume:
			if not ufo.file_get_is_file(vf):

				use_compressed_path = False
				compressed_path     = None

				if self.needed_files_volume[vf] in self.needed_files_compressed and '.json' not in self.needed_files_volume[vf]:
					compressed_file     = self.needed_files_compressed[self.needed_files_volume[vf]]
					use_compressed_path = True
					compressed_path     = compressed_file
					if not ufo.file_get_is_file(compressed_file):
						self.add_output_line('Compressing {' + compressed_file + '}.')
						print('Compressing {' + compressed_file + '}.')
						if '.png' in vf and '.jpg' in self.needed_files_volume[vf]:
							ufo.file_op_convert_png_to_compressed_jpg(self.needed_files_volume[vf], compressed_file)
						else:
							ufo.file_op_compress_image(self.needed_files_volume[vf], compressed_file)

				if use_compressed_path:
					ufo.file_op_copy(
						path_destination = vf,
						path_source      = compressed_path
					)
				else:
					ufo.file_op_copy(
						path_destination = vf,
						path_source      = self.needed_files_volume[vf]
					)
				self.add_output_line('Added {' + vf + '} to volume.')


