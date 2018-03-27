# coding=utf-8

"""This module, quasar_project.py, represents all of Quasar."""


from code_api.discrete_projects.quasar_source.all_scripts.all_scripts import load_all_scripts_project_component
from code_api.discrete_projects.quasar_source.all_scripts.all_scripts import load_all_server_scripts
from code_api.discrete_projects.quasar_source.quasar_site.quasar_client_side import *
from code_api.project_abstraction.code_project import CodeProject


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

