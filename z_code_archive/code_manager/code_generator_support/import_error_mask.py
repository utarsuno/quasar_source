# coding=utf-8

"""
This module, import_error_mask.py, is just a file to reference fake function, class, and variable names to mask IDE warnings.
"""


class c:
	"""
	This maps to FunctionalityCustom or FunctionalityBlock.

	If the *_generator.py code starts like this : 'c(''' (but actually double quotes not single quotes)
	then it goes to FunctionalityCustom

	If the *_generator.py starts like this : c('
	then it goes to FunctionalityBlock
	"""

	def __init__(self, fake_argument_0):
		self._fake_argument_0 = fake_argument_0


class cc:
	"""
	This maps to ScriptBlock.

	If the *_generator.py code starts like this : 'cc(''' (but actually double quotes not single quotes)
	then it goes to ScriptBlock

	If the *_generator.py code starts like this : cc('
	then it goes to ScriptBlock
	"""