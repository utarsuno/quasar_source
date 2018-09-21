# coding=utf-8

"""This module, code_file.py, provides an abstraction to code files."""


from libraries.code_api.code_abstraction.code_chunk import CodeChunk
from libraries.universal_code import useful_file_operations as ufo


FILE_TYPE_SHELL_SCRIPT    = 'Shell'
FILE_TYPE_CSS             = 'CSS'
FILE_TYPE_JS              = 'JS'
FILE_TYPE_HTML            = 'HTML'
FILE_TYPE_PNG             = 'PNG'
FILE_TYPE_JPG             = 'JPG'
FILE_TYPE_SHADER_FRAGMENT = 'frag'
FILE_TYPE_SHADER_VERTEX   = 'vert'
FILE_TYPE_DOCKER_FILE     = 'Dockerfile'
FILE_TYPE_DOCKER_COMPOSE  = 'Docker-compose'
FILE_TYPE_CPP             = 'C++'
FILE_TYPE_HEADER          = 'Header'


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
	def file_size(self):
		"""Returns the file size of this file."""
		if self._file_size is None:
			self._file_size = ufo.file_get_size_in_bytes(self.full_path)
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
		"""Returns this file's file extension(s)."""
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
		ufo.file_op_create_or_override(self.full_path, file_text)
		
		self._file_size = ufo.file_get_size_in_bytes(self.full_path)

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
		self._sha256          = None
		self._md5sum          = None

	def replace_text(self, text_to_find, text_to_replace_with):
		"""Replaces text inside of this code file."""
		ufo.file_op_replace_text(self.full_path, text_to_find, text_to_replace_with)
		if self.contents_loaded:
			self.read_file_contents()

	def replace_line_from_text_match(self, text_to_match_in_line, line_to_replace_with):
		"""Replaces the matched line with the provided line to replace with."""
		ufo.file_op_replace_line_from_text_match(self.full_path, text_to_match_in_line, line_to_replace_with)
		if self.contents_loaded:
			self.read_file_contents()

	def read_file_contents(self):
		"""Reads in the contents of this file."""
		self._file_lines = ufo.file_get_contents_as_lines(self.full_path)
		self._file_size = ufo.file_get_size_in_bytes(self.full_path)
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

	@property
	def sha256(self):
		"""Returns the sha256 checksum of this file."""
		if self._sha256 is None:
			self._sha256 = ufo.file_get_sha256_checksm(self.full_path)
		return self._sha256

	@property
	def md5sum(self):
		"""Returns the md5sum of this file."""
		if self._md5sum is None:
			self._md5sum = ufo.file_get_md5_checksum(self.full_path)
		return self._md5sum

	@property
	def file_size(self):
		"""Returns the size in bytes for this file."""
		if self._file_size is None:
			self.read_file_contents()
		return self._file_size
