# coding=utf-8

"""This module, build_process_mqtt.py, builds the 3rd party library uTT."""

from libraries.code_api.code_manager.code_process_gzip import CodeProcessGzip
from libraries.universal_code import output_coloring as oc
from libraries.code_api.source_file_abstraction.code_files import code_file
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory


class CodeProcessJSLibs(CodeProcessGzip):
	"""Cache checker for JS Lib files."""

	def __init__(self, entity, parent_entity, domain):
		super().__init__(entity, parent_entity, domain, code_file.FILE_TYPE_JS)

	def _run(self):
		oc.print_green('Running CodeProcessJSLibs')

		# JS Libraries
		self.js_libraries = CodeDirectory('/quasar/libraries/front_end/js/third_party', base_directory=True)
		self.js_libraries.add_extensions_to_ignore(['.gz', '.min'])
		self.js_libraries.add_extension_to_match('.js')

		self.all_files = self.js_libraries.get_all_files()
		self._perform_process()


