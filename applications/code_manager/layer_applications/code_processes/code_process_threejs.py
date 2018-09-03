# coding=utf-8

"""This module, build_process_mqtt.py, builds the 3rd party library uTT."""

import requests
from libraries.code_api.code_manager.code_process import CodeProcess
from libraries.universal_code.system_abstraction.shell_command_runner import BashCommandRunner
from libraries.universal_code import output_coloring as oc
from libraries.universal_code import useful_file_operations as ufo
from libraries.code_api.source_file_abstraction.code_files import code_file


class CodeProcessThreeJS(CodeProcess):
	"""Cache checker for Three.JS."""

	def __init__(self, entity, parent_entity, domain):
		super().__init__(entity, parent_entity, domain)
		self.latest_version = None
		print('CREATED A CodeProcessThreeJS!!!!')

	def _run(self):
		print('RUN THE specific CODE PROCESS!!!!!')

		#print(self.parent_entity.version)
		#print(type(self.parent_entity.version))
		#print(self.parent_entity.library_name)

		# TODO: Check if it has been more than one day!

		# TODO: Check if version number is different!

		current_version = self.parent_entity.version
		if current_version is None:
			self._perform_process()
		elif self.parent_entity.version_last_checked is None:
			self._perform_process()
		else:
			self.latest_version = self._get_latest_version()
			if self.failed:
				return
			elif self.latest_version != current_version:
				self._perform_process()


		#if self.parent_entity.version is None or self.parent_entity.version_last_checked is None:
		#	self._perform_process()

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
		print('PERFORMNING PROCESS!')

		r = self.run_bash_step('ls', cwd='/quasar/generated_output/third_party_libraries/three_js')
		if not r or len(r) == 0:
			if len(r) == 0:
				self.fail('Three.js directory does not exist!')
			return

		if self.latest_version is None:
			self.latest_version = self._get_latest_version()
			if self.failed:
				return

		#'/quasar/generated_output/third_party_libraries/three_js/three.js'
		#'/quasar/generated_output/third_party_libraries/three_js/three_js'

		r = self.run_bash_step('git checkout tags/' + self.latest_version, cwd='/quasar/generated_output/third_party_libraries/three_js/three.js')
		print(r)
		print('CHECKED-OUT?')
		print(not r)
		print(type(r) == str)

		if not r and not type(r) == str:
			self.fail('error performing "git checkout tags/<release_version_here>"')
			return

		ufo.copy_file_to_path(
			destination='/quasar/libraries/front_end/js/third_party/three_js/three.min.js',
			source_file='/quasar/generated_output/third_party_libraries/three_js/three.js/build/three.min.js'
		)

		print('CHECKOUTED TO TAG')
		print(r)

		self.domain.cache_file(
			code_file.CODE_FILE_TYPE_JS_FILE,
			'CALCULATE',
			'/quasar/libraries/front_end/js/third_party/three_js/three.min.js',
			'CALCULATE',
			False,
			True,
			False,
			None,
			None, # Will get automatically set.
			None,
			child_path='/quasar/libraries/front_end/js/third_party/three_js/three.min.js.gz'
		)

		'''
		r = self.run_bash_step('ls', cwd='/quasar/generated_output/third_party_libraries/three_js')
		if not r:
			print('ERROR!')
			y = 2
			# TODO: Set error and return!

		print('OUTPUT:')
		print(r)
		'''

		# TODO: Cache that file!!


