# coding=utf-8

"""This module, db_entities_base.py, provides base abstractions for DB entities (tables + logic)."""

from applications.code_manager.layer_domain.domains import db_domain
from applications.code_manager.layer_domain.entities import entities_db
from applications.code_manager.layer_applications.code_processes import code_process_threejs
from applications.code_manager.layer_applications.code_processes import code_process_html
from applications.code_manager.layer_applications.code_processes import code_process_css
from applications.code_manager.layer_applications.code_processes import code_process_js
from applications.code_manager.layer_applications.code_processes import code_process_js_libs
from applications.code_manager.layer_applications.code_processes import code_process_nexus_courier


PROJECT_NEXUS_LOCAL    = 'nexus_local'

APPLICATION_NGINX      = 'nginx'
CODE_PROCESS_HTML      = 'nginx_html'
CODE_PROCESS_CSS       = 'nginx_css'
CODE_PROCESS_JS        = 'nginx_js'
CODE_PROCESS_JS_LIBS   = 'nginx_js_libs'

APPLICATION_NEXUS_COURIER  = 'nexus_courier'
CODE_PROCESS_NEXUS_COURIER = 'nexus_courier'

APPLICATION_MQTT       = 'mqtt'
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
		self._nexus_courier()

	def _nexus_courier(self):
		"""Utility function."""
		self.app_nexus_courier = self.add_application(APPLICATION_NEXUS_COURIER, PROJECT_NEXUS_LOCAL)

		self.code_process_nexus_courier = self.add_code_process(CODE_PROCESS_NEXUS_COURIER, 'CodeProcessNexusCourier', self.app_nexus_courier)
		self.code_process_nexus_courier.set_process(code_process_nexus_courier.CodeProcessNexusCourier)

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

		self.code_process_html = self.add_code_process(CODE_PROCESS_HTML, 'CodeProcessHTML', self.app_nginx)
		self.code_process_html.set_process(code_process_html.CodeProcessHTML)

		self.code_process_css = self.add_code_process(CODE_PROCESS_CSS, 'CodeProcessCSS', self.app_nginx)
		self.code_process_css.set_process(code_process_css.CodeProcessCSS)

		self.code_process_js = self.add_code_process(CODE_PROCESS_JS, 'CodeProcessJS', self.app_nginx)
		self.code_process_js.set_process(code_process_js.CodeProcessJS)

		self.code_process_js_libs = self.add_code_process(CODE_PROCESS_JS_LIBS, 'CodeProcessJSLibs', self.app_nginx)
		self.code_process_js_libs.set_process(code_process_js_libs.CodeProcessJSLibs)

	def _threejs(self):
		"""Utility function."""
		self.lib_threejs = self.add_library(entities_db.util_get_library_data(
			LIBRARY_THREE_JS, None,
			'/quasar/generated_output/third_party_libraries/three_js/',
			True, 'https://github.com/mrdoob/three.js', None
		), APPLICATION_NGINX)

		self.code_process_threejs = self.add_code_process('Three.js', 'CodeProcessThreeJS', self.lib_threejs)
		self.code_process_threejs.set_process(code_process_threejs.CodeProcessThreeJS)



