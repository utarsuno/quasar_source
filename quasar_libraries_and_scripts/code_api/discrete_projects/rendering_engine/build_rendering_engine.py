# coding=utf-8

"""This module, build_rendering_engine.py, builds the core front end rendering engine."""

from quasar_libraries_and_scripts.code_api.project_abstraction.code_project import CodeProject
from quasar_libraries_and_scripts.code_api.project_abstraction.project_component import ProjectComponent
from quasar_libraries_and_scripts.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from quasar_libraries_and_scripts.universal_code import output_coloring as oc
from quasar_libraries_and_scripts.universal_code.system_abstraction import program_arguments as pa
from quasar_libraries_and_scripts.universal_code import debugging as dbg
from quasar_libraries_and_scripts.code_api.discrete_projects.rendering_engine import javascript_manager as jsm
from quasar_libraries_and_scripts.universal_code.time_abstraction.simple_timer import SimpleTimer

_ENGINE_COMPONENT_TAG_CSS    = 'css'
_ENGINE_COMPONENT_TAG_JS     = 'js'
_ENGINE_COMPONENT_TAG_HTML   = 'html'
_ENGINE_COMPONENT_TAG_ASSETS = 'assets'

QUASAR_RENDERING_ENGINE_FOR_NEXUS    = 'n'
QUASAR_RENDERING_ENGINE_FOR_PUBLIC   = 'p'
QUASAR_RENDERING_ENGINE_BUILD_ASSETS = 'a'


class QuasarRenderingEngineBuilder(object):
	"""Builds the Quasar Rendering Engine."""

	def __init__(self, engine_version):
		self._engine_version = engine_version

		self._original_total_size = 0
		self._new_total_size      = 0

		# Additional settings.
		self.setting_needs_audio_loader = None

		self._load_project()

	@property
	def is_build_nexus_local(self):
		"""Returns a boolean indicating if this object is nexus_local."""
		return self._engine_version == QUASAR_RENDERING_ENGINE_FOR_NEXUS

	@property
	def is_build_quasar(self):
		"""Returns a boolean indicating if this object is quasar."""
		return self._engine_version == QUASAR_RENDERING_ENGINE_FOR_PUBLIC

	def _load_project(self):
		"""Loads the project structure into memory."""
		self._quasar_rendering_engine = CodeProject('quasar_rendering_engine')

		# CSS
		self.css = ProjectComponent('quasar_rendering_engine_css')
		self.css.add_extension_to_ignore('.min')

		if self._engine_version == QUASAR_RENDERING_ENGINE_FOR_NEXUS:
			self.css.add_file_name_match_to_ignore('quasar_public')
		elif self._engine_version == QUASAR_RENDERING_ENGINE_FOR_PUBLIC:
			self.css.add_file_name_match_to_ignore('quasar_nexus')

		self.css.add_base_code_directory(CodeDirectory('/quasar/source/quasar_libraries_and_scripts/front_end/css'))
		self.css.load_all_content()

		# HTML
		self.html = ProjectComponent('quasar_rendering_engine_html')
		self.html.add_extension_to_ignore('.min')
		self.html.add_base_code_directory(CodeDirectory('/quasar/source/quasar_libraries_and_scripts/front_end/html/quasar_nexus'))
		self.html.load_all_content()

		# Javascript
		self.javascript_manager = jsm.JavascriptManager(self)
		self.js = self.javascript_manager.load_all_content()

		# Assets.
		self.assets = ProjectComponent('quasar_rendering_engine_assets')
		self.assets.add_base_code_directory(CodeDirectory('/quasar/source/quasar_assets/front_end/shaders/'))
		self.assets.load_all_content()

		# Assets
		#self.assets = ProjectComponent('quasar_rendering_engine_assets')
		#self.assets.add_base_code_directory(CodeDirectory('/quasar/source/quasar_assets/front_end'))
		#self.assets.load_all_content()

		# self._quasar_rendering_engine.add_project_component(self.css) etc...

	def build(self):
		"""Builds the project."""
		timer = SimpleTimer()
		timer.start()

		if self._engine_version == QUASAR_RENDERING_ENGINE_BUILD_ASSETS:
			self._build_assets()
		else:
			self._get_assets()
			self._build_css()
			self._build_html()
			self._build_js()

		timer.stop()
		oc.print_green('quasar build finished in ' + str(timer))

	def _build_js(self):
		"""Builds the javascript."""
		oc.print_data_with_red_dashes_at_start('compressing js files')
		timer = SimpleTimer()
		timer.start()
		self.javascript_manager.build_js(self.assets)
		timer.stop()
		oc.print_green('js finished in ' + str(timer))

	def _build_assets(self):
		"""Builds the assets."""
		oc.print_data_with_red_dashes_at_start('building + compressing assets')

	def _get_assets(self):
		"""Gets the assets."""
		oc.print_data_with_red_dashes_at_start('getting assets')
		timer = SimpleTimer()
		timer.start()



		timer.stop()
		oc.print_green('assets finished in ' + str(timer))

	def _build_html(self):
		"""Builds the html."""
		oc.print_data_with_red_dashes_at_start('building + compressing html files')
		timer = SimpleTimer()
		timer.start()

		if self._engine_version == QUASAR_RENDERING_ENGINE_FOR_NEXUS:
			html_prod = self.html.get_file_by_name('nexus_local')
		elif self._engine_version == QUASAR_RENDERING_ENGINE_FOR_PUBLIC:
			html_prod = self.html.get_file_by_name('prod')

		html_prod.generate_minified_file()
		self._original_total_size += html_prod.file_size
		self._new_total_size += html_prod.compressed_size
		oc.print_pink('\t' + html_prod.compression_statistics)
		timer.stop()
		oc.print_green('html finished in ' + str(timer))

	def _build_css(self):
		"""Builds the css."""
		oc.print_data_with_red_dashes_at_start('building + compressing css files')
		timer = SimpleTimer()
		timer.start()

		files = self.css.all_files
		for f in files:

			if 'quasar_engine.css' in f.file_name_with_extension:
				continue

			libraries_needed = f.get_required_import_files()

			if len(libraries_needed) > 0:
				libraries = []
				for lib in libraries_needed:
					libraries.append(self.css.get_file_by_name(lib))
				f.generate_minified_file(libraries)
			else:
				f.generate_minified_file()

			self._original_total_size += f.file_size
			self._new_total_size += f.compressed_size
			oc.print_pink('\t' + f.compression_statistics)

		timer.stop()
		oc.print_green('css finished in ' + str(timer))

'''






def load_all_scripts_project_component():
	"""Loads the all scripts project component."""
	quasar_component_all_scripts = ProjectComponent('all_scripts')
	directory_all_scripts = CodeDirectory(pm.DIRECTORY_QUASAR_SOURCE_BASE + 'all_scripts')
	quasar_component_all_scripts.add_base_code_directory(directory_all_scripts)

	lib_utilities, lib_config_reader_local, lib_config_reader_server = load_library_scripts(directory_all_scripts)
	load_local_scripts(directory_all_scripts, lib_utilities, lib_config_reader_local)

	return quasar_component_all_scripts


def load_all_server_scripts():
	"""Loads all server scripts project component."""
	quasar_component_server_scripts = ProjectComponent('server_scripts')
	server_scripts = load_server_scripts()
	quasar_component_server_scripts.add_base_code_directory(server_scripts)
	return quasar_component_server_scripts












class QuasarGeneration(object):
	"""Utility object for creating all Quasar generatable components."""

	def __init__(self, generatable_scripts_component):
		self._scripts_component = generatable_scripts_component

	def generate(self):
		"""Generates the generatable scripts."""
		oc.print_data('Generating {' + str(self._scripts_component) + '}')

		base_code_directories = self._scripts_component.base_code_directories
		for bcd in base_code_directories:
			if bcd.generatable:
				self._generate_code_directory_recursively(bcd)

	def _generate_code_directory_recursively(self, code_directory):
		"""Generates this code directory, it's contents, and do the same for ALL child directories."""
		oc.print_green('\tgenerating directory{' + str(code_directory) + '}')
		code_directory.create_directory_if_needed()

		# Generate all code files needed.
		all_code_files = code_directory.code_files
		for code_file in all_code_files:
			self._generate_code_file(code_file)

		# Now generate all child code directories.
		all_child_directories = code_directory.child_code_directories
		for child_directory in all_child_directories:
			if child_directory.generatable:
				self._generate_code_directory_recursively(child_directory)

	def _generate_code_file(self, code_file):
		"""Generates the specified code file."""
		oc.print_pink('\t\tgenerating{' + str(code_file) + '}')
		code_file.generate_file_code()
		code_file.create_or_update_file()












	def _print_general_information(self):
		"""Print general information on this project."""
		#self._script_component.print_general_information()
		self._css_component.print_general_information()

	def _generate_scripts(self):
		"""Generates the scripts."""
		for sg in self._script_generators:
			sg.generate()

	def _generate_production(self, run_through_assets=False):
		"""Generates production version of Quasar."""
		self._production_generator.generate(run_through_assets)




def load_quasar_raw_assets_component():
	"""Loads the quasar asset component which contains all the various assets used."""
	component = ProjectComponent('quasar_asset_component')
	directory = CodeDirectory(pm.DIRECTORY_QUASAR_SOURCE_BASE + 'configuration_files/static/assets')
	component.add_base_code_directory(directory)
	component.load_all_content()
	return component


def load_quasar_js_component():
	"""Loads all the quasar client side js component."""
	component = ProjectComponent('client_side_js')
	component.add_extension_to_ignore('.min')
	directory = CodeDirectory(pm.DIRECTORY_QUASAR_SOURCE_BASE + 'quasar_site_django/static/js/custom')
	component.add_base_code_directory(directory)
	component.load_all_content()

	return component

'''


'''

QUASAR_COMPONENT_TAG_GENERATABLE_SCRIPTS = 'generatable_scripts'
QUASAR_COMPONENT_TAG_CLIENT_SIDE         = 'client_side'
QUASAR_COMPONENT_TAG_CSS                 = 'css'
QUASAR_COMPONENT_TAG_HTML                = 'html'
QUASAR_COMPONENT_TAG_JS                  = 'js'
QUASAR_COMPONENT_TAG_ASSETS              = 'asset'


def load_quasar_source_project():
	"""Loads and returns the quasar source project."""
	quasar_source_project = CodeProject('quasar_source')

	# Generatable local scripts.
	all_scripts_project_component = load_all_scripts_project_component()
	all_scripts_project_component.add_tags([QUASAR_COMPONENT_TAG_GENERATABLE_SCRIPTS])

	# Generatable server scripts.
	server_scripts_project_component = load_all_server_scripts()
	server_scripts_project_component.add_tags([QUASAR_COMPONENT_TAG_GENERATABLE_SCRIPTS])

	# Client side : css files.
	component_css = load_quasar_css_component()
	component_css.add_tags([QUASAR_COMPONENT_TAG_CLIENT_SIDE, QUASAR_COMPONENT_TAG_CSS])

	# Client side : html files.
	component_html = load_quasar_html_component()
	component_html.add_tags([QUASAR_COMPONENT_TAG_CLIENT_SIDE, QUASAR_COMPONENT_TAG_HTML])

	# Client side : js files.
	component_js = load_quasar_js_component()
	component_js.add_tags([QUASAR_COMPONENT_TAG_CLIENT_SIDE, QUASAR_COMPONENT_TAG_JS])

	# Client side : asset files.
	component_asset = load_quasar_raw_assets_component()
	component_asset.add_tags([QUASAR_COMPONENT_TAG_CLIENT_SIDE, QUASAR_COMPONENT_TAG_ASSETS])

	# Add the components to the quasar project.
	quasar_source_project.add_project_component(all_scripts_project_component)
	quasar_source_project.add_project_component(server_scripts_project_component)
	quasar_source_project.add_project_component(component_css)
	quasar_source_project.add_project_component(component_html)
	quasar_source_project.add_project_component(component_js)
	quasar_source_project.add_project_component(component_asset)

	return quasar_source_project
'''

args = pa.SystemArguments()
ev = args.get_first_argument()

quasar_engine = QuasarRenderingEngineBuilder(ev)
quasar_engine.build()
