# coding=utf-8

"""This module, code_process_docker_volume.py, makes sure the docker volume exists and has the needed data."""


'''

from libraries.code_api.code_manager.code_process_gzip import CodeProcessGzip
from libraries.universal_code import output_coloring as oc
from libraries.code_api.source_file_abstraction.code_files import code_file

from libraries.code_api.project_abstraction.project_component import ProjectComponent
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory


class CodeProcessJSLibs(CodeProcessGzip):
	"""Cache checker for JS Lib files."""

	def __init__(self, entity, parent_entity, domain):
		super().__init__(entity, parent_entity, domain, code_file.CODE_FILE_TYPE_JS_FILE)

	def _run(self):
		oc.print_green('Running CodeProcessJSLibs')

		# JS Libraries
		self.js_libraries = ProjectComponent('nexus_local_js_libraries')
		self.js_libraries.add_extensions_to_ignore(['.gz', '.min.gz', ''])
		self.js_libraries.add_base_code_directory(CodeDirectory('/quasar/libraries/front_end/js/third_party'))
		self.js_libraries.load_all_content()

		self.all_files = self.js_libraries.all_files
		self._perform_process()



'''