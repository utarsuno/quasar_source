# coding=utf-8

"""This module, code_file.py, provides an abstraction to code files."""


from code_api.code_abstraction.code_chunk import CodeChunk
from universal_code import useful_file_operations as ufo


CODE_FILE_TYPE_SHELL_SCRIPT = 'shell_script'
CODE_FILE_TYPE_CSS_FILE     = 'css_file'
CODE_FILE_TYPE_JS_FILE      = 'js_file'
CODE_FILE_TYPE_HTML_FILE    = 'html_file'
CODE_FILE_TYPE_ASSET_PNG    = 'png_file'


class CodeFile(object):
	"""Represents a single code file."""

	def __init__(self, file_type, file_name, file_extension=None):
		self._file_type             = file_type
		self._file_name             = file_name
		self._parent_code_directory = None
		self._file_extension        = file_extension
		self._file_size             = None

	def set_parent_code_directory(self, code_directory):
		"""Sets this code file's code directory that it resides in."""
		self._parent_code_directory = code_directory

	def __str__(self):
		return 'CodeFile:' + self.file_name

	@property
	def file_size(self):
		"""Returns the file size of this file."""
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
	def contents_loaded(self) -> bool:
		"""Returns a boolean indicating if this file has been loaded."""
		return self._contents_loaded


class Compressable(object):
	"""Utility abstraction for files that have compression."""

	def __init__(self, code_file, compression_function, non_existing_file=False):
		self._compressed_file_size = None
		self._compressed_text = None
		self._code_file = code_file
		self._compression_function = compression_function
		self._non_existing_file = non_existing_file

	def generate_minified_file(self):
		"""Generates the minified version of this file."""
		if self._compressed_text is None:
			self._created_minifed_text()
		save_path = self._code_file.full_path.replace(self._code_file.file_extension, '.min' + self._code_file.file_extension)
		ufo.create_file_or_override(self._compressed_text, save_path)

		self._compressed_file_size = ufo.get_file_size_in_bytes(save_path)

	def _created_minifed_text(self):
		"""Creates the minified text."""
		raw_text = ''
		if self._non_existing_file:
			for l in self._code_file.file_code:
				raw_text += l
		else:
			if not self._code_file.contents_loaded:
				self._code_file.read_file_contents()
			for l in self._code_file._file_lines:
				raw_text += l
		self._compressed_text = self._compression_function(raw_text)

	@property
	def compressed_file_size(self):
		"""Returns the compressed file size of the minified CSS file."""
		return self._compressed_file_size

	@property
	def percent_compressed(self):
		"""Returns the % amount saved from compression."""
		return (1.0 - float(self._compressed_file_size) / float(self._code_file.file_size)) * 100.0

	@property
	def compression_statistics(self):
		"""Returns the compression statistics."""
		return 'compressed{' + str(self._code_file) + '} - {' + str(self._code_file.file_size) + 'b to ' + str(self.compressed_file_size) + 'b} reduction of ' + str(self.percent_compressed) + '%'

