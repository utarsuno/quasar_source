# coding=utf-8

"""This module, build_process_mqtt.py, builds the 3rd party library uTT."""

from libraries.code_api.code_manager.code_process_minify_then_gzip import CodeProcessMinifyThenGzip
from libraries.universal_code import output_coloring as oc
from libraries.code_api.source_file_abstraction.code_files import code_file
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory


class CodeProcessHTML(CodeProcessMinifyThenGzip):
	"""Cache checker for HTML files."""

	def __init__(self, entity, parent_entity, domain):
		super().__init__(entity, parent_entity, domain, code_file.FILE_TYPE_HTML)

	def _run(self):
		oc.print_green('Running CodeProcessHTML')

		self.html = CodeDirectory('/quasar/assets/html', base_directory=True, generated_output_directory='/quasar/generated_output/web_assets/')
		self.html.add_extensions_to_ignore(['.min', '.gz'])
		self.html.add_extension_to_match('.html')
		#self.html.load_all_content()

		self.all_files   = self.html.get_all_files()
		self.output_path = self.html.generated_output_directory
		self._perform_process()

