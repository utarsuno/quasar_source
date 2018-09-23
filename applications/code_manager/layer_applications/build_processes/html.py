# coding=utf-8

"""This module, html.py, contains the build processes for building HTML files (if needed)."""

from libraries.code_api.code_manager.build_process.build_step import BuildProcessStep
from libraries.code_api.source_file_abstraction.code_directories.code_directory import CodeDirectory
from libraries.universal_code import output_coloring as oc
from libraries.universal_code import useful_file_operations as ufo
from libraries.code_api.source_file_abstraction.code_files import code_file
from libraries.database_abstraction.sql.query_abstraction import sql_query as sql

DOMAIN_FLAG_CSS_FILES_THAT_UPDATED = 'CSS_files_that_have_been_updated'


class BuildProcessHTML(BuildProcessStep):
	"""Represents the build process steps for creating HTML files."""

	def __init__(self, domain):
		super().__init__(domain, None)

		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x0))
		self.add_sub_build_process(BuildProcessStep(domain, self.step_0x1))

		self.files = None
		self._base_file = None

	def _is_needed_css_file_changed(self, file_path: str) -> bool:
		"""Utility function."""
		if not self.domain.does_flag_exist(DOMAIN_FLAG_CSS_FILES_THAT_UPDATED):
			return False
		else:
			return file_path in self.domain.get_flag(DOMAIN_FLAG_CSS_FILES_THAT_UPDATED)

	def _is_updated_needed_from_css_file_changes(self, css_files: list) -> bool:
		"""Utility function."""
		for f in css_files:
			if self._is_needed_css_file_changed(f):
				return True
		return False

	def step_0x0(self):
		"""The first step."""
		self.html = CodeDirectory('/quasar/assets/html', base_directory=True, generated_output_directory='/quasar/generated_output/web_assets/')
		self.html.add_extensions_to_ignore(['.min', '.gz'])
		self.html.add_extension_to_match('.html')
		self.files = self.html.get_all_files()

		for f in self.files:
			f.parse_pre_processes(self.domain)
			print(f.files_from_domain_needed)
			#print(f)

			cached_or_updated, self._base_file = self.domain.cache_single_file(
				code_file.FILE_TYPE_HTML,
				'CALCULATE',
				f.full_path,
				'CALCULATE',
				sql.SQL_VALUE_NOW,
			)

			if not cached_or_updated and not self._is_updated_needed_from_css_file_changes(f.files_from_domain_needed):
				self.finish_early('HTML file (and any needed CSS files) already cached.')

	def step_0x1(self):
		"""This step is the actual build process."""
		for f in self.files:
			# Pre-process.
			minified_file_path  = '/quasar/generated_output/web_assets/' + f.file_name_with_extension.replace('.html', '.min.html')
			process_file_path   = '/quasar/generated_output/web_assets/' + f.file_name_with_extension.replace('.html', '.processed.html')

			parent_file = self._base_file

			if f.pre_process_needed:
				f.generate_processed_version(process_file_path)

				child_cached_or_updated, processed_file = self.domain.cache_single_file(
					code_file.FILE_TYPE_HTML,
					'CALCULATE',
					process_file_path,
					'CALCULATE',
					sql.SQL_VALUE_NOW
				)

				self.domain.link_child_file_to_parent(processed_file, self._base_file)
				parent_file = processed_file

			# Now minify.
			if parent_file == self._base_file:
				f.minify(minified_file_path)
			else:
				f.minify(minified_file_path, alternate_input_path=process_file_path)

			child_cached_or_updated, minified_file = self.domain.cache_single_file(
				code_file.FILE_TYPE_HTML,
				'CALCULATE',
				minified_file_path,
				'CALCULATE',
				sql.SQL_VALUE_NOW
			)

			self.domain.link_child_file_to_parent(minified_file, parent_file)

			# Generated the GZIP file.
			gzip_path = minified_file_path + '.gz'
			ufo.file_op_create_gzip(minified_file_path, gzip_path)

			gzip_cached_or_updated, gzip_file = self.domain.cache_single_file(
				code_file.FILE_TYPE_HTML,
				'CALCULATE',
				gzip_path,
				'CALCULATE',
				sql.SQL_VALUE_NOW
			)

			self.domain.link_child_file_to_parent(gzip_file, minified_file)

			# Now copy the needed files to the volume.
			_f_name = f.file_name_with_extension.replace('.html', '.min.html')
			volume_file_path = '/nexus_volume/' + _f_name
			ufo.file_op_copy(minified_file_path, volume_file_path)
			ufo.file_op_copy(gzip_path, volume_file_path + '.gz')

