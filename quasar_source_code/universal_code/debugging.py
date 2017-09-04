# coding=utf-8

"""This module, debugging.py, will contain utility functions relating to debugging needs."""

# Used for printing to console in color.
# TODO : Make sure the Docker file has this required import.
from lazyme.string import color_print


def raise_type_exception(method_name, expected_type, val):
	"""Utility function for raising type errors."""
	raise TypeError('Method \'' + method_name + '\' expects a ' + str(expected_type) + ' instead of {' + str(val) + '} of type {' + str(type(val)) + '}!')


def raise_value_exception(method_name, expected_value_range, val):
	"""Utility function for raising value exceptions."""
	raise ValueError('Method \'' + method_name + '\' expects a value in range of{' + str(expected_value_range) + '} but got {' + str(val) + '} instead!')


def raise_abstract_method_call_exception(method_name):
	"""Utility function for raising an abstract method call exception."""
	raise NotImplementedError('Method \'' + method_name + '\' must be implemented by a child class to be ran!')

