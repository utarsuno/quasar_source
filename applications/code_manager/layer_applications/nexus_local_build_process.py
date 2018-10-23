# coding=utf-8

"""This module, build_nexus_local.py, builds NexusLocal."""

from libraries.universal_code.system_abstraction.system_functions import get_system_environment as get_env
from libraries.code_api.code_manager.build_process.build_process import BuildProcess
from applications.code_manager.layer_domain.domains import db_domain
from applications.code_manager.layer_domain.entities import entities_db
from applications.code_manager.layer_applications.build_processes.three_js_library import BuildProcessThreeJSLibrary
from applications.code_manager.layer_applications.build_processes.three_js_combined_library import BuildProcessThreeJSCombinedLibrary
from applications.code_manager.layer_applications.build_processes.css import BuildProcessCSS
from applications.code_manager.layer_applications.build_processes.html import BuildProcessHTML
from applications.code_manager.layer_applications.build_processes.volume_assets import BuildProcessVolumeAssets
from applications.code_manager.layer_applications.build_processes.js_independent_libraries import BuildProcessJSIndependentLibraries
from applications.code_manager.layer_applications.build_processes.nexus_local_js import BuildProcessJSNexusLocal
from applications.code_manager.layer_applications.build_processes.nexus_courier import BuildProcessNexusCourier

LIBRARY_THREE_JS = 'threejs'

# Booleans dictate if they are enabled or not.
ALL_BUILD_STEPS = {
	'three_js_library': True,
	'css'             : True,
	'html'            : True,
	'js libraries'    : True,
	'js engine'       : True,
	'nexus courier'   : True,
}

ENV_FE   = 'front_end_only'
ENV_PROD = 'production'

ARG_DB_PATH               = 'CODE_BUILDER_DB_PATH'
ARG_GENERATED_OUTPUT_PATH = 'CODE_BUILDER_DEFAULT_GENERATED_CONTENT_DIRECTORY'
ARG_VOLUME_PATH           = 'CODE_BUILDER_VOLUME_PATH'
ARG_DEBUG_ON              = 'CODE_BUILDER_DB_DEBUG'
ARG_BUILD_TYPE            = 'CODE_BUILDER_BUILD_TYPE'



class NexusLocalBuildProcess(BuildProcess):
	"""Represents the Nexus Local full build process."""

	def __init__(self):
		super().__init__(
			'NexusLocal',
			db_domain.DBDomain(get_env(ARG_DB_PATH),
			                   get_env(ARG_GENERATED_OUTPUT_PATH),
			                   get_env(ARG_VOLUME_PATH),
			                   get_env(ARG_DEBUG_ON),
			                   get_env(ARG_BUILD_TYPE))
		)

		self.db_domain.add_library(entities_db.util_get_library_data(
			LIBRARY_THREE_JS,
			None,
			'/quasar/generated_output/third_party_libraries/three_js/',
			True,
			'https://github.com/mrdoob/three.js',
			None
		))


		self._all_build_steps = [
			[self._add_step_lib_three_js , ENV_FE, ENV_PROD],
			[self._add_step_css          , ENV_FE, ENV_PROD],
			[self._add_step_html         , ENV_FE, ENV_PROD],
			[self._add_step_volume       , ENV_FE, ENV_PROD],
			[self._add_step_js_libraries , ENV_FE, ENV_PROD],
			[self._add_step_js_engine    , ENV_FE, ENV_PROD],
			[self._add_step_nexus_courier, ENV_PROD]
		]

	def _add_step_lib_three_js(self):
		library = self.db_domain.get_library_by_name(LIBRARY_THREE_JS)
		self.add_step(BuildProcessThreeJSLibrary(self.db_domain, library))
		self.add_step(BuildProcessThreeJSCombinedLibrary(self.db_domain))

	def _add_step_css(self):
		self.add_step(BuildProcessCSS(self.db_domain))

	def _add_step_html(self):
		self.add_step(BuildProcessHTML(self.db_domain))

	def _add_step_volume(self):
		self.add_step(BuildProcessVolumeAssets(self.db_domain))

	def _add_step_js_libraries(self):
		self.add_step(BuildProcessJSIndependentLibraries(self.db_domain))

	def _add_step_js_engine(self):
		self.add_step(BuildProcessJSNexusLocal(self.db_domain))

	def _add_step_nexus_courier(self):
		self.add_step(BuildProcessNexusCourier(self.db_domain))

	def run_setup(self):
		"""Runs the needed setup."""
		for bs in self._all_build_steps:
			if self.build_type in bs:
				bs[0]()

	def build_completed_successfully(self):
		"""If build completed without errors then set the needed exit code."""
		if not self.db_domain.flag_does_exist('NEXUS_COURIER_UPDATED'):
			exit(200)
		elif self.db_domain.flag_get('NEXUS_COURIER_UPDATED'):
			exit(200)
		exit(0)

nexus_local_builder = NexusLocalBuildProcess()
nexus_local_builder.run_build_process()

