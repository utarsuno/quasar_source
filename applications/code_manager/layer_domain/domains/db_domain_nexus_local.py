# coding=utf-8

"""This module, db_entities_base.py, provides base abstractions for DB entities (tables + logic)."""

from applications.code_manager.layer_domain.domains import db_domain
#from applications.code_manager.layer_domain.db_entities import db_entities_nexus_local as entities_nexus
#from applications.code_manager.layer_domain.db_entities import db_entities as entities
from applications.code_manager.layer_applications.build_processes import build_process_threejs


CODE_PROJECT_NEXUS_LOCAL = 'nexus_local'
APPLICATION_MQTT         = 'mqtt'
APPLICATION_NGINX        = 'nginx'
LIBRARY_MQTT             = 'mqtt'
LIBRARY_THREE_JS         = 'threejs'


class DBDomainNexusLocal(db_domain.DBDomain):
	"""Represents a DB connection to code_manager for the NexusLocal project."""

	def __init__(self, db_location, debug_on=False):
		super().__init__(db_location, debug_on)

		self.nexus_local          = self.add_project(CODE_PROJECT_NEXUS_LOCAL)

		self.app_mqtt             = self.add_application(APPLICATION_MQTT, CODE_PROJECT_NEXUS_LOCAL)
		self.app_nginx            = self.add_application(APPLICATION_NGINX, CODE_PROJECT_NEXUS_LOCAL)

		self.lib_mqtt             = self.add_library(LIBRARY_MQTT, APPLICATION_MQTT)
		self.lib_threejs          = self.add_library(LIBRARY_THREE_JS, APPLICATION_NGINX)

		_lib_third_party_mqtt = {
			'name'           : LIBRARY_MQTT,
			'git_repo_url'   : 'https://github.com/uNetworking/uTT',
			'path_to_library': '/quasar/generated_output/third_party_libraries/utt/uTT',
			'last_checked'   : 'NULL',
			'cached_version' : 'NULL'
		}
		self.lib_third_party_mqtt = self.add_library_third_party(_lib_third_party_mqtt, LIBRARY_MQTT)

		_lib_third_party_threejs = {
			'name'           : LIBRARY_THREE_JS,
			'git_repo_url'   : 'https://github.com/mrdoob/three.js',
			'path_to_library': '/quasar/generated_output/third_party_libraries/three_js',
			'last_checked'   : 'NULL',
			'cached_version' : 'NULL'
		}
		self.lib_third_party_threejs = self.add_library_third_party(_lib_third_party_threejs, LIBRARY_THREE_JS)
		self.lib_third_party_threejs.set_cache_checker(build_process_threejs.BuildProcessThreeJS())

	def run_needed_build_processes(self):
		"""Runs all build processes that are not cached or need to be updated."""
		print('RUN NEEDED BUILD PROCESSES!!!')




