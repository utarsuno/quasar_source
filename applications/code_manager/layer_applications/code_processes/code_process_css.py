# coding=utf-8

"""This module, build_process_mqtt.py, builds the 3rd party library uTT."""

from libraries.code_api.code_manager.code_process_minify import CodeProcessMinify
from libraries.universal_code import output_coloring as oc
from libraries.code_api.source_file_abstraction.code_files import code_file
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory


class CodeProcessCSS(CodeProcessMinify):
	"""Cache checker for CSS files."""

	def __init__(self, entity, parent_entity, domain):
		super().__init__(entity, parent_entity, domain, code_file.FILE_TYPE_CSS)

	def _run(self):
		oc.print_green('Running CodeProcessCSS')

		self.css = CodeDirectory('/quasar/assets/css', base_directory=True, generated_output_directory='/quasar/generated_output/web_assets/')
		self.css.add_extensions_to_ignore(['.min', '.gz', '.ignore'])
		self.css.add_extension_to_match('.css')

		self.all_files   = self.css.get_all_files()
		self.output_path = self.css.generated_output_directory
		self._perform_process()

