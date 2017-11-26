# coding=utf-8

"""This module, code_file.py, represents an abstraction layer to a file of code."""

from code_api import lines_of_code as loc
from quasar_source_code.universal_code import useful_file_operations as ufo
# Current 3rd party used to handle minification.
from jsmin import jsmin
from quasar_source_code.universal_code import debugging as dbg


class CodeFileManager(object):
	"""Represents a common group of code files."""

	def __init__(self, code_files):
		self._code_files = code_files

	def get_code_file_by_name(self, file_name):
		"""Returns a CodeFile object if found."""
		for f in self._code_files:
			if file_name in f.file_path:
				return f
		return None

	def get_total_size(self) -> int:
		"""Returns the total size of all the code files as bytes."""
		total_size = 0
		for f in self._code_files:
			total_size += f.file_size
		return total_size

	def get_total_lines_of_code(self) -> int:
		"""Returns the total number of lines of codes."""
		lines_of_code = 0
		for f in self._code_files:
			lines_of_code += f.lines_of_code
		return lines_of_code

	@property
	def number_of_files(self) -> int:
		"""Returns the number of files this manager has."""
		return len(self._code_files)

	def print_data(self):
		"""Prints all relevant data."""
		print('There are ' + str(self.number_of_files) + ' files.')
		print('With ' + str(self.get_total_lines_of_code()) + ' lines of code for a total size of ' + str(self.get_total_size()) + ' bytes.')
		#print('Printing all the code files!')
		#for f in self._code_files:
		#	print(f)


class CodeFile(object):
	"""Represents a single file that contains lines of code."""

	def __init__(self, file_path, already_exists=True):
		self._file_path = file_path
		if already_exists:
			self._file_name = ufo.get_file_basename(self._file_path)
			self._file_size = ufo.get_file_size_in_bytes(self._file_path)
			self._lines_of_code = loc.get_lines_of_code_from_file(self._file_path)
		else:
			self._file_size = None
			self._lines_of_code = []

	def add_line(self, text):
		"""Adds a singles line of code to the CodeFile."""
		if not text.endswith('\n'):
			text += '\n'
		self._lines_of_code.append(loc.LineOfCode(text))

	def get_text(self):
		"""Returns all the text for this code file."""
		text = ''
		for l in self._lines_of_code:
			text += l.text
		return text

	@property
	def file_path(self) -> str:
		"""Returns the file path to this file."""
		return self._file_path

	@property
	def file_name(self) -> str:
		"""Returns the name of this file."""
		return self._file_name

	@property
	def file_size(self) -> int:
		"""Returns the size of this file in bytes."""
		if self._file_size is None:
			self._file_size = ufo.get_file_size_in_bytes(self._file_path)
		return self._file_size

	@property
	def lines_of_code(self) -> int:
		"""Returns the number of lines of code in this file."""
		number_of_lines = 0
		for l in self._lines_of_code:
			if not l.is_blank_line():
				number_of_lines += 1
		return number_of_lines

	def __str__(self):
		return self._file_name + ' - [' + str(self.lines_of_code) + ' \'lines of code\'].'


class CodeFileShellScript(CodeFile):
	"""Represents a single shell script file."""

	def __init__(self, file_path, already_exists=True):
		super().__init__(file_path, already_exists)
		self._extension = '.sh'


class CodeFilePython(CodeFile):
	"""Represents a single Python file."""

	def __init__(self, file_path, already_exists=True):
		super().__init__(file_path, already_exists)
		self._extension = '.py'


class CodeFileJavaScript(CodeFile):
	"""Represents a single JavaScript file."""

	def __init__(self, file_path, already_exists=True):
		super().__init__(file_path, already_exists)
		self._extension = '.js'

	def _get_production_text(self):
		"""Returns all the text for this code file."""
		# TODO : Refactor this method later (its not efficient)

		code_lines = []

		currently_in_dev_start = False

		line_chunks_to_remove = []

		current_chuck_start = -1

		for i, l in enumerate(self._lines_of_code):
			if '// FOR_DEV_START' in l.text:
				if currently_in_dev_start:
					dbg.raise_exception('FOR_DEV_START without a FOR_DEV_END first!')
				currently_in_dev_start = True
				current_chuck_start = i
			elif '// FOR_DEV_END' in l.text:
				if currently_in_dev_start:
					currently_in_dev_start = False
					line_chunks_to_remove.append([current_chuck_start, i])
					current_chuck_start = -1
				else:
					dbg.raise_exception('FOR_DEV_END without a FOR_DEV_START first!')

			code_lines.append(l)

		code_lines_to_remove = []

		if len(line_chunks_to_remove) > 0:
			#print(len(code_lines))
			#print(line_chunks_to_remove)
			for lc in line_chunks_to_remove:
				start = lc[0]
				end   = lc[1]
				x = 0
				while x < end - start + 1:
					code_lines_to_remove.append(code_lines[start + x])
					#print(code_lines[start + x].text, end='')
					x += 1

		for cltr in code_lines_to_remove:
			code_lines.remove(cltr)

		return code_lines

	def get_minified_production_javascript_text(self):
		"""Gets the minified version of the Javascript file provided."""
		text = ''
		production_lines = self._get_production_text()
		for cl in production_lines:
			text += cl.text
		return self.get_minified_javascript_text(text)

	def get_minified_javascript_text(self, text=None):
		"""Gets the minified version of the Javascript file provided."""
		if text is None:
			with open(self._file_path) as js_file:
				return jsmin(js_file.read())
		else:
			return jsmin(text)

	def create_minified_version(self, file_path):
		"""Creates the minified version of this Javascript file."""
		ufo.create_file_or_override(self.get_minified_javascript_text(), file_path)

	def create_file_and_minify(self):
		"""Creates a minified version of the file."""
		ufo.create_file_or_override(self.get_text(), self._file_path)
		self.create_minified_version(self._file_path)
