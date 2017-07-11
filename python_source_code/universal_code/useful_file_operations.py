# coding=utf-8

"""This module, useful_file_operations, simply contains lots of functions for file + directory operations."""

# Needed for running regular expressions.
import re

# Thanks to stackoverflow for showing how to extract_basename : https://stackoverflow.com/questions/8384737/extract-file-name-from-path-no-matter-what-the-os-path-format


def extract_basename(path):
	"""Extracts the basename of the provided path."""
	basename = re.search(r'[^\\/]+(?=[\\/]?$)', path)
	if basename:
		return basename.group(0)
