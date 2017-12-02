# coding=utf-8

"""
This module, file_modifier.py, is used for modifying files.
"""

import tempfile

# CREDITS TO THE ORIGINAL AUTHOR :
# From a stackoverflow search : http://stackoverflow.com/questions/125703/how-do-i-modify-a-text-file-in-python
# author of the following (original) code : ananth krishnan
# Modifications have been made and will continue to be made onto this file though.


class FileModifierError(Exception):
	"""Just a custom utility exception.
	"""
	pass


class FileModifier(object):
	"""A utility class to modify files.
	"""

	def __init__(self, file_name):
		self.__write_dict     = {}
		self.__file_name      = file_name
		self.__temporary_file = tempfile.TemporaryFile()
		with open(file_name, 'rb') as file_handler:
			for line in file_handler:
				self.__temporary_file.write(line)
		self.__temporary_file.seek(0)

	def write(self, text, line_number='END'):
		"""This will write in a line at the specified line, the last line will be used by default if the line_number parameter is not passed in.
		:param text: The text to write.
		:param line_number: The line number to put this text at.
		:return: Void.
		"""
		if line_number != 'END' and not isinstance(line_number, (int, float)):
			raise FileModifierError('Line number %s is not a valid number' % line_number)
		try:
			self.__write_dict[line_number].append(text)
		except KeyError:
			self.__write_dict[line_number] = [text]

	def write_line(self, text, line_number='END'):
		"""This will write a line.
		:param text: The text to write.
		:param line_number: The line to insert at.
		:return: Void.
		"""
		self.write('%s\n' % text, line_number)

	def __pop_line(self, index, file_pointer):
		"""This function will pop a line.
		:param index: The line to pop.
		:param file_pointer: The file to work with.
		:return: Void.
		"""
		try:
			ilines = self.__write_dict.pop(index)
			for line in ilines:
				file_pointer.write(line)
		except KeyError:
			pass

	def close(self):
		"""Close the file.
		:return: Void.
		"""
		self.__exit__(None, None, None)

	def __enter__(self):
		"""TODO: Learn what this does.
		:return: Void.
		"""
		return self

	def __exit__(self, type, value, traceback):
		with open(self.__file_name, 'w') as file_pointer:
			for index, line in enumerate(self.__temporary_file.readlines()):
				self.__pop_line(index, file_pointer)
				file_pointer.write(line.decode('ascii'))
			for index in sorted(self.__write_dict):
				for line in self.__write_dict[index]:
					file_pointer.write(line)
		self.__temporary_file.close()

