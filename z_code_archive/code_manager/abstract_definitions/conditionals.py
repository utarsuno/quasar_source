# coding=utf-8

"""
This module, conditionals.py, is used for generating and maintaining conditional code.
"""

# IfStatementBooleanSplit
KEYWORDS_ALL = ['IFBS(']
KEYWORDS_SWITCH_STATEMENT = ['SS(']
KEYWORDS_IN_USE_ALL = ['IFBS(', 'SS(']

library_nickname_mapping = {'SS'   : 'from code_manager.abstract_definitions.conditionals import SwitchStatement as SS',
                            'IFBS' : 'from code_manager.abstract_definitions.conditionals import IfStatementBooleanSplit as IFBS'}

def get_x_tabs(number_of_tabs) -> str:
	"""Just a utility function to get concatenated tabs.
	:param number_of_tabs: The number of tabs to get.
	:return: The tabs combined as a single string.
	"""
	return_text = ''
	for x in range(number_of_tabs):
		return_text += '    '
	return return_text


class IfStatementBooleanSplit:
	"""
	A one to one representation of an if statement.
	"""

	def __init__(self, boolean, outcome_if_true, outcome_if_false):
		"""
		:param boolean: The boolean variable to split on.
		:param outcome_if_true: The code to execute if the boolean is true.
		:param outcome_if_false: The code to execute if the boolean is false.
		"""
		self._boolean_variable = boolean
		self._outcome_if_true  = outcome_if_true
		self._outcome_if_false = outcome_if_false
		self._default_tabbing  = 0

	def set_tabbing_size(self, size):
		"""Sets what the default tabbing size is.
		:param size: The number of tabs.
		:return: Void.
		"""
		self._default_tabbing = size

	def __str__(self):
		text = ''
		text += 'FASJF*CAFAEVRF\n\n\n\n\n\n\n\c2c423v423v4'
		if not self._boolean_variable.get_internal_name().startswith('self.'):
			text += get_x_tabs(self._default_tabbing) + 'if self.' + self._boolean_variable.get_internal_name() + ' is True:\n'
		else:
			text += get_x_tabs(self._default_tabbing) + 'if ' + self._boolean_variable.get_internal_name() + ' is True:\n'
		text += get_x_tabs(self._default_tabbing + 1) + self._outcome_if_true + '\n'
		text += get_x_tabs(self._default_tabbing) + 'else:\n'
		text += get_x_tabs(self._default_tabbing + 1) + self._outcome_if_false + '\n'
		return text


class SwitchStatement:
	"""
	A representation of a switch statement.
	"""

	def __init__(self):
		self._conditions_and_values = []
		self._default_tabbing       = 1
		self._name                  = None

	def set_name(self, name):
		"""Utility function to set the name of this switch statement.
		:param name: The name to set to.
		:return: Void.
		"""
		self._name = name

	def add_condition_and_value_pair(self, condition_code, value_code):
		"""Add a condition to check for and what code it should execute if True.
		:param condition_code: The condition to evaluate.
		:param value_code: The code to execute if the condition is True.
		:return: Void.
		"""
		self._conditions_and_values.append([condition_code, value_code])

	def set_tabbing_size(self, size):
		"""Sets what the default tabbing size is.
		:param size: The number of tabs.
		:return: Void.
		"""
		self._default_tabbing = size

	def __str__(self):
		index = 0
		text = ''
		for cv in self._conditions_and_values:
			if index == 0:
				text += get_x_tabs(self._default_tabbing - 1) + 'if ' + cv[0] + ':\n'
				text += get_x_tabs(self._default_tabbing) + cv[1] + '\n'
				index += 1
			else:
				text += get_x_tabs(self._default_tabbing - 1) + 'elif ' + cv[0] + ':\n'
				text += get_x_tabs(self._default_tabbing) + cv[1] + '\n'
		return text
