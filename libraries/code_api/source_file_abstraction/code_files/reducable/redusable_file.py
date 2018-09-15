# coding=utf-8

"""This module, compressable_file.py, provides an abstraction for files that can be compressed."""


class Redusable(object):
	"""Utility abstraction for files that have compression."""

	def __init__(self):
		self._compressed_file_size = None
