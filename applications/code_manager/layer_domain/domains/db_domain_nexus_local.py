# coding=utf-8

"""This module, db_entities_base.py, provides base abstractions for DB entities (tables + logic)."""

from applications.code_manager.layer_domain.domains import db_domain
from applications.code_manager.layer_domain.entities import entities_db
from applications.code_manager.layer_applications.code_processes import code_process_threejs


PROJECT_NEXUS_LOCAL    = 'nexus_local'

APPLICATION_MQTT       = 'mqtt'
APPLICATION_NGINX      = 'nginx'

LIBRARY_MQTT           = 'mqtt'
LIBRARY_THREE_JS       = 'threejs'

CODE_PROCESS_THREE_JS  = 'threejs'


class DBDomainNexusLocal(db_domain.DBDomain):
	"""Represents a DB connection to code_manager for the NexusLocal project."""

	def __init__(self, db_location, debug_on=False):
		super().__init__(db_location, debug_on)

		# Code project (loads needed applications which load their needed libraries).
		self._nexus_local()

	def _nexus_local(self):
		"""Utility function."""
		self.nexus_local = self.add_project(PROJECT_NEXUS_LOCAL)
		self._mqtt()
		self._nginx()

	def _mqtt(self):
		"""Utility function."""
		self.app_mqtt = self.add_application(APPLICATION_MQTT, PROJECT_NEXUS_LOCAL)
		self.lib_mqtt = self.add_library(entities_db.util_get_library_data(
			LIBRARY_MQTT, None,
			'/quasar/generated_output/third_party_libraries/utt/',
			True, 'https://github.com/uNetworking/uTT', None
		), APPLICATION_MQTT)

	def _nginx(self):
		"""Utility function."""
		self.app_nginx = self.add_application(APPLICATION_NGINX, PROJECT_NEXUS_LOCAL)
		self._threejs()

	def _threejs(self):
		"""Utility function."""
		self.lib_threejs = self.add_library(entities_db.util_get_library_data(
			LIBRARY_THREE_JS, None,
			'/quasar/generated_output/third_party_libraries/three_js/',
			True, 'https://github.com/mrdoob/three.js', None
		), APPLICATION_NGINX)

		self.code_process_threejs = self.add_code_process('Three.js', 'CodeProcessThreeJS', self.lib_threejs)
		self.code_process_threejs.set_process(code_process_threejs.CodeProcessThreeJS)



