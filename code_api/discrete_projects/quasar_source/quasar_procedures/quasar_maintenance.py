# coding=utf-8

"""This module, project_maintenance.py, provides an abstraction to the maintenance and generation of code projects."""


from code_api.discrete_projects.quasar_source.quasar_project import *
from universal_code import output_coloring as oc
import time


from code_api.discrete_projects.quasar_source.quasar_procedures.quasar_generation import QuasarGeneration
from code_api.discrete_projects.quasar_source.quasar_procedures.quasar_production import QuasarProduction


class CodeProjectMaintainer(object):
	"""Provides an abstraction to code project maintenance."""

	def __init__(self, code_project):
		self._code_project = code_project
		self._procedures = []

		self._procedures.append([0, 'print generation information', self._print_general_information, None, None])
		self._procedures.append([1, 'generate scripts', self._generate_scripts, None, None])
		self._procedures.append([2, 'generate production environment', self._generate_production, None, None])
		#self._procedures.append([0, 'print generation information', self._print_general_information])

		# Procedure : script generator.
		self._script_component = self._code_project.get_component_with_tags([QUASAR_COMPONENT_TAG_GENERATABLE_SCRIPTS])
		self._script_generator = QuasarGeneration(self._script_component)

		# Procedure : production generator.
		self._css_component = self._code_project.get_component_with_tags([QUASAR_COMPONENT_TAG_CSS])
		self._js_component = self._code_project.get_component_with_tags([QUASAR_COMPONENT_TAG_JS])
		self._html_component = self._code_project.get_component_with_tags([QUASAR_COMPONENT_TAG_HTML])
		self._asset_component = self._code_project.get_component_with_tags([QUASAR_COMPONENT_TAG_ASSETS])
		self._production_generator = QuasarProduction(self._css_component, self._html_component, self._js_component, self._asset_component)

	def _run_procedure(self, procedure_to_run):
		"""Runs the specified procedure."""
		procedure_to_run[3] = time.time()
		procedure_to_run[2]()
		procedure_to_run[4] = time.time() - procedure_to_run[3]
		oc.print_title('Procedure completed in{' + str(procedure_to_run[4]) + ' seconds}')

	def prompt_user_for_procedure(self):
		"""Prompt the user for the procedure to run."""
		oc.print_title('Select an action to take :')
		for p in self._procedures:
			oc.print_data_with_red_dashes_at_start(str(p[0]) + ' : ' + p[1])

		procedure = None
		user_input = input()
		try:
			user_input = int(user_input)
			for p in self._procedures:
				if user_input == p[0]:
					procedure = p
		except ValueError:
			procedure = None

		if procedure is not None:
			self._run_procedure(procedure)
		else:
			oc.print_error('The provided input{' + str(user_input) + '} is not a valid procedure!')

	'''__   __   __   __   ___  __        __   ___  __
	  |__) |__) /  \ /  ` |__  |  \ |  | |__) |__  /__`
	  |    |  \ \__/ \__, |___ |__/ \__/ |  \ |___ .__/ '''

	def _print_general_information(self):
		"""Print general information on this project."""
		self._script_component.print_general_information()
		self._css_component.print_general_information()

	def _generate_scripts(self):
		"""Generates the scripts."""
		self._script_generator.generate()

	def _generate_production(self):
		"""Generates production version of Quasar."""
		self._production_generator.generate()


quasar_project_maintainer = CodeProjectMaintainer(load_quasar_source_project())
#quasar_project_maintainer.prompt_user_for_procedure()

# TEMPORARY
quasar_project_maintainer._run_procedure(quasar_project_maintainer._procedures[2])
#quasar_project_maintainer._generate_production_version_of_quasar()



