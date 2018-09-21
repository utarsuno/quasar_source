# coding=utf-8

"""This module, build_step.py, represents a single build step in a build process."""

from libraries.universal_code import useful_file_operations as ufo
from libraries.code_api.code_manager.code_process import CodeProcess


class CodeProcessMinifyThenGzip(CodeProcess):
	"""Represents a single minify then gzip code-process, usually used as a build/cache process."""

	def __init__(self, entity, parent_entity, domain, code_file_type):
		super().__init__(entity, parent_entity, domain)
		self.code_file_type = code_file_type
		self.all_files      = None
		self.output_path    = '/quasar/generated_output/web_assets/'

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
				generated_file_path = f.generate_minified_file(None, self.output_path)

				child_cached_or_updated, child_file = self.domain.cache_single_file(
					self.code_file_type,
					'CALCULATE',
					generated_file_path,
					'CALCULATE',
					True,
					False,
					False
				)

				if file.child_f_id is None:
					child_id = child_file.get_id()
					file.set_child_file(child_file)
					child_file.set_parent_file(file)

				# Gzip the minified file.
				gzip_path = generated_file_path + '.gz'
				ufo.file_op_create_gzip(generated_file_path, gzip_path)

				gzip_cached_or_updated, gzip_file = self.domain.cache_single_file(
					self.code_file_type,
					'CALCULATE',
					gzip_path,
					'CALCULATE',
					False, False, False
				)

				if child_file.child_f_id is None:
					child_file.set_child_file(gzip_file)
					gzip_file.set_parent_file(child_file)