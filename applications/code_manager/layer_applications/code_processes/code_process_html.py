# coding=utf-8

"""This module, build_process_mqtt.py, builds the 3rd party library uTT."""

from libraries.code_api.code_manager.code_process_minify_then_gzip import CodeProcessMinifyThenGzip
from libraries.universal_code import output_coloring as oc
from libraries.code_api.source_file_abstraction.code_files import code_file


from libraries.code_api.project_abstraction.project_component import ProjectComponent


class CodeProcessHTML(CodeProcessMinifyThenGzip):
	"""Cache checker for HTML files."""

	def __init__(self, entity, parent_entity, domain):
		super().__init__(entity, parent_entity, domain, code_file.FILE_TYPE_HTML)

	def _run(self):
		oc.print_green('Running CodeProcessHTML')

		self.html = ProjectComponent('nexus_local_html')
		self.html.add_extensions_to_ignore(['.min', '.gz', '.min.gz'])
		self.html.add_base_directory('/quasar/assets/html')
		self.html.set_generated_file_path('/quasar/generated_output/web_assets/')
		self.html.load_all_content()

		self.output_path = '/quasar/generated_output/web_assets/'

		self.all_files = self.html.all_files
		self._perform_process()

		'''
			for f in files:
			just_cached, needs_update = self.db.cache_file(f)
			if just_cached or needs_update:
				if just_cached:
					oc.print_data(str(f) + ' was cached.')
				else:
					oc.print_data(str(f) + ' was updated.')
				minified_cached, gf_id, full_path = self.db.cache_file_minified(f, generated_files_path, needs_update)
				if not minified_cached or needs_update:
					oc.print_data(str(f) + ' was minified.')
					gzip_cached = self.db.cache_file_gzipped(gf_id, full_path, needs_update)
					if gzip_cached:
						oc.print_data(str(f) + ' was gzipped.')
					else:
						oc.print_data(str(f) + ' is already gzipped.')
				else:
					oc.print_data(str(f) + ' is already minified.')
			else:
				oc.print_data(str(f) + ' is already cached.')
		'''

