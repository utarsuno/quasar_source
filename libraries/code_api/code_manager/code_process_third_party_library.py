# coding=utf-8

"""This module, build_step.py, represents a single build step in a build process."""

from libraries.universal_code import output_coloring as oc
from libraries.universal_code import debugging as dbg
from libraries.code_api.code_manager.code_process import CodeProcess


class CodeProcessThirdPartyLibrary(CodeProcess):
	"""Represents a single third-party-library code-process, usually used as a build/cache process."""

	def __init__(self, entity, parent_entity, domain):
		super().__init__(entity, parent_entity, domain)
		self.latest_version = None
		self.last_updated   = None

	def library_needs_version_update(self):
		"""Returns a boolean indicating if the library needs a version update."""
		if self.parent_entity.needs_version_update_check():
			return True

		# Check if the latest version is newer.
		self.latest_version = self._get_latest_version()
		if self.latest_version != self.parent_entity.version:
			oc.print_ascii_yellow('TODO:')
			oc.print_error('LOG/INFORM THAT THREE JS HAS UPDATED!!!')
			return True

	def update_library_version(self):
		"""Updates the linked library's version."""
		self.parent_entity.update_version(self.latest_version)

	def _get_latest_version(self):
		"""Returns the latest version of this library."""
		dbg.raise_abstract_method_call_exception('_get_latest_version')


