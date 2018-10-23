# coding=utf-8

"""This module, html.py, contains the build processes for building HTML files (if needed)."""

from libraries.code_api.code_manager.build_process.build_step import BuildProcessStep
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from libraries.universal_code import useful_file_operations as ufo

DOMAIN_FLAG_CSS_FILES_THAT_UPDATED = 'CSS_files_that_have_been_updated'


class BuildProcessHTML(BuildProcessStep):
	"""Represents the build process steps for creating HTML files."""

	def __init__(self, domain):
		super().__init__(domain, None)

		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x0))
		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x1))

		self.files      = None
		self._base_file = None

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

	def step_0x0(self):
		"""The first step."""
		self.html = CodeDirectory('/quasar/assets/html', base_directory=True)
		self.html.add_extensions_to_ignore(['.min', '.gz'])
		self.html.add_extension_to_match('.html')
		self.files = self.html.get_all_files()

		for f in self.files:
			f.parse_pre_processes(self.domain)
			#print(f.files_from_domain_needed)
			#print(f)

			cached_or_updated, self._base_file = self.domain.cache_base_file(f)

			if not cached_or_updated and not self._is_updated_needed_from_css_file_changes(f.files_from_domain_needed):
				self.finish_early('HTML files (and any needed CSS files) already cached.')

	def step_0x1(self):
		"""This step is the actual build process."""
		for f in self.files:
			# Pre-process.
			minified_file_path = self.domain.generated_content_path + f.file_name_with_minified_extension
			process_file_path  = minified_file_path.replace('.min', '.processed')
			parent_file        = self._base_file

			if f.pre_process_needed:
				f.generate_processed_version(process_file_path)

				child_cached_or_updated, processed_file = self.domain.cache_child_file_based_off_base_code_file(
					child_path=process_file_path,
					base_code_file=f,
					base_file=self._base_file
				)
				parent_file = processed_file

			# Now minify.
			if parent_file == self._base_file:
				f.minify(minified_file_path)
			else:
				f.minify(minified_file_path, alternate_input_path=process_file_path)

			child_cached_or_updated, minified_file = self.domain.cache_child_file_based_off_base_code_file(
				child_path=minified_file_path,
				base_code_file=f,
				base_file=parent_file
			)

			# Generated the GZIP file.
			gzip_path = minified_file_path + '.gz'
			ufo.file_op_create_gzip(minified_file_path, gzip_path)

			gzip_cached_or_updated, gzip_file = self.domain.cache_child_file_based_off_base_code_file(
				child_path=gzip_path,
				base_code_file=f,
				base_file=minified_file
			)

			# Now copy the needed files to the volume.
			volume_file_path = self.domain.volume_path + f.file_name_with_minified_extension
			ufo.file_op_copy(minified_file_path, volume_file_path)
			ufo.file_op_copy(gzip_path         , volume_file_path + '.gz')

			self.log_file_cached(f)

