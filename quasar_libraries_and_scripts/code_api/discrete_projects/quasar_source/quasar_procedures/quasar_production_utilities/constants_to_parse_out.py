# coding=utf-8

"""This module, constants_to_parse_out.py, is a utility program to store constants that need to get replaced in the minified file."""


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

	constants = []

	first_pass = []
	final_pass = []

	for l in lines_to_parse:
		if 'const' in l and '#pre-process_global_constant' in l:
			constants.append(PreProcessConstant(l))
			#print(l, end='')
		else:
			first_pass.append(l)

	for l in first_pass:

		line_currently = l

		for c in constants:
			if c.variable in line_currently:
				#print(line_currently, end='')
				line_currently = line_currently.replace(c.variable, c.value)
				#print(line_currently, end='')
				#print()

		final_pass.append(line_currently)

	#exit()

	return final_pass




# compressed{JS:quasar_prod_v_5857} - {533795b to 361813b} reduction of 171982 bytes or 32.21%
# compressed{JS:quasar_prod_v_5857} - {532328b to 360689b} reduction of 171639 bytes or 32.24%
# compressed{JS:quasar_prod_v_5857} - {525677b to 355556b} reduction of 170121 bytes or 32.36%
# compressed{JS:quasar_prod_v_5857} - {523433b to 353519b} reduction of 169914 bytes or 32.46%
# compressed{JS:quasar_prod_v_5857} - {523110b to 353231b} reduction of 169879 bytes or 32.47%

