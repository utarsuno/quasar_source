# coding=utf-8

"""This module, build_process_mqtt.py, builds the 3rd party library uTT."""

from libraries.code_api.code_manager.code_process_minify_then_gzip import CodeProcessMinifyThenGzip
from libraries.universal_code import output_coloring as oc
from libraries.code_api.source_file_abstraction.code_files import code_file
from applications.code_manager.layer_applications import javascript_manager as jsm
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory


class CodeProcessJS(CodeProcessMinifyThenGzip):
	"""Cache checker for JS files."""

	def __init__(self, entity, parent_entity, domain):
		super().__init__(entity, parent_entity, domain, code_file.FILE_TYPE_JS)

		self.is_build_nexus_local = True
		self.is_build_quasar      = False

	def _run(self):
		oc.print_green('Running CodeProcessJS')

		# Assets
		self.assets = CodeDirectory('/quasar/assets/shaders/', base_directory=True, generated_output_directory='/quasar/generated_output/web_assets/')
		self.assets.add_extensions_to_match(['.jpeg', '.jpg', '.png', '.frag', '.vert'])

		self.output_path = self.assets.generated_output_directory

		# JS
		self.javascript_manager = jsm.JavascriptManager(self)
		self.js = self.javascript_manager.load_all_content()

		# Check if any JS file changed.
		files = self.js.get_all_files()

		file_changed = False

		for f in files:
			cached_or_updated, file = self.domain.cache_single_file(
				self.code_file_type,
				None,
				f.full_path,
				'CALCULATE',
				False, False, False
			)
			if cached_or_updated:
				file_changed = True

		if file_changed:
			oc.print_green('JS code updated!')
			f = self.javascript_manager.build_js(self.assets)
			self.all_files = [f]
			self._perform_process()
		else:
			oc.print_data_with_red_dashes_at_start('JS code did not change (and already cached).')

