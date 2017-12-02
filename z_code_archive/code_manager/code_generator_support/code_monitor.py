# coding=utf-8

"""
This module, code_monitor.py, will monitor for changes in text files.
"""

import os
from os import listdir
from os.path import isfile, join
from time import sleep

from code_manager.code_generator_support import code_generator_compiler
from code_manager.code_generator_support import generator_parser

base = '/Users/utarsuno/git_repos/urbtek/urbtek/code_manager/'
abstract_definitions_path           = base + 'abstract_definitions'
code_generation_projects_path       = base + 'code_generation_projects/'
#code_monitors_path                  = base + 'code_monitor'
abstract_definitions_generator_path = code_generation_projects_path + 'abstract_definitions_generator/'
temporary_output_path               = code_generation_projects_path + 'temporary_output/'
urbtek_generator_path               = code_generation_projects_path + 'urbtek_generator/'
code_generator_compiler_path        = base + 'code_generator_compiler'
miscellaneous_scripts_path          = base + 'miscellaneous_scripts'


class FileMonitor(object):
	"""Each instance monitors one file.
	"""

	def __init__(self, file_path):
		self._cached_stamp              = 0
		self._file_path                 = file_path
		self._seconds_since_last_change = 0
		self._could_run_a_generation    = False

	def file_has_changed(self):
		"""Check if the file has changed.
		:return: Void.
		"""
		stamp = os.stat(self._file_path).st_mtime
		if stamp != self._cached_stamp:
			self._cached_stamp = stamp
			return True
		return False

all_files_in_urbtek_generator = [f for f in listdir(urbtek_generator_path) if isfile(join(urbtek_generator_path, f))]
all_files_in_urbtek_generator.remove('__init__.py')
all_files_in_abstract_definitions_generator = [f for f in listdir(abstract_definitions_generator_path) if isfile(join(abstract_definitions_generator_path, f))]
all_files_in_abstract_definitions_generator.remove('__init__.py')

file_monitors = []
for f in all_files_in_urbtek_generator:
	file_monitors.append(FileMonitor(urbtek_generator_path + f))
for f in all_files_in_abstract_definitions_generator:
	file_monitors.append(FileMonitor(abstract_definitions_generator_path + f))

# Set the initial values.
for fm in file_monitors:
	fm.file_has_changed()

# TODO: This is NOT the best way to do this, just a quick solution for now.

try:
	while 1:
		for fm in file_monitors:
			if fm.file_has_changed():
				#print('The file has changed! This is for : ' + fm._file_path)
				fm._seconds_since_last_change = 0
				fm._could_run_a_generation = True
			else:
				fm._seconds_since_last_change += .1
				if fm._seconds_since_last_change > .3 and fm._could_run_a_generation:
					fm._could_run_a_generation = False

					# First fix/apply any changes needed from the parse.
					generator_parser.parse_generator_file(fm._file_path)

					# TODO : Pass information from what the parser already parsed to the compiler. (Note: it will probably be easier to create the compiler from scratch first).

					# Now run the compilation step.
					code_generator_compiler.compile_a_generation_file(fm._file_path)
		sleep(.1)
except KeyboardInterrupt:
	print('Code monitor terminated by keyboard interrupt.')
