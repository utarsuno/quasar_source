# coding=utf-8

"""This module, build_step.py, represents a single build step in a build process."""

from libraries.universal_code import useful_file_operations as ufo
from libraries.code_api.code_manager.code_process import CodeProcess


class CodeProcessGzip(CodeProcess):
	"""Represents a single gzip code-process, usually used as a build/cache process."""

	def __init__(self, entity, parent_entity, domain, code_file_type):
		super().__init__(entity, parent_entity, domain)
		self.code_file_type = code_file_type
		self.all_files      = None

	def _perform_process(self):
		"""Process is not cached so run it."""
		for f in self.all_files:

			cached_or_updated, file = self.domain.cache_single_file(
				self.code_file_type,
				'CALCULATE',
				f.full_path,
				'CALCULATE',
				True,
				True,
				False
			)

			if cached_or_updated or file.child_f_id is None:

				# Gzip the file.
				gzip_path = file.path + '.gz'
				ufo.file_op_create_gzip(file.path)

				gzip_cached_or_updated, gzip_file = self.domain.cache_single_file(
					self.code_file_type,
					'CALCULATE',
					gzip_path,
					'CALCULATE',
					False, False, False
				)

				self.domain.link_child_file_to_parent(gzip_file, file)

