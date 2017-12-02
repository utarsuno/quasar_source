# -*- coding: ascii -*-

"""
This module, code_file.py, is used for generating and maintaining code files.
"""

# Import our custom library for debugging utilities.
from universal_code import debugging as dbg
from universal_code import anything_time_related as atr
import datetime

from code_manager.code_generator_support import fancy_comments

KEYWORDS_IN_USE_ALL = [' = CFL(', ' = CFS(']

library_nickname_mapping = {'CFS' : 'from code_manager.abstract_definitions.code_file import ScriptFile as CFS',
                            'CFL' : 'from code_manager.abstract_definitions.code_file import LibraryFile as CFL'}

PYTHON_LIBRARY_DOCUMENTATION = '''| #-- | Section ----------------- | Description-------------------------------------------
| 0x0 | Libraries                 | All code needed for 3rd party code setup.            |
| 0x1 | Global Resources          | All code and variables that are accessed globally.   |
| 0x2 | Classes                   | Most classes will be defined here.                   |
------------------------------------------------------------------------------------------'''

PYTHON_SCRIPT_DOCUMENTATION = '''| #-- | Section ----------------- | Description-------------------------------------------
| 0x0 | Libraries                 | All code needed for 3rd party code setup.            |
| 0x1 | Global Resources          | All code and variables that are accessed globally.   |
| 0x2 | Classes                   | Most classes will be defined here.                   |
| 0x3 | Code Content              | The actual logic of this script.                     |
------------------------------------------------------------------------------------------'''


def get_current_date_and_time():
	"""Utility function to return date and time.
	:return: The current date and time as a string.
	"""
	now = str(datetime.datetime.now())
	return now[0:now.rfind(':') + 3]


def get_alphabetic_name(variable):
	"""Just a utility function for alphabetic sorting.
	:param variable: The variable to work with.
	:return: The name of the variable.
	"""
	return variable.get_name()


class CodeFile:
	"""
	A representation of a single Python code file.
	"""

	def __init__(self, file_documentation):
		self._name                   = ''
		self._file_name              = '' + '.py'
		self._file_documentation     = file_documentation
		self._file_text              = ''
		self._libraries              = []
		self._classes                = []
		self._global_variable_chunks = []
		self._global_variables       = []
		self._global_functions       = []
		self._script_code            = []
		self._length_of_longest_line = 100

	def set_length_of_longest_line(self, length):
		"""Records the length of the longest line in this code file.
		:param length: The length to record down.
		:return: Void.
		"""
		self._length_of_longest_line = length

	def set_name(self, name):
		"""Sets the name of this code_file and the file_name.
		:param name: The name of the file.
		:return: Void.
		"""
		if name.endswith('.py'):
			self._name = name[:-2]
			self._file_name = name
		else:
			self._name = name
			self._file_name = name + '.py'

	def create_physical_file_in_specified_output(self, output_path):
		"""Just for testing.
		:return: Void.
		"""
		# Lazy fix for formatting problems (specifically with too many empty lines).
		file_text = ''
		number_of_blank_lines = 0

		all_lines = str(self).split('\n')
		formatted_lines = []

		for line in all_lines:
			text_to_add = line.replace('\t', '    ')
			if (text_to_add.startswith('def') and 'self' not in text_to_add) or (text_to_add.startswith('class')):

				if number_of_blank_lines > 2:
					number_of_empty_lines_to_remove = number_of_blank_lines - 2
					index = 0
					while index < number_of_empty_lines_to_remove:
						file_text = file_text[0:len(file_text) - 1]
						formatted_lines.pop()
						index += 1
				elif number_of_blank_lines < 2:
					number_of_empty_lines_to_add = 2 - number_of_blank_lines
					index = 0
					while index < number_of_empty_lines_to_add:
						formatted_lines.append('\n')
						index += 1
			elif text_to_add.lstrip().startswith('def') and 'self' in text_to_add:

				if number_of_blank_lines > 1:
					number_of_empty_lines_to_remove = number_of_blank_lines - 1
					index = 0
					while index  < number_of_empty_lines_to_remove:
						file_text = file_text[0:len(file_text) - 1]
						formatted_lines.pop()
						index += 1

			if len(text_to_add.strip()) == 0:
				number_of_blank_lines += 1
			else:
				number_of_blank_lines = 0

			file_text += text_to_add
			formatted_lines.append(text_to_add + '\n')

		with open(output_path, 'w') as file_handler:
			for fl in formatted_lines:
				if ' ### ' in fl:
					file_handler.write((fl[0:fl.index(' ### ')] + '\n').replace('\t', '    '))
				else:
					file_handler.write(fl.replace('\t', '    '))

	def add_variable_chunk(self, variables):
		"""Adds a global variable chunk to this code file.
		:param variables: The global variable chunk to add.
		:return: Void.
		"""
		self._global_variable_chunks.append(variables)

	def add_global_variable(self, variable):
		"""Adds a global variable to this code file.
		:param variable: The variable to add.
		:return: Void.
		"""
		self._global_variables.append(variable)

	def add_function(self, function):
		"""Adds a global function to this code file.
		:param function: The global function to add.
		:return: Void.
		"""
		self._global_functions.append(function)

	def add_library(self, library):
		"""Adds a library to this code file.
		:param library: The library to add.
		:return: Void.
		"""
		self._libraries.append(library)

	def add_class(self, class_to_add):
		"""Adds a class to this code file.
		:param class_to_add: The class to add to this code file.
		:return: Void.
		"""
		self._classes.append(class_to_add)

	def add_script_code(self, script_to_add):
		"""Adds a script code to this code file.
		:param script_to_add: The script to add.
		:return: Void.
		"""
		if isinstance(self, LibraryFile):
			dbg.terminate('A library file can not receive script code! That\'s what makes it a library!')
		self._script_code.append(script_to_add)

	def __str__(self):
		self._file_text += '# -*- coding: ascii -*-\n\n' # Specifies the source encoding.

		# If 0 then we are working with a library.
		if len(self._script_code) == 0:
			self._file_text += '"""This module, ' + self._file_name + ', ' + self._file_documentation + '\n' 'last generated : ' + get_current_date_and_time() + '\n' + PYTHON_LIBRARY_DOCUMENTATION + '\n"""\n'
		else:
			self._file_text += '"""This module, ' + self._file_name + ', ' + self._file_documentation + '\n' 'last generated : ' + get_current_date_and_time() + '\n' + PYTHON_SCRIPT_DOCUMENTATION + '\n"""\n'

		# Now add any libraries.
		self._file_text += fancy_comments.get_comment_divider('Libraries', self._length_of_longest_line)
		for l in sorted(self._libraries, key=get_alphabetic_name):
			self._file_text += str(l) + '\n'

		# Now add any global variables and functions.
		self._file_text += fancy_comments.get_comment_divider('Global Resources', self._length_of_longest_line)
		for vc in self._global_variable_chunks:
			self._file_text += str(vc) + '\n'
		for v in self._global_variables:
			self._file_text += str(v) + '\n'
		for f in self._global_functions:
			self._file_text += '\n\n' + str(f) + '\n'

		# Now add any classes.
		self._file_text += fancy_comments.get_comment_divider('Core Classes', self._length_of_longest_line)
		for c in self._classes:
			self._file_text += '\n' + str(c)

		# Now add the actual code content if there is any.
		if len(self._script_code) > 0:
			self._file_text += fancy_comments.get_comment_divider('Code Content', self._length_of_longest_line)
			for s in self._script_code:
				self._file_text += '\n' + str(s)

		# Now end the file.
		self._file_text += fancy_comments.get_comment_divider('End of File', self._length_of_longest_line, 'E')

		return self._file_text


class LibraryFile(CodeFile):
	"""An instance of CodeFile that is specifically a library. Just exists to be IDE syntax.
	"""


class ScriptFile(CodeFile):
	"""An instance of CodeFile that is specifically a script. Just exists to be IDE syntax.
	"""


