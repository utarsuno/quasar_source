# coding=utf-8

"""This module, build_nexus_local.py, builds NexusLocal."""

from libraries.universal_code.system_abstraction.system_functions import get_system_environment as get_env

'''
print('HELLO WORLD, NEXUS_LOCAL BUILDER!')

db = DBDomainNexusLocal(get_env('CODE_BUILDER_DB_PATH'), get_env('DB_DEBUG'))
db.load()
db.run_needed_code_processes()

return_flags = db.get_flags()

#print('PRINTING THE BUILD FLAGS')
#print(return_flags)


BUILD_FLAG_NEXUS_COURIER_UPDATED = 'NEXUS_COURIER_UPDATE'

if return_flags[BUILD_FLAG_NEXUS_COURIER_UPDATED]:
	#TODO: TEMPORARILY REMOVING THIS!
	#exit(200)
	exit(0)
else:
	exit(0)
'''

from libraries.code_api.code_manager.build_process.build_process import BuildProcess
from applications.code_manager.layer_domain.domains import db_domain
from applications.code_manager.layer_domain.entities import entities_db
from applications.code_manager.layer_applications.build_processes.three_js_library import BuildProcessThreeJSLibrary
from applications.code_manager.layer_applications.build_processes.three_js_combined_library import BuildProcessThreeJSCombinedLibrary
from applications.code_manager.layer_applications.build_processes.css import BuildProcessCSS
from applications.code_manager.layer_applications.build_processes.html import BuildProcessHTML
from applications.code_manager.layer_applications.build_processes.volume_assets import BuildProcessVolumeAssets
from applications.code_manager.layer_applications.build_processes.js_independent_libraries import BuildProcessJSIndependentLibraries

LIBRARY_THREE_JS = 'threejs'


class NexusLocalBuildProcess(BuildProcess):
	"""Represents the Nexus Local full build process."""

	def __init__(self):
		super().__init__('NexusLocal', db_domain.DBDomain(get_env('CODE_BUILDER_DB_PATH'), get_env('DB_DEBUG')))

		self.db_domain.add_library(entities_db.util_get_library_data(
			LIBRARY_THREE_JS,
			None,
			'/quasar/generated_output/third_party_libraries/three_js/',
			True,
			'https://github.com/mrdoob/three.js',
			None
		))

	def run_setup(self):
		"""Runs the needed setup."""
		# TEMP: to speed up development of the other steps

		# JS-Combined step depends on JS library step.
		#library = self.db_domain.get_library_by_name(LIBRARY_THREE_JS)
		#self.add_step(BuildProcessThreeJSLibrary(self.db_domain, library))
		#self.add_step(BuildProcessThreeJSCombinedLibrary(self.db_domain))

		# HTML step depends on CSS step.
		#self.add_step(BuildProcessCSS(self.db_domain))
		#self.add_step(BuildProcessHTML(self.db_domain))

		# Volume asset steps.
		self.add_step(BuildProcessVolumeAssets(self.db_domain))

		# Independent JS libraries.
		self.add_step(BuildProcessJSIndependentLibraries(self.db_domain))



nexus_local_builder = NexusLocalBuildProcess()
nexus_local_builder.run_build_process()

