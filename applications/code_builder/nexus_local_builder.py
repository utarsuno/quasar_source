# coding=utf-8

"""This module, build_nexus_local.py, builds NexusLocal."""

from libraries.universal_code import output_coloring as oc
from libraries.code_api.project_abstraction.project_component import ProjectComponent
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from libraries.code_api.code_builder.build_step import BuildStep

from applications.code_builder.nexus_local_builder_db import NexusLocalBuilderDB

from applications.code_builder import javascript_manager as jsm


class NexusLocalBuilder(object):
	"""Builds NexusLocal."""

	def __init__(self):
		self.db = NexusLocalBuilderDB()

		self.is_build_nexus_local = True
		self.is_build_quasar      = False

		self.build_steps = []

		#self._quasar_rendering_engine = CodeProject('quasar_rendering_engine')

		# Assets
		self.assets = ProjectComponent('nexus_local_assets')
		self.assets.add_base_code_directory(CodeDirectory('/quasar/assets/front_end/shaders/'))
		self.assets.load_all_content()

		# JS
		self.javascript_manager = jsm.JavascriptManager(self)

		self.js = self.javascript_manager.load_all_content()

		# JS Libraries
		self.js_libraries = ProjectComponent('nexus_local_js_libraries')
		#self.js_libraries.add_extension_to_ignore('.min')
		self.js_libraries.add_extension_to_ignore('.gz')
		self.js_libraries.add_extension_to_ignore('.min.gz')
		self.js_libraries.add_extension_to_ignore('')
		self.js_libraries.add_base_code_directory(CodeDirectory('/quasar/libraries/front_end/js/third_party'))
		self.js_libraries.load_all_content()

		# HTML
		self.html = ProjectComponent('nexus_local_html')
		self.html.add_extension_to_ignore('.min')
		self.html.add_extension_to_ignore('.gz')
		self.html.add_extension_to_ignore('.min.gz')
		self.html.add_base_code_directory(CodeDirectory('/quasar/assets/front_end/html'))
		self.html.set_generated_file_path('/quasar/generated_output/web_assets/')
		self.html.load_all_content()

		# CSS
		self.css = ProjectComponent('nexus_local_css')
		self.css.add_extension_to_ignore('.min')
		self.css.add_extension_to_ignore('.gz')
		self.css.add_extension_to_ignore('.min.gz')
		self.css.add_base_code_directory(CodeDirectory('/quasar/assets/front_end/css'))
		self.css.set_generated_file_path('/quasar/generated_output/web_assets/')
		self.css.load_all_content()

		self.build_steps.append(BuildStep('html', self._build_html))
		self.build_steps.append(BuildStep('css', self._build_css))
		self.build_steps.append(BuildStep('js', self._build_js))
		self.build_steps.append(BuildStep('js-libs', self._build_js_libs))

	def build(self):
		"""Builds Nexus Local."""
		oc.print_ascii_yellow('building nexus local')

		for step in self.build_steps:
			step.run_step()

		self.db.print_all_data()

	def _build_html(self):
		"""Builds the HTML files."""
		files = self.html.all_files
		for f in files:
			cached = self.db.cache_db_file(f)
			if cached:
				oc.print_data(str(f) + ' is already cached.')
			else:
				oc.print_data(str(f) + ' was cached.')

				row_id = self.db.get_file_row_id(f)

				minified_file_path = f.generate_minified_file(None, self.html._generated_files_path)

				self.db.create_compressed_file(minified_file_path, f.compressed_size, row_id)
				self.db.create_gzip_file(minified_file_path, row_id)

	def _build_css(self):
		"""Builds the CSS files."""
		files = self.css.all_files
		for f in files:

			if 'quasar_engine.css' in f.file_name_with_extension:
				continue

			cached = self.db.cache_db_file(f)
			if cached:
				oc.print_data(str(f) + ' is already cached.')
			else:
				oc.print_data(str(f) + ' was cached.')

				libraries_needed = f.get_required_import_files()
				if len(libraries_needed) > 0:
					libraries = []
					for lib in libraries_needed:
						libraries.append(self.css.get_file_by_name(lib))
						minified_file_path = f.generate_minified_file(libraries, self.css._generated_files_path)
				else:
					minified_file_path = f.generate_minified_file(None, self.css._generated_files_path)

				row_id = self.db.get_file_row_id(f)
				self.db.create_compressed_file(minified_file_path, f.compressed_size, row_id)
				self.db.create_gzip_file(minified_file_path, row_id)

	def _build_js(self):
		"""Builds the JS files."""
		f = self.javascript_manager.build_js(self.assets)
		cached = self.db.cache_db_file(f)
		if cached:
			oc.print_data(str(f) + ' is already cached.')
		else:
			oc.print_data(str(f) + ' was cached.')

			minified_file_path = f.generate_minified_file(None, self.js._generated_files_path)
			row_id = self.db.get_file_row_id(f)
			self.db.create_compressed_file(minified_file_path, f.compressed_size, row_id)
			self.db.create_gzip_file(minified_file_path, row_id)

	def _build_js_libs(self):
		"""Builds the JS lib files."""
		files = self.js_libraries.all_files
		for f in files:
			cached = self.db.cache_db_file(f)
			if cached:
				oc.print_data(str(f) + ' is already cached.')
			else:
				oc.print_data(str(f) + ' was cached.')

				row_id = self.db.get_file_row_id(f)
				self.db.create_gzip_file(f.full_path, row_id)
