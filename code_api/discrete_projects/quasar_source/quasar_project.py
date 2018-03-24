# coding=utf-8

"""This module, quasar_project.py, represents all of Quasar."""


from code_api.discrete_projects.quasar_source.all_scripts.all_scripts import load_all_scripts_project_component
from code_api.discrete_projects.quasar_source.all_scripts.library_scripts import load_library_scripts
from code_api.discrete_projects.quasar_source.all_scripts.local_scripts import load_local_scripts
from code_api.discrete_projects.quasar_source.all_scripts.server_scripts import load_server_scripts
from code_api.discrete_projects.quasar_source.quasar_site.quasar_client_side import *
from code_api.project_abstraction.code_project import CodeProject


QUASAR_COMPONENT_TAG_CLIENT_SIDE = 'client_side'
QUASAR_COMPONENT_TAG_CSS = 'css'
QUASAR_COMPONENT_TAG_HTML = 'html'
QUASAR_COMPONENT_TAG_JS = 'js'


def load_quasar_source_project():
	"""Loads and returns the quasar source project."""
	quasar_source_project = CodeProject('quasar_source')

	all_scripts_project_component, all_scripts_directory = load_all_scripts_project_component()
	lib_utilities, lib_config_reader_local, lib_config_reader_server = load_library_scripts(all_scripts_directory)
	load_local_scripts(all_scripts_directory, lib_utilities, lib_config_reader_local)
	load_server_scripts(all_scripts_directory, lib_utilities, lib_config_reader_server)

	quasar_source_project.add_project_component(all_scripts_project_component)

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


	quasar_source_project.add_project_component(component_css)
	quasar_source_project.add_project_component(component_html)
	quasar_source_project.add_project_component(component_js)

	return quasar_source_project

