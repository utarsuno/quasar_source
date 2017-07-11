# coding=utf-8

"""This module, useful_file_operations_tests.py, contains the unit tests for the 'useful_file_operations.py' module."""

# Test the following module.
import unittest

from python_source_code.universal_code import useful_file_operations as ufo


# Thanks to stackoverflow for showing how to extract_basename : https://stackoverflow.com/questions/8384737/extract-file-name-from-path-no-matter-what-the-os-path-format


class UsefulFileOperationsTestSuite(unittest.TestCase):

    def test_extract_basename_simple_paths(self):
        self.assertEqual(ufo.extract_basename('a/b/c/')          , 'c')
        self.assertEqual(ufo.extract_basename('a/b/c')           , 'c')
        self.assertEqual(ufo.extract_basename('\\a\\b\\c')       , 'c')
        self.assertEqual(ufo.extract_basename('\\a\\b\\c\\')     , 'c')
        self.assertEqual(ufo.extract_basename('a\\b\\c')         , 'c')
        self.assertEqual(ufo.extract_basename('a/b/../../a/b/c/'), 'c')
        self.assertEqual(ufo.extract_basename('a/b/../../a/b/c') , 'c')

    def test_extract_basename_extra_paths(self):
        self.assertEqual(ufo.extract_basename('C:\\')                , 'C:')
        self.assertEqual(ufo.extract_basename('alone')               , 'alone')
        self.assertEqual(ufo.extract_basename('/a/space in filename'), 'space in filename')
        self.assertEqual(ufo.extract_basename('C:\\multi\nline')     , 'multi\nline')

