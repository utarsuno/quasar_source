# coding=utf-8

"""This module, program_arguments.py, abstracts matching program arguments passed in,"""

import sys
from libraries.universal_code import debugging as dbg

_INDEX_OF_ARG_DESCRIPTION = 0
_INDEX_OF_ARG_IS_REQUIRED = 1


class ProgramArguments(object):
	"""Abstraction to the system arguments passed in."""

	def __init__(self):
		self._args = sys.argv[1:]
		self._expectable_arguments = {}

	def __len__(self):
		return len(self._args)

	def add_expectable_argument(self, arg_name, arg_description, arg_is_required):
		"""Adds an expectable argument that can then be checked for."""
		self._expectable_arguments[arg_name] = [arg_description, arg_is_required]

	def check_if_needed_arguments_passed_in(self):
		"""Throws an exception if all needed arguments are not passed in."""
		for expected_arg in self._expectable_arguments:
			if self._expectable_arguments[expected_arg][_INDEX_OF_ARG_IS_REQUIRED]:
				if expected_arg not in self._args:
					dbg.raise_exception('The expected arg{' + expected_arg + '} used for {' + self._expectable_arguments[expected_arg][_INDEX_OF_ARG_DESCRIPTION] + '} was not found provided!')

	def print_args(self):
		"""Prints the arguments passed to the program."""
		for a in self._args:
			print('Argument {' + str(a) + '}')

	def get_first_argument(self):
		"""Returns the first argument passed in."""
		if len(self._args) < 1:
			dbg.raise_exception('Require at least argument to be passed in!')
		return self._args[0]



#for i in sys.argv:
#	print('ARGUMENT PASSED IN')
#	print(i)
