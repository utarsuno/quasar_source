# coding=utf-8

"""This module, nexus_courier.py, contains the build processes for NexusCourier (if needed)."""

from libraries.code_api.code_manager.build_process.build_step import BuildProcessStep
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory


class BuildProcessNexusCourier(BuildProcessStep):
	"""Represents the build process steps for caching updates on NexusCourier (if needed)."""

	def __init__(self, domain):
		super().__init__(domain, None)
		self.any_files_updated = False
		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x0))

	def step_0x0(self):
		"""The first step."""
		self.web_server = CodeDirectory('/quasar/applications/nexus_courier', base_directory=True)
		self.web_server.add_extensions_to_ignore(['.py'])
		self.web_server.add_extensions_to_match(['.cpp', '.h'])

		self.all_files = self.web_server.get_all_files()

		for f in self.all_files:
			cached_or_updated, file = self.domain.cache_single_file(
				f.file_type,
				None,
				f.full_path,
				'CALCULATE'
			)
			if cached_or_updated:
				self.any_files_updated = True
				self.add_output_line('Cached {' + f.file_name + '}.')

		if self.any_files_updated:
			self.domain.flag_set('NEXUS_COURIER_UPDATED', True)
		else:
			self.domain.flag_set('NEXUS_COURIER_UPDATED', False)
