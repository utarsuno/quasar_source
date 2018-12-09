# coding=utf-8

"""This module, html.py, contains the build processes for building HTML files (if needed)."""

from libraries.code_api.code_manager.build_step_simple_isolated import BuildProcessStepSimpleAndIsolated
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from libraries.universal_code import useful_file_operations as ufo

DOMAIN_FLAG_CSS_FILES_THAT_UPDATED = 'CSS_files_that_have_been_updated'


class BuildProcessHTML(BuildProcessStepSimpleAndIsolated):
	"""Represents the build process steps for creating HTML files."""

	def __init__(self, domain):
		super().__init__(domain, CodeDirectory('/quasar/assets/html', base_directory=True), 'html', ['min', 'gz'])
		self.minifies = True
		self.gzips    = True

	def _is_needed_css_file_changed(self, file_path: str) -> bool:
		"""Utility function."""
		if not self.domain.flag_does_exist(DOMAIN_FLAG_CSS_FILES_THAT_UPDATED):
			return False
		else:
			return file_path in self.domain.flag_get(DOMAIN_FLAG_CSS_FILES_THAT_UPDATED)

	def _is_updated_needed_from_css_file_changes(self, css_files: list) -> bool:
		"""Utility function."""
		for f in css_files:
			if self._is_needed_css_file_changed(f):
				return True
		return False

	def handle_base_file_setup(self, code_file) -> None:
		"""Handles the base file step setup (if needed)."""
		code_file.parse_pre_processes(self.domain)

	def should_process_base_file(self, code_file, base_file_cached_or_updated: bool) -> bool:
		"""Returns a boolean indicating if this base file should be further processed."""
		if not base_file_cached_or_updated and not self._is_updated_needed_from_css_file_changes(code_file.files_from_domain_needed):
			# TODO: Update this for when there is more than 1 HTML or CSS file. (don't finish early, log and keep looping).
			self.finish_early('HTML files (and any needed CSS files) already cached.')
			return False
		return True

	def handle_minify_pre_setup(self, code_file, base_file, processed_file_path: str) -> None:
		"""Handles the minification step setup (if needed)."""
		if code_file.pre_process_needed:
			code_file.generate_processed_version(processed_file_path)
			child_cached_or_updated, processed_file = self.domain.cache_child_file_based_off_base_code_file(
				child_path     = processed_file_path,
				base_code_file = code_file,
				base_file      = base_file
			)
			return True
		return False

	def handle_minify_setup(self, code_file, minified_path: str, processed_file_path: str=None) -> None:
		"""Handles the minification step setup (if needed)."""
		if processed_file_path is not None:
			code_file.minify(minified_path, alternate_input_path=processed_file_path)
		else:
			code_file.minify(minified_path)

	def handle_gzip_setup(self, base_path: str, gzip_path: str) -> None:
		"""Handles the gzip step setup (if needed)."""
		ufo.file_op_create_gzip(base_path, gzip_path)

	def handle_gzip_end(self, base_path: str, gzip_path: str, base_volume_path: str, gzip_volume_path: str) -> None:
		"""Handles the gzip step end (if needed)."""
		# Now copy the needed files to the volume.
		ufo.file_op_copy(base_path, base_volume_path)
		ufo.file_op_copy(gzip_path, gzip_volume_path)
