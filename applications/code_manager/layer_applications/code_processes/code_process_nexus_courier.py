# coding=utf-8

"""This module, build_process_mqtt.py, builds the 3rd party library uTT."""

from libraries.code_api.code_manager.code_process import CodeProcess
from libraries.universal_code import output_coloring as oc
from libraries.code_api.source_file_abstraction.code_files import code_file
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory


class CodeProcessNexusCourier(CodeProcess):
	"""Cache checker for NexusCourier files."""

	def __init__(self, entity, parent_entity, domain):
		super().__init__(entity, parent_entity, domain)

	def _run(self):
		oc.print_green('Running CodeProcessNexusCourier')

		# Websocket server
		self.web_server = CodeDirectory('/quasar/applications/nexus_courier', base_directory=True)
		self.web_server.add_extensions_to_ignore(['.py'])
		self.web_server.add_extensions_to_match(['.cpp', '.h'])
		#self.web_server.load_all_content()

		self.any_file_updated = False
		self.all_files = self.web_server.get_all_files()
		#if any_file_updated:
		#	print('BUILD WEBSOCKET SERVER!')
		#	#self.db.print_all_data()
		#	return 222

		self._perform_process()

	def _perform_process(self):
		"""Runs this process."""
		for f in self.all_files:

			if '.h' in f.full_path:
				file_type = code_file.FILE_TYPE_HEADER
			else:
				file_type = code_file.FILE_TYPE_CPP

			cached_or_updated, file = self.domain.cache_single_file(
				file_type,
				None,
				f.full_path,
				'CALCULATE',
				False,
				False,
				False
			)

			if cached_or_updated:
				self.any_file_updated = True

		if self.any_file_updated:
			self.domain.add_flag('NEXUS_COURIER_UPDATE', True)
		else:
			self.domain.add_flag('NEXUS_COURIER_UPDATE', False)

