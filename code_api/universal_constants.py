# coding=utf-8

"""This module, universal_constants.py, is an abstraction to constant variables that should have the same key-values between all code including cross-language."""

PYTHON     = 'python'
JAVASCRIPT = 'javascript'


class UniversalConstant(object):
	"""Represents a global key-value to sync across the entire code base."""

	def __init__(self, name, value):
		self._name  = name
		self._value = value

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

	def __init__(self, key_name_start_token, description):
		self._key_name_start_token = key_name_start_token
		self._start_token          = 'UNIVERSAL_CONSTANTS_START : ' + description
		self._end_token            = 'UNIVERSAL_CONSTANTS_END'
		self._description          = description
		self._universal_constants  = []

	def verify(self, lines_of_code):
		"""Returns a boolean indicating if the lines of code match the universal constants group."""
		if len(lines_of_code) < len(self._universal_constants):
			return False
		else:
			for l in lines_of_code:
				if not self.verify_line_of_code(l):
					return False
			return True

	def verify_line_of_code(self, line_of_code) -> bool:
		"""Returns a boolean indicating if the text passed in is a variable universal constant."""
		for uc in self._universal_constants:
			if uc.name in line_of_code.text:

				text_value = line_of_code.text[line_of_code.text.index(' = ') + 3:].strip().replace(';', '')
				needed_value = uc.get_needed_value(line_of_code)

				if '\'' not in needed_value:
					needed_value = '\'' + needed_value + '\''

				# Key is valid so now check if the value is valid as well.
				return text_value == needed_value

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
		self._universal_constants.append(UniversalConstant(self._key_name_start_token + key, value))

	def __str__(self):
		return 'UniversalConstantGroup : ' + self._description
