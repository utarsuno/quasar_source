# coding=utf-8

"""This module, build_process_mqtt.py, builds the 3rd party library uTT."""

from libraries.code_api.code_manager.code_process_minify_then_gzip import CodeProcessMinifyThenGzip
from libraries.universal_code import output_coloring as oc
from libraries.code_api.source_file_abstraction.code_files import code_file
from libraries.code_api.project_abstraction.project_component import ProjectComponent


class CodeProcessCSS(CodeProcessMinifyThenGzip):
	"""Cache checker for CSS files."""

	def __init__(self, entity, parent_entity, domain):
		super().__init__(entity, parent_entity, domain, code_file.FILE_TYPE_CSS)

	def _run(self):
		oc.print_green('Running CodeProcessCSS')

		self.css = ProjectComponent('nexus_local_css')
		self.css.add_extensions_to_ignore(['.min', '.gz', '.min.gz', '.ignore', '.ignore.css'])
		self.css.add_base_directory('/quasar/assets/css')
		self.css.set_generated_file_path('/quasar/generated_output/web_assets/')
		self.css.load_all_content()

		self.output_path = '/quasar/generated_output/web_assets/'

		self.all_files = self.css.all_files
		self._perform_process()

