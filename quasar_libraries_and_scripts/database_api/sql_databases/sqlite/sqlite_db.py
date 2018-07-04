# coding=utf-8

"""This module, sqlite_db.py, provides an abstraction to accessing a local sqlite_db."""


class SQLiteDB(object):
	"""Represents an SQLiteDB."""

	def __init__(self, db_file_path):
		self._db_file_path = db_file_path

