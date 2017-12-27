# coding=utf-8

"""This module, useful_file_operations_tests.py, contains the unit tests for the 'useful_file_operations.py' module."""

# Needed for running unit tests.
import unittest

from database_api import database_tables as db_tables
from database_api import postgresql_api as db_api

# TODO : DEPRECIATED as of 12.25.2017


class DatabaseTablesTestSuite(unittest.TestCase):

	def setUp(self):
		"""This runs before all unit tests."""
		# To fix the error message 'Diff is 1154 characters long. Set self.maxDiff to None to see it.
		self.maxDiff = None
		self.assertEqual.__self__.maxDiff = None

		# Create the database api + connection to work with.
		self.api = db_api.PostgreSQLAPI()
		self.api.connect()

		self.test_table = db_tables.DatabaseTable('test_table', self.api)
		self.test_table.add_table_field(db_tables.TableFieldString('string_field', 30))
		self.test_table.add_table_field(db_tables.TableFieldInteger('int_field', 5, auto_increment=False))
		self.test_table.create_if_does_not_exist()

	def tearDown(self):
		"""This runs after all the unit tests."""
		self.test_table.delete_if_exists()

		self.api.terminate()

	''' Tests for :
	     __       ___       __        __   ___    ___       __        ___     __             __   __
		|  \  /\   |   /\  |__)  /\  /__` |__      |   /\  |__) |    |__     /  ` |     /\  /__` /__`
		|__/ /~~\  |  /~~\ |__) /~~\ .__/ |___     |  /~~\ |__) |___ |___    \__, |___ /~~\ .__/ .__/
	'''

	def test_create_and_delete(self):
		self.temp_test_table = db_tables.DatabaseTable('temp_test_table', self.api)
		self.temp_test_table.add_table_field(db_tables.TableFieldString('string_field', 30))

		# First make sure this table doesn't already exist.
		self.assertEqual(self.temp_test_table.exists                                      , False)
		self.assertEqual(self.temp_test_table.table_name in self.api.get_all_table_names(), False)

		# Now create it and test if it's marked as created.
		self.temp_test_table.create_if_does_not_exist()
		self.assertEqual(self.temp_test_table.exists                                      , True)
		self.assertEqual(self.temp_test_table.table_name in self.api.get_all_table_names(), True)

		# Make sure to delete this table now.
		self.temp_test_table.delete_if_exists()
		self.assertEqual(self.temp_test_table.exists                                      , False)
		self.assertEqual(self.temp_test_table.table_name in self.api.get_all_table_names(), False)

	def test_insert_and_delete_row(self):
		# First make sure the table is empty.
		self.assertEqual(len(self.test_table.get_row_values()), 0)

		self.test_table.insert_row({'string_field': 'hi', 'int_field': 5})
		self.assertEqual(self.test_table.get_single_value('int_field', 'string_field', 'hi'), 5)

		self.test_table.delete_row_with_value('string_field', 'hi')
		self.assertEqual(len(self.test_table.get_row_values()), 0)

	def test_table_headers(self):
		self.assertEqual('string_field' in self.test_table.get_header_names(), True)
		self.assertEqual('int_field' in self.test_table.get_header_names()   , True)

	# TODO : Test each database table type possible and that it has the correct database variable type.

if __name__ == '__main__':
	unittest.main()
