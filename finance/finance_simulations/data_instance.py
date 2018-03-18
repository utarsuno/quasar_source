# coding=utf-8

"""This module, data_instance.py, defines a class that represents a single data point."""

from universal_code import useful_file_operations as ufo


class DataInstance(object):
	"""Represents a single data instance."""

	def __init__(self, raw_data):
		self.unix_timestamp = ufo.get_file_basename(raw_data[0].flags[0])
		print(self.unix_timestamp)

		print('rest of the data is')
		self.raw_data = raw_data[1].split('|')
		for d in self.raw_data:
			print(d)
			print(str(type(d)))