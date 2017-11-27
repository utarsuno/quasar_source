# coding=utf-8

"""This module, code_file.py, represents an abstraction layer to a file of code."""

from code_api import lines_of_code as loc
from quasar_source_code.universal_code import useful_file_operations as ufo
# Current 3rd party used to handle minification.
from jsmin import jsmin
from quasar_source_code.universal_code import debugging as dbg

from lazyme.string import color_print


PYTHON       = 'python'
JAVASCRIPT   = 'javascript'
SHELL_SCRIPT = 'shell_script'


class CodeFile(object):
	"""Represents a single file that contains lines of code."""

	def __init__(self, file_path, already_exists=True):
		self._file_path = file_path
		self._already_exists = already_exists
		if already_exists:
			self._file_name = ufo.get_file_basename(self._file_path)
			self._file_size = ufo.get_file_size_in_bytes(self._file_path)
			self._lines_of_code = loc.get_lines_of_code_from_file(self._file_path)
		else:
			self._file_size = None
			self._lines_of_code = []

		# Gets set by child objects.
		self._language = None

	def _get_code_lines_for_universal_constant_group(self, start_text, end_text):
		"""Returns a list of LineOfCode objects representing the universal constant group."""
		#code_lines = []
		start_index = -1
		end_index = -1
		for i, l in enumerate(self._lines_of_code):
			if start_text in l.text:
				start_index = i
			elif end_text in l.text:
				end_index = i
				break
		return self._lines_of_code[start_index:end_index + 1]

	def sync_for(self, universal_constant_group):
		"""Syncs this code file with the provided universal constant group."""
		lines_of_code = self._get_code_lines_for_universal_constant_group(universal_constant_group.start_token, universal_constant_group.end_token)

		# Inspect the specific universal variables.
		universal_variables = lines_of_code[1:-1]

		if not universal_constant_group.verify(universal_variables):
			color_print('TODO Fixing [' + self._file_name + ']\'s universal_variables for {' + str(universal_constant_group) + '}', color='red')
			# TODO : Add automatic fixing

	def has_text(self, text_to_search_for) -> bool:
		"""Returns a boolean value of true if the text was found in the code file."""
		for l in self._lines_of_code:
			if text_to_search_for in l.text:
				return True
		return False

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

	# Function for child objects.
	def _apply_language_and_set_data(self):
		"""Sends the language of this code file to the LineOfCode objects. (As well as other information)."""
		if self._already_exists:
			for l in self._lines_of_code:
				l.set_langauge_and_other_data(self._language, self)


class CodeFileShellScript(CodeFile):
	"""Represents a single shell script file."""

	def __init__(self, file_path, already_exists=True):
		super().__init__(file_path, already_exists)
		self._extension = '.sh'
		self._language = SHELL_SCRIPT
		self._apply_language_and_set_data()


class CodeFilePython(CodeFile):
	"""Represents a single Python file."""

	def __init__(self, file_path, already_exists=True):
		super().__init__(file_path, already_exists)
		self._extension = '.py'
		self._language = PYTHON
		self._apply_language_and_set_data()


class CodeFileJavaScript(CodeFile):
	"""Represents a single JavaScript file."""

	def __init__(self, file_path, already_exists=True):
		super().__init__(file_path, already_exists)
		self._extension = '.js'
		self._language = JAVASCRIPT
		self._apply_language_and_set_data()

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
