# coding=utf-8

"""This module, nexus_local_builder_db.py, represents the nexus_local builder local DB."""


from libraries.database_api.sql_databases.sqlite import sqlite_db
from libraries.database_api.sql_databases.sqlite import column_abstraction as col
from libraries.database_api.sql_databases.sqlite import data_types as dt
from libraries.database_api.sql_databases.sqlite import table_abstraction as table

from libraries.universal_code import output_coloring as oc

from libraries.universal_code import useful_file_operations as ufo
from libraries.universal_code.system_abstraction.shell_command_runner import BashCommandRunner


class NexusLocalBuilderDB(object):
	"""Holds the DB logic for NexusLocal builder."""

	def __init__(self):
		self.db = sqlite_db.SQLiteDB('/quasar/generated_output/local/code_builder/db.sqlite')
		self.db.connect()

		self.table_cache = table.TableAbstraction('table_cache')
		self.table_cache.add_column(col.ColumnAbstraction('md5sum', dt.SQLiteDataTypeTEXT(is_primary_key=False, is_nullable=False, is_unique=False)))
		self.table_cache.add_column(col.ColumnAbstraction('file_path', dt.SQLiteDataTypeTEXT(is_primary_key=True, is_nullable=False, is_unique=True)))
		self.table_cache.add_column(col.ColumnAbstraction('file_size', dt.SQLiteDataTypeINTEGER(is_primary_key=False, is_nullable=False, is_unique=False)))

		self.table_compressed = table.TableAbstraction('table_compressed')
		self.table_compressed.add_column(col.ColumnAbstraction('file_path', dt.SQLiteDataTypeTEXT(is_primary_key=True, is_nullable=False, is_unique=True)))
		self.table_compressed.add_column(col.ColumnAbstraction('file_size', dt.SQLiteDataTypeTEXT(is_primary_key=False, is_nullable=False, is_unique=False)))
		self.table_compressed.add_column(col.ColumnAbstraction('original_file_row_id', dt.SQLiteDataTypeINTEGER(is_primary_key=False, is_nullable=False, is_unique=False)))

		self.db.add_table(self.table_cache)
		self.db.add_table(self.table_compressed)

		#self.table_cache.delete()
		self.table_cache.create()

		#self.table_compressed.delete()
		self.table_compressed.create()

	def cache_db_file(self, f):
		"""Checks this file against the current cache."""
		if not self.table_cache.has_value('file_path', f.full_path):
			self.table_cache.insert({'md5sum': f.md5sum, 'file_path': f.full_path, 'file_size': f.file_size})
			return False
		else:
			current = self.table_cache.get_value('md5sum', 'file_path', f.full_path)
			print('CURRENT {' + str(current) + '}')
			print('FILE    {' + str(f.md5sum) + '}')
			if current == f.md5sum:
				return True
			else:
				self.table_cache.update_value(f.md5sum, '')
				print('NEED TO DO A REPALCE NOT INSERT!')
				exit()
				# TODO: NEED TO DO A REPLACE NOT INSERT!
				return False

	def get_file_row_id(self, f):
		"""Returns the file original row_id."""
		return self.table_cache.get_row_id('file_path', f.full_path)

	def create_compressed_file(self, path, size, original_row_id):
		"""Creates a compressed file."""
		self.table_compressed.insert({'file_path': path, 'file_size': size, 'original_file_row_id': original_row_id})

	def create_gzip_file(self, file_path, original_row_id):
		"""Creates a gzip file. TODO: Spread logic to proper files."""
		bc = BashCommandRunner(['rm', file_path + '.gz'])
		bc.run()
		bash_command = BashCommandRunner(['gzip', '-k', '-9', file_path])
		bash_command.run()
		self.table_compressed.insert({'file_path': file_path + '.gz', 'file_size': ufo.get_file_size_in_bytes(file_path + '.gz'), 'original_file_row_id': original_row_id})

	def _get_percentage(self, smaller_value, larger_value):
		"""Utility function."""
		n = str(((1.0 - (smaller_value / larger_value)) * 100.0))
		if len(n) > 6:
			n = n[:6]
		return n + '%'

	def print_all_data(self):
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
