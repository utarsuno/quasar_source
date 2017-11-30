# coding=utf-8

"""This module, universal_constants.py, is an abstraction to constant variables that should have the same key-values between all code including cross-language."""

PYTHON     = 'python'
JAVASCRIPT = 'javascript'


CONSTANT_TYPE_POST_URLS 	  = 'post_urls'
CONSTANT_TYPE_GLOBAL_VARIABLE = 'global_variable'


class UniversalConstant(object):
	"""Represents a global key-value to sync across the entire code base."""

	def __init__(self, name, raw_text, constant_type):
		self._constant_type = constant_type
		self._name          = name
		if self._constant_type == CONSTANT_TYPE_POST_URLS:
			self._value = {JAVASCRIPT: '\'/' + raw_text + '\'', PYTHON: 'r\'' + raw_text + '\''}
		elif self._constant_type == CONSTANT_TYPE_GLOBAL_VARIABLE:
			self._value = {JAVASCRIPT: 'ENTITY_PROPERTY_START_TOKEN + \'' + raw_text + '\';', PYTHON: 'ENTITY_PROPERTY_START_TOKEN + \'' + raw_text + '\''}

	def get_needed_value(self, line_of_code):
		"""Returns the value needed based on the line_of_code's language."""
		return self._value[line_of_code.language]

	@property
	def name(self) -> str:
		"""Returns the name of the key to the Universal Constant."""
		return self._name

	@property
	def value(self) -> str:
		"""Returns the value of this Universal Constant."""
		return self._value

	def __str__(self):
		return self._name + ' - ' + str(self._value)


class UniversalConstantGroup(object):
	"""Represents a common group of UniversalConstant objects."""

	def __init__(self, key_name_start_token, description, constant_type):
		self._constant_type		   = constant_type
		self._key_name_start_token = key_name_start_token
		#self._start_token          = 'UNIVERSAL_CONSTANTS_START : ' + description
		self._start_token          = description
		self._end_token            = 'UNIVERSAL_CONSTANTS_END'
		self._description          = description
		self._universal_constants  = []

	def verify(self, lines_of_code, is_eslint_file=False):
		"""Returns a boolean indicating if the lines of code match the universal constants group."""
		if len(lines_of_code) != len(self._universal_constants):
			print('Unmatched number of universal constants!')
			print(str(len(lines_of_code)) + ' to the needed ' + str(len(self._universal_constants)))
			#print(lines_of_code)
			for l in lines_of_code:
				print(l.text)
			return False
		else:
			for l in lines_of_code:
				if not self.verify_line_of_code(l, is_eslint_file):
					return False
			return True

	def verify_line_of_code(self, line_of_code, is_eslint_file=False) -> bool:
		"""Returns a boolean indicating if the text passed in is a variable universal constant."""
		if self._constant_type == CONSTANT_TYPE_POST_URLS:
			if not is_eslint_file:
				for uc in self._universal_constants:
					if uc.name in line_of_code.text:
						text_value = ''
						words = line_of_code.words
						if line_of_code.language == PYTHON:
							text_value = words[2]
						elif line_of_code.language == JAVASCRIPT:
							text_value = words[3].replace(';', '')

						needed_value = uc.get_needed_value(line_of_code)
						# Key is valid so now check if the value is valid as well.
						return text_value == needed_value
			else:
				# TODO : Eventually do syntax checking as well.

				# TODO : Eventually add auto column sorting as well.

				for uc in self._universal_constants:
					if uc.name in line_of_code.text:
						return True
				return False

		elif self._constant_type == CONSTANT_TYPE_GLOBAL_VARIABLE:
			if not is_eslint_file:
				for uc in self._universal_constants:
					if uc.name in line_of_code.text:
						words = line_of_code.words
						needed_value = uc.get_needed_value(line_of_code)

						if line_of_code.language == PYTHON:
							text_value = 'ENTITY_PROPERTY_START_TOKEN + ' + words[-1]
							return text_value == needed_value
						elif line_of_code.language == JAVASCRIPT:
							if words[1] == uc.name:
								if '\'ENTITY_PROPERTY_START_TOKEN\'' in words:
									text_value = words[3] + ' ' + words[4] + ' ' + words[5]
								else:
									text_value = 'ENTITY_PROPERTY_START_TOKEN + ' + words[-1]
								# Key is valid so now check if the value is valid as well.
								return text_value == needed_value
			else:
				# TODO : Eslint file support
				for uc in self._universal_constants:
					if uc.name in line_of_code.text:
						return True

		return False

	@property
	def start_token(self) -> str:
		"""Returns the string token that indicates the universal constant group is to be parsed."""
		return self._start_token

	@property
	def end_token(self) -> str:
		"""Returns the string token that indicates the universal constant group is to be end parsing here."""
		return self._end_token

	@property
	def description(self) -> str:
		"""Returns the description of this group of universal constants (as a string)."""
		return self._description

	def add_universal_constant(self, key, value):
		"""Adds a universal constant object to this group."""
		self._universal_constants.append(UniversalConstant(self._key_name_start_token + key, value, self._constant_type))

	def __str__(self):
		return 'UniversalConstantGroup : ' + self._description
