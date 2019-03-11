# coding=utf-8

"""This module, python_shell_script.py, provides an abstraction to creating Python programs ran as terminal scripts."""

import sys
from libraries.universal_code import output_coloring as oc
from libraries.universal_code import debugging as dbg


class ScriptArgument(object):
	"""Represents a passed in script argument."""

	def __init__(self, name, description, procedure, required=False):
		self.name        = name
		self.description = description
		self.procedure   = procedure
		self.required    = required

	def __str__(self):
		return 'ARG{' + self.name + '} - {' + self.description + '} - Required{' + str(self.required) + '}'


class PythonShellScript(object):
	"""Provides an abstraction to running Python as a shell script."""

	def __init__(self):
		self._arguments_passed_in            = sys.argv[1:]
		self._arguments_to_operations        = {}
		self._arguments_matched              = []
		self._number_of_required_args        = 0
		self._at_least_one_argument_required = False

	@property
	def at_least_one_argument_required(self):
		"""Returns a boolean indicating if at least one argument is required."""
		return self._at_least_one_argument_required

	@at_least_one_argument_required.setter
	def at_least_one_argument_required(self, is_required):
		"""Sets if at least one argument is required."""
		self._at_least_one_argument_required = is_required

	def add_argument(self, argument, description, procedure):
		"""Adds an argument and the function to run if that argument is provided."""
		self._arguments_to_operations[argument] = ScriptArgument(argument, description, procedure, False)

	def add_required_argument(self, argument, description, procedure):
		"""Adds a required argument and the function to run."""
		self._arguments_to_operations[argument] = ScriptArgument(argument, description, procedure, True)
		self._number_of_required_args += 1

	def print_required_arguments(self):
		"""Utility function."""
		for arg in self._arguments_to_operations:
			obj = self._arguments_to_operations[arg]
			if obj.required:
				oc.print_data_with_red_dashes_at_start(str(obj))

	def run(self):
		"""Runs this script's process."""
		matched_required_arguments = 0
		for arg in self._arguments_passed_in:
			if arg not in self._arguments_to_operations:
				dbg.raise_exception('The passed in argument {' + str(arg) + '} does not match!')
			obj = self._arguments_to_operations[arg]
			if obj.required:
				matched_required_arguments += 1
			self._arguments_matched.append(obj)

		if matched_required_arguments != self._number_of_required_args:
			self.print_required_arguments()
			dbg.raise_exception('At least one required argument was not passed in!')

		if self._at_least_one_argument_required and len(self._arguments_matched) == 0:
			self.print_required_arguments()
			dbg.raise_exception('At least one argument is required!')

		for operation in self._arguments_matched:
			operation.procedure()

'''
if __name__ == "__main__":
	script = <anInstanceOf>PythonShellScript()
	script.run()
'''
