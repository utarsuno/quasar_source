# coding=utf-8

"""This module, three_js_library.py, contains the build processes for building ThreeJS (if needed)."""

import requests

from libraries.code_api.code_manager.build_step import BuildProcessStep
from libraries.code_api.source_file_abstraction.code_files import code_file
from libraries.universal_code import output_coloring as oc
from libraries.universal_code import useful_file_operations as ufo

DOMAIN_FLAG_THREE_JS_LIBRARY_UPDATED = 'three_js_library_updated'


class BuildProcessThreeJSLibrary(BuildProcessStep):
	"""Represents the build process steps for updating the ThreeJS library."""

	#def __init__(self, domain, library_entity):
	def __init__(self, domain):
		super().__init__(domain, None)

		self.latest_version = None

		#
		library_entity = domain.get_library_by_name('threejs')
		#

		#TEMP
		self.library_entity = library_entity

		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x0))
		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x1))
		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x2))

	# ------------------------------------------------------------------------------------------------

	def step_0x0(self):
		"""The first step."""
		if self.library_entity.needs_version_update_check():
			#self.finish()
			return
		else:
			# Check if the latest version is newer.
			self.latest_version = self._get_latest_version()
			if not self.failed:
				if self.latest_version != self.library_entity.version:
					oc.print_data_with_red_dashes_at_start('TODO: LOG/INFORM THAT THRREE JS HAS UPDATED!')
					#oc.print_error('LOG/INFORM THAT THREE JS HAS UPDATED!!!')
					#self.finish()
					return
				else:
					self.domain.flag_set(DOMAIN_FLAG_THREE_JS_LIBRARY_UPDATED, False)
					self.finish_early('ThreeJS is the latest version.')

	def _get_latest_version(self):
		"""Gets the latest version of the Three.js project."""
		result = requests.get('https://api.github.com/repos/mrdoob/three.js/releases/latest')
		if result.status_code == 200:
			r = result.content.decode('utf-8')
			t = eval(r.replace('false', 'False').replace('true', 'True'))
			return t['tag_name']
		else:
			self.fail('HTTP error code {' + str(result.status_code) + '}')

	# ------------------------------------------------------------------------------------------------

	def step_0x1(self):
		"""The second step."""
		r = self.run_bash_step('ls', cwd='/quasar_source/generated_output/third_party_libraries/three_js')
		if self.failed:
			return
		#if not r or len(r) == 0:
		#	if len(r) == 0:
		#		self.fail('Three.js directory does not exist!')
		#	else:
		#		self.fail('Error running bach command for step 0x1 on THREEJS build process step.')
		#	return

		if self.latest_version is None:
			self.latest_version = self._get_latest_version()
			if self.failed:
				return

		path_to_library_repo = '/quasar_source/generated_output/third_party_libraries/three_js/three.js'

		# Update git data.
		r = self.run_bash_step('git fetch', cwd=path_to_library_repo)
		if self.failed:
			return

		r = self.run_bash_step('git checkout tags/' + self.latest_version, cwd=path_to_library_repo)
		#if not r and not type(r) == str:
		#	self.fail('error performing "git checkout tags/' + str(self.latest_version) + '"')
		#	return
		if self.failed:
			return

		file_path = '/quasar_source/libraries/front_end/js/third_party/three_js/three.min.js'

		ufo.file_op_copy(
			path_source      = '/quasar_source/generated_output/third_party_libraries/three_js/three.js/build/three.min.js',
			path_destination = file_path
		)

		cached_or_updated, file = self.domain.cache_single_file(
			code_file.FILE_TYPE_JS,
			None,
			file_path,
			'CALCULATE'
		)

	# ------------------------------------------------------------------------------------------------

	def step_0x2(self):
		"""The third step."""
		self.library_entity.update_version(self.latest_version)
		self.domain.flag_set(DOMAIN_FLAG_THREE_JS_LIBRARY_UPDATED, True)
		self.finish_early('ThreeJS was updated.')
