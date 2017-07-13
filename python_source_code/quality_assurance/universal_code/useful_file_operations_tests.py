# coding=utf-8

"""This module, useful_file_operations_tests.py, contains the unit tests for the 'useful_file_operations.py' module."""

# Test the following module.
import unittest
# Used to get relevant paths.
from python_source_code.quality_assurance import run_all_unit_tests as p
from python_source_code.universal_code import useful_file_operations as ufo


class UsefulFileOperationsTestSuite(unittest.TestCase):

    # From universal_code.useful_file_operations.py, testing 'get_file_basename'.
    def test_get_file_basename(self):
        self.assertEqual(ufo.get_file_basename('a/b/c/')              , 'c')
        self.assertEqual(ufo.get_file_basename('a/b/c')               , 'c')
        self.assertEqual(ufo.get_file_basename('\\a\\b\\c')           , 'c')
        self.assertEqual(ufo.get_file_basename('\\a\\b\\c\\')         , 'c')
        self.assertEqual(ufo.get_file_basename('a\\b\\c')             , 'c')
        self.assertEqual(ufo.get_file_basename('a/b/../../a/b/c/')    , 'c')
        self.assertEqual(ufo.get_file_basename('a/b/../../a/b/c')     , 'c')
        self.assertEqual(ufo.get_file_basename('C:\\')                , 'C:')
        self.assertEqual(ufo.get_file_basename('alone')               , 'alone')
        self.assertEqual(ufo.get_file_basename('/a/space in filename'), 'space in filename')
        self.assertEqual(ufo.get_file_basename('C:\\multi\nline')     , 'multi\nline')

    # From universal_code.useful_file_operations.py, testing 'is_file'.
    def test_is_file(self):
        self.assertEqual(ufo.is_file(p.path_text_file_empty)                   , True)
        self.assertEqual(ufo.is_file(p.path_text_file_non_empty)               , True)
        self.assertEqual(ufo.is_file(p.path_text_file_multiple_extensions)     , True)
        self.assertEqual(ufo.is_file(p.path_text_file_no_extension)            , True)
        self.assertEqual(ufo.is_file(p.path_text_file_extension_of_just_period), True)
        self.assertEqual(ufo.is_file(p.path_text_file_non_existent)            , False)
        self.assertEqual(ufo.is_file(5)                                        , False)
        self.assertEqual(ufo.is_file('')                                       , False)
        self.assertEqual(ufo.is_file(p.path_directory_empty)                   , False)
        self.assertEqual(ufo.is_file(p.path_directory_non_empty)               , False)
        self.assertEqual(ufo.is_file(p.path_directory_empty_version_two)       , False)
        self.assertEqual(ufo.is_file(p.path_directory_non_existent)            , False)

    # From universal_code.useful_file_operations.py, testing 'is_directory'.
    def test_is_directory(self):
        self.assertEqual(ufo.is_directory(p.path_directory_empty)                   , True)
        self.assertEqual(ufo.is_directory(p.path_directory_non_empty)               , True)
        self.assertEqual(ufo.is_directory(p.path_directory_empty_version_two)       , True)
        self.assertEqual(ufo.is_directory(p.path_directory_non_existent)            , False)
        self.assertEqual(ufo.is_directory(5)                                        , False)
        self.assertEqual(ufo.is_directory('')                                       , False)
        self.assertEqual(ufo.is_directory(p.path_text_file_empty)                   , False)
        self.assertEqual(ufo.is_directory(p.path_text_file_non_empty)               , False)
        self.assertEqual(ufo.is_directory(p.path_text_file_multiple_extensions)     , False)
        self.assertEqual(ufo.is_directory(p.path_text_file_non_existent)            , False)
        self.assertEqual(ufo.is_directory(p.path_text_file_extension_of_just_period), False)

    # From universal_code.useful_file_operations.py, testing 'get_file_last_extension'.
    def test_get_file_last_extension(self):
        #path_text_file_multiple_extensions
        self.assertEqual(ufo.get_file_last_extension(p.path_text_file_empty)                   , '.txt')
        self.assertEqual(ufo.get_file_last_extension(p.path_text_file_multiple_extensions)     , '.apples')
        self.assertEqual(ufo.get_file_last_extension(p.path_text_file_no_extension)            , '')
        self.assertEqual(ufo.get_file_last_extension(p.path_text_file_extension_of_just_period), '')
        self.assertEqual(ufo.get_file_last_extension(p.path_text_file_non_empty)               , '.txt')

    # From universal_code.useful_file_operations.py, testing 'get_file_extensions'.
    def test_get_file_extensions(self):
        y = 2


if __name__ == '__main__':
    unittest.main()

'''

def get_file_last_extension(path: str) -> str:
	"""Extracts the last extension from the provided path (if it exists, returns '' otherwise)."""
	if _is_valid_path_parameter(path):
		return Path(path).suffix
	return ''


def get_file_extensions(path: str) -> List[str]:
	"""Extracts all the file extensions from the provided path (if any exist, returns [] otherwise)."""
	if _is_valid_path_parameter(path):
		return Path(path).suffixes
	return []

'''