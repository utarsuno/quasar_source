# coding=utf-8

"""This module, program_arguments.py, abstracts matching program arguments passed in,"""

import sys
from quasar_libraries_and_scripts.universal_code import debugging as dbg


class SystemArguments(object):
	"""Abstraction to the system arguments passed in."""

	def __init__(self):
		self._args = sys.argv

	def print_args(self):
		"""Prints the arguments passed to the program."""
		for a in self._args:
			print('Argument {' + str(a) + '}')

	def get_first_argument(self):
		"""Returns the first argument passed in."""
		if len(self._args) < 2:
			dbg.raise_exception('Require at least argument to be passed in!')
		return self._args[1]

#for i in sys.argv:
#	print('ARGUMENT PASSED IN')
#	print(i)
