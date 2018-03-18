# coding=utf-8

"""This module, data_instance.py, defines a class that represents a single data point."""


class DataInstance(object):
	"""Represents a single data instance."""

	def __init__(self, raw_data):
		print('The raw data is :')
		print(raw_data)

		self.unix_timestamp = raw_data[0].flags[0]
		print(self.unix_timestamp)

		print('rest of the data is')
		print(raw_data[1])
