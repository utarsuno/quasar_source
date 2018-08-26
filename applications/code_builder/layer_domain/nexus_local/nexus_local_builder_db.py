# coding=utf-8

"""This module, nexus_local_builder_db.py, represents the nexus_local builder local DB."""


from libraries.universal_code import output_coloring as oc

from libraries.universal_code import useful_file_operations as ufo

from applications.code_builder.layer_domain.nexus_local import db_entities


class NexusLocalBuilderDB(object):
	"""Holds the DB logic for NexusLocal builder."""

	def __init__(self):
		self.project = db_entities.DBEntityCodeProjectNexusLocal()
		self.project.initial_load()

	####

	def get_source_file_id(self, f):
		"""Utility function."""
		return self.project.files_source.table.get_value('')

	def cache_file(self, f):
		"""Builds the file."""
		return self.project.ensure_source_file_cached(f)

	def cache_file_minified(self, f, output_path, update=False):
		"""Cache the minified file."""
		minified_file_path = f.generate_minified_file(None, output_path)
		return self.project.ensure_generated_filed_cached(minified_file_path, f.compressed_size, f, False, sent_path=False, update=update)

	def cache_file_regular_gzip(self, f, update=False):
		"""Utility function."""
		ufo.file_op_create_gzip(f.full_path)
		return self.project.ensure_generated_filed_cached(f.full_path + '.gz', ufo.get_file_size_in_bytes(f.full_path + '.gz'), f.full_path, False, sent_path=True, update=update)

	def cache_file_gzipped(self, gf_id, minified_file_path, update=False):
		"""Cache the gzipped file."""
		ufo.file_op_create_gzip(minified_file_path)
		return self.project.ensure_generated_filed_cached(minified_file_path + '.gz', ufo.get_file_size_in_bytes(minified_file_path + '.gz'), minified_file_path, True, sent_path=True, update=update)

	####

	def _get_percentage(self, smaller_value, larger_value):
		"""Utility function."""
		n = str(((1.0 - (smaller_value / larger_value)) * 100.0))
		if len(n) > 6:
			n = n[:6]
		return n + '%'

	def print_all_dataOLD(self):
		"""Prints all the data."""
		rows = self.table_cache.get_all_rows(with_row_id=True)
		for r in rows:
			file_name = ufo.get_file_basename(r[2])
			file_size = int(r[3])
			minified_size = None
			gzipped_size  = None
			row_id = r[0]
			matched = self.table_compressed.get_row_matches('original_file_row_id', row_id)
			for m in matched:
				if '.gz' in m[0]:
					gzipped_size = int(m[1])
				elif '.min' in m[0]:
					minified_size = int(m[1])

			reduction = ''
			if minified_size is not None:
				reduction += ' - {' + str(minified_size) + '}[' + self._get_percentage(minified_size, file_size) + ']'
			if gzipped_size is not None:
				reduction += ' - {' + str(gzipped_size) + '}[' + self._get_percentage(gzipped_size, file_size) + ']'

			oc.print_data('File{' + file_name + '} - {' + str(file_size) + '}' + reduction)

	def print_all_data(self):
		"""Utility function."""
		rows = self.project.files_source.table.get_all_rows()
		for r in rows:
			print(r)
			pf_id = r[2]
			file = self.project.files_project.table.get_row_match('pf_id', pf_id)
			print(file)

		print('\n')
		rows = self.project.files_generated.table.get_all_rows()
		for r in rows:
			print(r)

		print('\n')
		rows = self.project.files_project.table.get_all_rows()
		for r in rows:
			print(r)
