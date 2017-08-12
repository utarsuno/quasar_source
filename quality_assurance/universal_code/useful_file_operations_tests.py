# coding=utf-8

"""This module, useful_file_operations_tests.py, contains the unit tests for the 'useful_file_operations.py' module."""

# Test the following module.
import unittest

from quasar_source_code.universal_code import useful_file_operations as ufo
from quality_assurance import run_all_unit_tests as p


class UsefulFileOperationsTestSuite(unittest.TestCase):

    def setUp(self):
        """This runs before all unit tests."""
        # To fix the error message 'Diff is 1154 characters long. Set self.maxDiff to None to see it.
        self.maxDiff = None
        self.assertEqual.__self__.maxDiff = None

    def assertListsHaveSameElements(self, l0, l1):
        self.assertEqual(len(l0) == len(l1) and sorted(l0) == sorted(l1), True)

    # From universal_code.useful_file_operations.py, testing 'get_file_basename'.
    def test_get_file_basename(self):
        self.assertEqual(ufo.get_file_basename('a/b/c/')                         , 'c')
        self.assertEqual(ufo.get_file_basename('a/b/c')                          , 'c')
        self.assertEqual(ufo.get_file_basename('\\a\\b\\c')                      , 'c')
        self.assertEqual(ufo.get_file_basename('\\a\\b\\c\\')                    , 'c')
        self.assertEqual(ufo.get_file_basename('a\\b\\c')                        , 'c')
        self.assertEqual(ufo.get_file_basename('a/b/../../a/b/c/')               , 'c')
        self.assertEqual(ufo.get_file_basename('a/b/../../a/b/c')                , 'c')
        self.assertEqual(ufo.get_file_basename('C:\\')                           , 'C:')
        self.assertEqual(ufo.get_file_basename('alone')                          , 'alone')
        self.assertEqual(ufo.get_file_basename('/a/space in filename')           , 'space in filename')
        self.assertEqual(ufo.get_file_basename('C:\\multi\nline')                , 'multi\nline')
        self.assertEqual(ufo.get_file_basename(p.PATH_FILE_EMPTY)                , 'file_empty.txt')
        self.assertEqual(ufo.get_file_basename(p.PATH_FILE_EXTENSION_JUST_PERIOD), 'file_extension_just_period.')
        self.assertEqual(ufo.get_file_basename(p.PATH_FILE_MULTIPLE_EXTENSIONS)  , 'file_multiple_extensions.png.txt.zip.apples')
        self.assertEqual(ufo.get_file_basename(p.PATH_FILE_NO_EXTENSION)         , 'file_no_extension')
        self.assertEqual(ufo.get_file_basename(p.PATH_FILE_NON_EMPTY)            , 'file_non_empty.txt')

    # From universal_code.useful_file_operations.py, testing 'is_file'.
    def test_is_file(self):
        self.assertEqual(ufo.is_file(p.PATH_FILE_EMPTY)                 , True)
        self.assertEqual(ufo.is_file(p.PATH_FILE_NON_EMPTY)             , True)
        self.assertEqual(ufo.is_file(p.PATH_FILE_MULTIPLE_EXTENSIONS)   , True)
        self.assertEqual(ufo.is_file(p.PATH_FILE_NO_EXTENSION)          , True)
        self.assertEqual(ufo.is_file(p.PATH_FILE_EXTENSION_JUST_PERIOD) , True)
        self.assertEqual(ufo.is_file(p.PATH_FILE_NON_EXISTENT)          , False)
        self.assertEqual(ufo.is_file(5)                                 , False)
        self.assertEqual(ufo.is_file(None)                              , False)
        self.assertEqual(ufo.is_file('')                                , False)
        self.assertEqual(ufo.is_file(p.PATH_DIRECTORY_EMPTY)            , False)
        self.assertEqual(ufo.is_file(p.PATH_DIRECTORY_NON_EMPTY)        , False)
        self.assertEqual(ufo.is_file(p.PATH_DIRECTORY_EMPTY_VERSION_TWO), False)
        self.assertEqual(ufo.is_file(p.PATH_DIRECTORY_NON_EXISTENT)     , False)

    # From universal_code.useful_file_operations.py, testing 'is_directory'.
    def test_is_directory(self):
        self.assertEqual(ufo.is_directory(p.PATH_DIRECTORY_EMPTY)            , True)
        self.assertEqual(ufo.is_directory(p.PATH_DIRECTORY_NON_EMPTY)        , True)
        self.assertEqual(ufo.is_directory(p.PATH_DIRECTORY_EMPTY_VERSION_TWO), True)
        self.assertEqual(ufo.is_directory(p.PATH_DIRECTORY_NON_EXISTENT)     , False)
        self.assertEqual(ufo.is_directory(5)                                 , False)
        self.assertEqual(ufo.is_directory('')                                , False)
        self.assertEqual(ufo.is_directory(None)                              , False)
        self.assertEqual(ufo.is_directory(p.PATH_FILE_EMPTY)                 , False)
        self.assertEqual(ufo.is_directory(p.PATH_FILE_NON_EMPTY)             , False)
        self.assertEqual(ufo.is_directory(p.PATH_FILE_MULTIPLE_EXTENSIONS)   , False)
        self.assertEqual(ufo.is_directory(p.PATH_FILE_NON_EXISTENT)          , False)
        self.assertEqual(ufo.is_directory(p.PATH_FILE_EXTENSION_JUST_PERIOD) , False)

    # From universal_code.useful_file_operations.py, testing 'get_file_last_extension'.
    def test_get_file_last_extension(self):
        self.assertEqual(ufo.get_file_last_extension(p.PATH_FILE_EMPTY)                , '.txt')
        self.assertEqual(ufo.get_file_last_extension(p.PATH_FILE_MULTIPLE_EXTENSIONS)  , '.apples')
        self.assertEqual(ufo.get_file_last_extension(p.PATH_FILE_NO_EXTENSION)         , '')
        self.assertEqual(ufo.get_file_last_extension(p.PATH_FILE_EXTENSION_JUST_PERIOD), '')
        self.assertEqual(ufo.get_file_last_extension(p.PATH_FILE_NON_EMPTY)            , '.txt')

    # From universal_code.useful_file_operations.py, testing 'get_file_extensions'.
    def test_get_file_extensions(self):
        self.assertEqual(ufo.get_file_extensions(p.PATH_FILE_EMPTY)                , ['.txt'])
        self.assertEqual(ufo.get_file_extensions(p.PATH_FILE_MULTIPLE_EXTENSIONS)  , ['.png', '.txt', '.zip', '.apples'])
        self.assertEqual(ufo.get_file_extensions(p.PATH_FILE_NO_EXTENSION)         , [])
        self.assertEqual(ufo.get_file_extensions(p.PATH_FILE_EXTENSION_JUST_PERIOD), [])
        self.assertEqual(ufo.get_file_extensions(p.PATH_FILE_NON_EMPTY)            , ['.txt'])

    # From universal_code.useful_file_operations.py, testing 'get_all_file_paths_inside_directory'.
    def test_get_all_file_paths_inside_directory(self):
        self.assertListsHaveSameElements(ufo.get_all_file_paths_inside_directory(p._path_testing_content), p.ALL_FILE_PATHS)
        self.assertListsHaveSameElements(ufo.get_all_file_paths_inside_directory('')                     , [])
        self.assertListsHaveSameElements(ufo.get_all_file_paths_inside_directory(None)                   , [])

    # From universal_code.useful_file_operations.py, testing 'get_all_file_names_inside_directory'.
    def test_get_all_file_names_inside_directory(self):
        self.assertListsHaveSameElements(ufo.get_all_file_names_inside_directory(p._path_testing_content), p.ALL_FILE_NAMES)
        self.assertListsHaveSameElements(ufo.get_all_file_names_inside_directory('')                     , [])
        self.assertListsHaveSameElements(ufo.get_all_file_names_inside_directory(None)                   , [])

    # TODO : ini test file

if __name__ == '__main__':
    unittest.main()
