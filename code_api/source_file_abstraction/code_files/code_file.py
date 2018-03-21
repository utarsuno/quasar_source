# coding=utf-8

"""This module, code_file.py, provides an abstraction to code files."""


from code_api.code_abstraction.code_chunk import CodeChunk
from universal_code import useful_file_operations as ufo


CODE_FILE_TYPE_SHELL_SCRIPT = 'shell_script'


class CodeFile(object):
	"""Represents a single code file."""

	def __init__(self, file_type, file_name):
		self._file_type = file_type
		self._file_name = file_name
		self._parent_code_directory = None
		self._file_extension = '{EXTENSION_MISSING}'
		self._code_sections = []

	def set_parent_code_directory(self, code_directory):
		"""Sets this code file's code directory that it resides in."""
		self._parent_code_directory = code_directory

	def add_code_section(self, code_section):
		"""Adds a new code section at the bottom of the current code sections."""
		self._code_sections.append(code_section)

	def get_code_section(self, section_name):
		"""Returns a code section by section name."""
		for cs in self._code_sections:
			if cs.name == section_name:
				return cs

	def create_or_update_file(self):
		"""Creates or updates the physical file that this code file represents."""
		# create_or_update_file
		file_text = ''
		all_file_code = self.file_code
		for line in all_file_code:
			file_text += line
		ufo.create_file_or_override(file_text, self.full_path)

	@property
	def file_name_with_extension(self) -> str:
		"""Returns this code file's file name with extension included."""
		return self._file_name + self._file_extension

	@property
	def file_name(self) -> str:
		"""Returns this code file's file name, note: no file extension is included."""
		return self._file_name

	@property
	def full_path(self) -> str:
		"""Returns the full path to this code file."""
		return self._parent_code_directory.directory_path + self._file_name + self._file_extension

	@property
	def file_code(self) -> list:
		"""Returns a list of strings representing this file's source code."""
		all_lines = []
		for code_section in self._code_sections:
			sub_code_chunks = code_section.get_all_code_chunks()
			for code_chunk in sub_code_chunks:
				sub_lines = code_chunk.lines_of_code
				for line in sub_lines:
					all_lines.append(line)
		return all_lines
