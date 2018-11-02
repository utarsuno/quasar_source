# coding=utf-8

"""This module, pre_process_constant.py, provides an abstraction for JS constants to pre-process."""


class PreProcessConstant(object):
	"""Represents a constant to pre-process."""

	def __init__(self, raw_line):
		self._raw      = raw_line
		self._variable = None
		self._value    = None
		self._initialize()

	def _initialize(self):
		"""Gets the constant name."""
		r = self._raw.lstrip().rstrip()
		r = r[r.index('const ') + len('const '):]
		r = r[:r.index(';')]

		self._variable = r[:r.index('=')].lstrip().rstrip()
		self._value    = r[r.index('=') + 1:].lstrip().rstrip()

	@property
	def variable(self) -> str:
		"""Returns the name of this constant/variable."""
		return self._variable

	@property
	def value(self) -> str:
		"""Returns the value of this constant/variable."""
		return self._value


def parse_out_constants(lines_to_parse):
	"""Returns the lines with certain constants parsed out."""
	constants  = []
	first_pass = []
	final_pass = []

	for line in lines_to_parse:
		if 'const' in line and '#pre-process_global_constant' in line:
			constants.append(PreProcessConstant(line))
		else:
			first_pass.append(line)

	for l in first_pass:
		line = l
		for c in constants:
			if c.variable in line:
				line = line.replace(c.variable, c.value)

		final_pass.append(line)

	return final_pass

