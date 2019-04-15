# coding=utf-8

"""This module, build_step.py, represents a single build step in a build process."""

from libraries.code_api.code_manager.build_step import BuildProcessStep


class BuildProcessStepSimpleAndIsolated(BuildProcessStep):
	"""Represents a single build step."""

	def __init__(self, domain, code_directory, extensions_to_match, extensions_to_ignore):
		super().__init__(domain, None)
		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x0_single_directory))
		self.code_directory = code_directory
		if type(extensions_to_ignore) != list:
			extensions_to_ignore = [extensions_to_ignore]
		if type(extensions_to_match) != list:
			extensions_to_match = [extensions_to_match]
		self.code_directory.add_extensions_to_ignore(extensions_to_ignore)
		self.code_directory.add_extensions_to_match(extensions_to_match)

		self.minifies = False
		self.gzips    = False

	def should_process_base_file(self, code_file, base_file_cached_or_updated) -> bool:
		"""Returns a boolean indicating if this base file should be further processed."""
		return base_file_cached_or_updated

	def handle_base_file_setup(self, code_file) -> None:
		"""Handles the base file step setup (if needed)."""
		pass

	def handle_minify_pre_setup(self, code_file, base_file, processed_file_path: str) -> None:
		"""Handles the minification step setup (if needed)."""
		return False

	def handle_minify_setup(self, code_file, minified_path: str, processed_file_path: str=None) -> None:
		"""Handles the minification step setup (if needed)."""
		pass

	def handle_minify_end(self, code_file, minified_path: str, updated: bool) -> None:
		"""Handles the minification step end (if needed)."""
		pass

	def step_0x0_single_directory(self):
		"""Utility function."""
		files = self.code_directory.get_all_files()

		for f in files:
			self.handle_base_file_setup(f)

			base_file_cached_or_updated, base_file = self.domain.cache_base_file(f)

			if self.should_process_base_file(f, base_file_cached_or_updated):

				self.log_file_cached(f)

				if self.minifies:
					minified_path  = self.domain.path_output + f.file_name_with_minified_extension
					processed_path = minified_path.replace('.min', '.processed')

					use_processed = self.handle_minify_pre_setup(f, base_file, processed_path)

					if use_processed:
						self.handle_minify_setup(f, minified_path, processed_path)
					else:
						self.handle_minify_setup(f, minified_path, None)

					updated, minified_file = self.domain.cache_child_file_based_off_base_code_file(
						base_code_file = f,
						base_file      = base_file,
						child_path     = minified_path
					)
					self.handle_minify_end(f, minified_path, updated)
