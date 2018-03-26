# coding=utf-8

"""This module, code_file.py, provides an abstraction to code files."""


from code_api.code_abstraction.code_chunk import CodeChunk
from universal_code import useful_file_operations as ufo


CODE_FILE_TYPE_SHELL_SCRIPT = 'Shell'
CODE_FILE_TYPE_CSS_FILE     = 'CSS'
CODE_FILE_TYPE_JS_FILE      = 'JS'
CODE_FILE_TYPE_HTML_FILE    = 'HTML'
CODE_FILE_TYPE_ASSET_PNG    = 'PNG'
CODE_FILE_TYPE_ASSET_JPG    = 'JPG'


class CodeFile(object):
	"""Represents a single code file."""

	def __init__(self, file_type, file_name, file_extension=None):
		self._file_type             = file_type
		self._file_name             = file_name
		self._parent_code_directory = None
		self._file_extension        = file_extension
		self._file_size             = None

		self._temp_utility_file_lines = None

	def set_parent_code_directory(self, code_directory):
		"""Sets this code file's code directory that it resides in."""
		self._parent_code_directory = code_directory

	def __str__(self):
		if self._file_type is None:
			return 'CodeFile:' + self.file_name
		else:
			return self._file_type + ':' + self._file_name

	@property
	def get_number_of_code_lines(self):
		"""TODO: Eventually extend this method."""
		if self._temp_utility_file_lines is None:
			self._temp_utility_file_lines = ufo.get_file_content(self.full_path)

		# TODO : Eventually don't count code comments!

		number_of_lines = 0
		for l in self._temp_utility_file_lines:
			if len(l.replace('\n', '')) > 0:
				number_of_lines += 1
		return number_of_lines

	@property
	def file_size(self):
		"""Returns the file size of this file."""
		if self._file_size is None:
			self._file_size = ufo.get_file_size_in_bytes(self.full_path)
		return self._file_size

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
		return self._parent_code_directory.directory_path + self._file_name + str(self._file_extension)

	@property
	def file_extension(self) -> str:
		"""Returns this file's file extension."""
		return self._file_extension


class GeneratedCodeFile(CodeFile):
	"""Represents a code file that gets generated."""

	def __init__(self, file_type, file_name, file_extension=None):
		super().__init__(file_type, file_name, file_extension)
		self._code_sections = []

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
		file_text = ''
		all_file_code = self.file_code
		for line in all_file_code:
			file_text += line
		ufo.create_file_or_override(file_text, self.full_path)
		
		self._file_size = ufo.get_file_size_in_bytes(self.full_path)

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


class LoadedCodeFile(CodeFile):
	"""Represents a code file that gets loaded."""

	def __init__(self, file_type, file_name, file_extension=None):
		super().__init__(file_type, file_name, file_extension)
		self._contents_loaded = False
		self._file_lines      = []

	def read_file_contents(self):
		"""Reads in the contents of this file."""
		self._file_lines = ufo.get_file_content(self.full_path)
		self._file_size = ufo.get_file_size_in_bytes(self.full_path)
		self._contents_loaded = True

	@property
	def contents(self) -> list:
		"""Returns a list of strings representing the file contents."""
		if not self.contents_loaded:
			self.read_file_contents()
		return self._file_lines

	@property
	def contents_as_string(self) -> str:
		"""Returns the contents of this file as a single string."""
		lines = self.contents
		raw_text = ''
		for l in lines:
			raw_text += l
		return raw_text

	@property
	def contents_loaded(self) -> bool:
		"""Returns a boolean indicating if this file has been loaded."""
		return self._contents_loaded
