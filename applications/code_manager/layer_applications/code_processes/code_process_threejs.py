# coding=utf-8

"""This module, build_process_mqtt.py, builds the 3rd party library uTT."""

import requests
from libraries.code_api.code_manager.code_process_third_party_library import CodeProcessThirdPartyLibrary
from libraries.universal_code import output_coloring as oc
from libraries.universal_code import useful_file_operations as ufo
from libraries.code_api.source_file_abstraction.code_files import code_file


class CodeProcessThreeJS(CodeProcessThirdPartyLibrary):
	"""Cache checker for Three.JS."""

	def __init__(self, entity, parent_entity, domain):
		super().__init__(entity, parent_entity, domain)
		#print('CREATED A CodeProcessThreeJS!!!!')

	def _run(self):
		oc.print_green('CodeProcessThreeJS _run')

		if self.library_needs_version_update():
			oc.print_pink('Running ThreeJS version update.')
			self._perform_process()
			self.update_library_version()
		else:
			oc.print_green('ThreeJS is up to date!')

	def _get_latest_version(self):
		"""Gets the latest version of the Three.js project."""
		result = requests.get('https://api.github.com/repos/mrdoob/three.js/releases/latest')
		if result.status_code == 200:
			r = result.content.decode('utf-8')
			t = eval(r.replace('false', 'False').replace('true', 'True'))
			return t['tag_name']
		else:
			self.fail('HTTP error code {' + str(result.status_code) + '}')

	def _perform_process(self):
		"""Process is not cached so run it."""
		#print('PERFORMNING PROCESS!')

		r = self.run_bash_step('ls', cwd='/quasar/generated_output/third_party_libraries/three_js')
		if not r or len(r) == 0:
			if len(r) == 0:
				self.fail('Three.js directory does not exist!')
			return

		if self.latest_version is None:
			self.latest_version = self._get_latest_version()
			if self.failed:
				return

		r = self.run_bash_step('git checkout tags/' + self.latest_version, cwd='/quasar/generated_output/third_party_libraries/three_js/three.js')
		#print(r)
		#print('CHECKED-OUT?')
		#print(not r)
		#print(type(r) == str)

		if not r and not type(r) == str:
			self.fail('error performing "git checkout tags/' + str(self.latest_version) + '"')
			return

		ufo.copy_file_to_path(
			destination='/quasar/libraries/front_end/js/third_party/three_js/three.min.js',
			source_file='/quasar/generated_output/third_party_libraries/three_js/three.js/build/three.min.js'
		)

		#print('CHECKOUTED TO TAG')
		#print(r)

		file_path = '/quasar/libraries/front_end/js/third_party/three_js/three.min.js'

		cached_or_updated, file = self.domain.cache_single_file(
			code_file.CODE_FILE_TYPE_JS_FILE,
			'CALCULATE',
			file_path,
			'CALCULATE',
			False,
			True,
			False,
		)

		if cached_or_updated or file.child_f_id is None:

			generated_file_path = '/quasar/libraries/front_end/js/third_party/three_js/three.min.js.gz'
			ufo.file_op_create_gzip(file_path, generated_file_path)

			child_cached_or_updated, child_file = self.domain.cache_single_file(
				code_file.CODE_FILE_TYPE_JS_FILE,
				'CALCULATE',
				generated_file_path,
				'CALCULATE',
				False, False, False
			)

			if file.child_f_id is None:
				file.set_child_file(child_file)
				child_file.set_parent_file(file)




