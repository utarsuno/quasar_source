# coding=utf-8

"""This module, quasar_client_side_javascript.py, is an abstraction to all the client side javascript files for Quasar."""

from code_api.project_abstraction.project_component import ProjectComponent
from code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from universal_code import path_manager as pm

'''
from code_api.project_abstraction.project_component import ProjectComponent
from code_api.source_file_abstraction.code_files.shell_file import *
from universal_code import path_manager as pm



from code_api.discrete_projects.quasar_source.all_scripts.all_scripts import load_all_scripts_project_component
from code_api.discrete_projects.quasar_source.all_scripts.library_scripts import load_library_scripts
from code_api.discrete_projects.quasar_source.all_scripts.local_scripts import load_local_scripts
from code_api.discrete_projects.quasar_source.all_scripts.server_scripts import load_server_scripts
from code_api.project_abstraction.code_project import CodeProject



def load_all_scripts_project_component():
	"""Loads the all scripts project component."""
	quasar_component_all_scripts = ProjectComponent('all_scripts')

	directory_all_scripts = CodeDirectory(pm.DIRECTORY_QUASAR_SOURCE_BASE + 'all_scripts')

	quasar_component_all_scripts.add_base_code_directory(directory_all_scripts)

	return quasar_component_all_scripts, directory_all_scripts



'''



def load_quasar_client_side():
	"""Loads all the quasar client side code."""

	quasar_client_side = ProjectComponent('quasar_client_side')



	y = 2



def load_quasar_js_component():
	"""Loads all the quasar client side js component."""
	component = ProjectComponent('client_side_js')
	component.add_extension_to_ignore('.min')
	directory = CodeDirectory(pm.DIRECTORY_QUASAR_SOURCE_BASE + 'quasar_site_django/static/js/custom')
	component.add_base_code_directory(directory)
	component.load_all_content()

	return component

def load_quasar_css_component():
	"""Loads all the quasar css component."""
	component = ProjectComponent('client_side_css')
	component.add_extension_to_ignore('.min')
	directory = CodeDirectory(pm.DIRECTORY_QUASAR_SOURCE_BASE + 'quasar_site_django/static/css')
	component.add_base_code_directory(directory)
	component.load_all_content()

	return component


# This portion will involve a fair amount of custom logic.
def load_quasar_html_component():
	"""Loads the html component."""
	component = ProjectComponent('client_side_html')
	component.add_extension_to_ignore('.min')
	directory = CodeDirectory(pm.DIRECTORY_QUASAR_SOURCE_BASE + 'quasar_site_django/templates/quasar_web_server')
	component.add_base_code_directory(directory)
	component.load_all_content()

	return component
