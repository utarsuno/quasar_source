# coding=utf-8

"""This module, build_nexus_local.py, builds NexusLocal."""

from applications.code_manager.layer_domain.entities import entities_db
from applications.code_manager.layer_applications.build_processes.three_js_library import BuildProcessThreeJSLibrary
from applications.code_manager.layer_applications.build_processes.three_js_combined_library import BuildProcessThreeJSCombinedLibrary
from applications.code_manager.layer_applications.build_processes.css import BuildProcessCSS
from applications.code_manager.layer_applications.build_processes.html import BuildProcessHTML
from applications.code_manager.layer_applications.build_processes.volume_assets import BuildProcessVolumeAssets
from applications.code_manager.layer_applications.build_processes.js_independent_libraries import BuildProcessJSIndependentLibraries
from applications.code_manager.layer_applications.build_processes.nexus_local_js import BuildProcessJSNexusLocal
from applications.code_manager.layer_applications.build_processes.nexus_courier import BuildProcessNexusCourier
from applications.code_manager.layer_applications.build_processes.shaders import BuildProcessShaders
from applications.code_manager.layer_domain.domains import db_domain
from libraries.universal_code.system_abstraction.system_functions import get_system_environment as get_env
from libraries.universal_code import output_coloring as oc
from libraries.universal_code.time_abstraction.simple_timer import SimpleTimer


LIBRARY_THREE_JS          = 'threejs'


class NexusLocalBuildProcess(object):
	"""Represents the Nexus Local full build process."""

	def __init__(self):
		self.name = 'NexusLocal'
		self.db_domain = db_domain.DBDomain({
			db_domain.DOMAIN_FLAG_BUILD_TYPE : get_env('CODE_BUILDER_BUILD_TYPE'),
			db_domain.DOMAIN_FLAG_ENVIRONMENT: get_env('CODE_BUILDER_ENVIRONMENT'),
			db_domain.DOMAIN_FLAG_PATH_DB    : get_env('CODE_BUILDER_PATH_DB'),
			db_domain.DOMAIN_FLAG_PATH_VOLUME: get_env('CODE_BUILDER_PATH_VOLUME'),
			db_domain.DOMAIN_FLAG_PATH_OUTPUT: get_env('CODE_BUILDER_PATH_OUTPUT'),
			db_domain.DOMAIN_FLAG_DEBUG      : get_env('CODE_BUILDER_DB_DEBUG')
		})

		self.db_domain.add_library(entities_db.util_get_library_data(
			LIBRARY_THREE_JS,
			None,
			'/quasar/generated_output/third_party_libraries/three_js/',
			True,
			'https://github.com/mrdoob/three.js',
			None
		))

		self._all_build_steps = [
			[BuildProcessThreeJSLibrary],
			[BuildProcessThreeJSCombinedLibrary],
			[BuildProcessShaders],
			[BuildProcessCSS],
			[BuildProcessHTML],
			[BuildProcessVolumeAssets],
			[BuildProcessJSIndependentLibraries],
			[BuildProcessJSNexusLocal],
			[BuildProcessNexusCourier, db_domain.DOMAIN_BUILD_FE],
		]

		self.build_steps = []
		self.logs        = {}

	def run_setup(self):
		"""Runs the needed setup."""
		for bs in self._all_build_steps:
			if self.db_domain.is_build_type_front_end() and db_domain.DOMAIN_BUILD_FE not in bs:
				self.build_steps.append(bs[0](self.db_domain))
			elif self.db_domain.is_build_type_all() and db_domain.DOMAIN_BUILD_ALL not in bs:
				self.build_steps.append(bs[0](self.db_domain))

	def run_build_process(self):
		"""Runs this build process."""
		self.build_time = SimpleTimer(auto_start=True)
		oc.print_ascii_yellow('building ' + self.name)

		self.db_domain.load()
		self.run_setup()

		all_build_steps_passed = True

		for bs in self.build_steps:
			bs.run()
			if bs.failed:
				all_build_steps_passed = False
				if bs.output is not None:
					oc.print_error('build step failed! {' + bs.output + '}')
				else:
					oc.print_error('build step failed! {}')
				break
			else:
				if bs.output is not None:
					oc.print_data_with_red_dashes_at_start(bs.output)

		oc.print_data_with_red_dashes_at_start('all_build_steps_passed {' + str(all_build_steps_passed) + '}')
		self.build_completed(not all_build_steps_passed)

	def build_completed(self, fail=False):
		"""If build completed without errors then set the needed exit code."""
		self.build_time.stop()
		if fail:
			oc.print_error('Building {' + self.name + '} failed in {' + str(self.build_time) + '}')
			exit(db_domain.DOMAIN_EXIT_CODE_FAIL)
		else:
			oc.print_pink('Building {' + self.name + '} finished in {' + str(self.build_time) + '}')
			exit(self.db_domain.get_exit_code_needed())


nexus_local_builder = NexusLocalBuildProcess()
nexus_local_builder.run_build_process()

