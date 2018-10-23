# coding=utf-8

"""This module, build_step.py, represents a single build step in a build process."""

from libraries.code_api.code_manager.build_process.build_step import BuildProcessStep
from libraries.universal_code.system_abstraction.shell_command_runner import BashCommandRunner
import traceback


class BuildProcessStepSimpleAndIsolated(BuildProcessStep):
	"""Represents a single build step."""

	def __init__(self, domain, code_directory, extensions_to_match, extensions_to_ignore):
		super().__init__(domain, None)
		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x0_single_directory))
		self.code_directory = code_directory
		self.code_directory.add_extensions_to_ignore(extensions_to_ignore)
		self.code_directory.add_extensions_to_match(extensions_to_match)

	def handle_cached_file(self, code_file, db_file):
		"""Handles the cached filed."""
		pass

	def step_0x0_single_directory(self):
		"""Utility function."""
		files = self.code_directory.get_all_files()
		for f in files:
			cached_or_updated, file = self.domain.cache_base_file(f)
			if cached_or_updated:
				self.log_file_cached(f)
				self.handle_cached_file(f, file)

