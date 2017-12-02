# coding=utf-8

"""
This module, functions.py, is used for generating and maintaining functions.
"""

import sys

sys.path.insert(0, '/home/dev_usr/urbtek')
from universal_code import debugging as dbg

from code_manager.abstract_definitions import variables
from code_manager.abstract_definitions import classes
from code_manager.abstract_definitions import code_file
from code_manager.abstract_definitions.code_file import CodeFile

# This is needed for the custom compiler.
KEYWORDS_ALL_FUNCTIONS = [' F(']
#KEYWORDS_CLASS_FUNCTION_THAT_CHILDREN_OVERRIDE_AND_CALL_ONCE_AT_END = ['ClassFunctionThatChildrenOverrideAndCallOnceAtEnd(']
KEYWORDS_IN_USE_ALL = [' = F(']

library_nickname_mapping = {'F' : 'from code_manager.abstract_definitions.functions import Function as F'}

# Utility variables.
COLON_RETURN_COLON_SPACE = ':return : '


def get_order_rank_key(single_functionality_object) -> int:
	"""Just a utility function for sorting.
	:param single_functionality_object: A single functionality object.
	:return: The key from this single_functionality_object.
	"""
	return single_functionality_object.get_order_rank()


def _get_x_tabs(number_of_tabs) -> str:
	"""Just a utility function to get concatenated tabs.
	:param number_of_tabs: The number of tabs to get.
	:return: The tabs combined as a single string.
	"""
	return_text = ''
	for x in range(number_of_tabs):
		return_text += '    '
	return return_text

# ---------------------------------------------------------------------------


class SingleFunctionality:
	"""
	This represents a single action that a function does. A function can have as many functionalities as it wants.
	"""

	def __init__(self, order_rank=-1):
		self._order_rank = order_rank
		self._name       = ''
		self._number_of_starting_tabs = 0

	def set_number_of_starting_tabs(self, number_of_tabs):
		"""Set the number of starting tabs that each line uses.
		:param number_of_tabs: The number of tabs to start each line with.
		:return: Void.
		"""
		self._number_of_starting_tabs = number_of_tabs

	def set_name(self, name):
		"""A simple utility function to set the name of this functionality.
		:param name: The name to set to.
		:return: Void.
		"""
		self._name = name

	def get_order_rank(self):
		"""Return the order rank of this functionality.
		Order Rank : When this functionality should execute relative to other functionalities in the function.
		The lower the number the sooner the functionality will get executed.
		All order ranks MUST be unique.
		:return: The order rank of this functionality.
		"""
		return self._order_rank


class FunctionalityCustom(SingleFunctionality):
	"""
	This represents a single action that a function does. This specific action is user-specified code.
	"""

	def __init__(self, custom_code, order_rank=-1):
		super().__init__(order_rank)
		self._custom_code = custom_code

	def __str__(self):
		return_text = ''
		for line in self._custom_code.split('\n'):
			return_text += _get_x_tabs(self._number_of_starting_tabs) + line + '\n'
		return return_text


class FunctionalityConditional(SingleFunctionality):
	"""
	This represents a single action that a function does. This specific action is a conditional statement/block.
	"""

	def __init__(self, conditional, order_rank=-1):
		super().__init__(order_rank)
		self._conditional = conditional

	def __str__(self):
		return str(self._conditional)


class FunctionalityBlock(SingleFunctionality):
	"""
	This represents a block of functionality code.
	"""

	def __init__(self, order_rank=-1):
		super().__init__(order_rank)

# --------------------------------------------------------------------------


class Function:
	"""
	This represents a single function.
	"""

	def __init__(self, function_documentation):
		"""The constructor.
		:param function_documentation: The documentation for the function.
		"""
		self._name                      = ''
		self._documentation             = function_documentation
		self._return_data_type          = None
		self._return_documentation      = None
		self._functionalities           = []
		self._parameters                = []
		self._reserved_order_ranks      = []
		self._number_of_tabs            = 0
		self._current_order_rank        = 0
		self._local_variables           = []
		self._annotation_comment        = ''
		self._call_super_at_start       = False
		self._call_super_at_end         = False
		self._parent_entity_class_type  = None
		self.use_self                   = False
		self._class_of_constructor_that_this_function_is_in = None

	#SET_CLASS_OF_CONSTRUCTOR_THAT_THIS_FUNCTION_IS_IN
	def set_class_of_constructor_that_this_function_is_in(self, class_object):
		"""Set this function's containing class so that we can access that class's variables and fields.
		:param class_object: The class object to reference.
		:return: Void.
		"""
		self._class_of_constructor_that_this_function_is_in = class_object

	def get_tabs(self, extra=0):
		"""Utility function to get default tabbing needed.
		:param extra: Any extra number of tabs to add.
		:return: The tab string.
		"""
		if self._parent_entity_class_type is not None and self._parent_entity_class_type is not CodeFile:
			return _get_x_tabs(self._number_of_tabs + extra + 1)
		else:
			return _get_x_tabs(self._number_of_tabs + extra)

	def set_name(self, name):
		"""Simply set the name for this function.
		:param name: The name to set to.
		:return: Void.
		"""
		self._name = name

	def call_super_at_end(self):
		"""This will make this function call the super method as its last line of code.
		:return:
		"""
		self._call_super_at_end = True

	def set_annotation_comment(self, annotation_comment):
		"""Sets the function's annotation comment.
		:param annotation_comment: The annotation comment as a string.
		:return: Void.
		"""
		self._annotation_comment = annotation_comment

	def add_local_variable(self, variable):
		"""Adds a local variable to this function.
		:param variable: The variable to add.
		:return: Void.
		"""
		self._local_variables.append(variable)

	def add_parameter(self, variable):
		"""Adds a parameter to this function.
		:param variable: The parameter to add.
		:return: Void.
		"""
		self._parameters.append(variable)

	def add_conditional(self, conditional):
		"""Add a conditional statement to this function.
		:param conditional: The conditional statement to add.
		:return: Void.
		"""
		self._functionalities.append(FunctionalityConditional(conditional))

	def add_functionality(self, single_functionality):
		"""This will add a single functionality for the function to perform.
		:param single_functionality: The single functionality to perform.
		:return: Void.
		"""
		if single_functionality.get_order_rank() == -1:
			single_functionality._order_rank = self._current_order_rank
			self._current_order_rank += 1

		self._functionalities.append(single_functionality)
		if single_functionality.get_order_rank() in self._reserved_order_ranks:
			dbg.raise_exception(dbg.MyException, 'The order rank {' + str(single_functionality.get_order_rank()) + '} is already reserved!')
		self._reserved_order_ranks.append(single_functionality.get_order_rank())

	def get_annotation_comment(self):
		"""This part comes before the function text even starts.
		:return: The code as a string.
		"""
		return self.get_tabs() + '# ' + self._annotation_comment + '\n'

	def get_function_start(self):
		"""This is the first part of composing the function text.
		:return: The code as a string.
		"""
		return self.get_tabs() + 'def ' + self._name + '('

	def set_parent_entity_class_type(self, parent_class_type):
		"""Utility function to set a property of this function.
		:param parent_class_type: The class name as a string.
		:return: Void.
		"""
		self._parent_entity_class_type = parent_class_type

	def get_parameters_string(self):
		"""This gets the parameter string for this function.
		:return: The parameter string for this function.
		"""
		if self._parent_entity_class_type is not None:

			if self._parent_entity_class_type == classes.ParentClass or self._parent_entity_class_type == classes.ChildClass or isinstance(self, ClassFunctionThatChildrenOverrideAndCallOnceAtEnd):
				self.use_self = True

		if len(self._parameters) == 0:
			if self.use_self:
				return 'self'
			return ''
		if self.use_self:
			return_text = 'self, '
		else:
			return_text = ''
		for p in self._parameters:
			return_text += p.get_name() + ': ' + p.get_data_type() + ', '
		return return_text[:-2]

	def get_function_header_ending(self):
		"""This gets everything that comes after the parameter strings (for the function declaration line).
		:return: The code string.
		"""
		if self._return_data_type is None:
			return ') -> None:\n'
		else:
			return ') -> ' + self._return_data_type + ':\n'

	def get_function_full_documentation_string(self):
		"""This gets the entire documentation string for this function.
		:return: The code string.
		"""
		tabbing = self.get_tabs(1)
		text = '' + tabbing + '"""' + self._documentation + '\n'
		# Add documentation for any parameters in this function.
		for p in self._parameters:
			text += tabbing + p.get_function_documentation() + '\n'
		# Add return documentation if we have a return value.
		if self._return_documentation is not None:
			text += tabbing + COLON_RETURN_COLON_SPACE + self._return_data_type + ' | ' + self._return_documentation + '\n'
		else:

			last_resort_documentation_to_use = ''

			# Even though the return type was not explicitly defined we want to double check that there are no return statements.
			# If there is a return statement then we will do our best to guess the return type.
			# To do this we will go through the function's body text.
			functions_body_text = self.get_function_body_text().split('\n')
			return_lines = []


			#print('The function body text:')
			#print(self.get_function_body_text())

			for line in functions_body_text:
				if 'return ' in line:
					if ' ### ' in line:
						if '#RT:str' in line:
							line = line.replace('#RT:str', '')
							self._return_data_type = 'str'
						elif '#RT:int' in line:
							line = line.replace('#RT:int', '')
							self._return_data_type = 'int'
						elif '#RT:bool' in line or '$RT:boolean' in line:
							line = line.replace('#RT:bool', '').replace('#RT:boolean', '')
							self._return_data_type = 'bool'
						elif '#RT:object' in line:
							line = line.replace('#RT:object', '')
							self._return_data_type = 'object'
						elif '#RT:\'' in line:
							# This is a specific object being returned.
							class_type = line[line.rindex('#RT:\'') + 5:len(line) - 1]
							self._return_data_type = class_type
							#print('THE CLASS TYPE IS : ')
							#print(class_type)
							#exit(0)
							line = line[0:line.rindex('#RT:\'')]
						return_statement = line.replace('return ', '').lstrip()[0:line.replace('return ', '').lstrip().index(' ### ')]

						#print('The return statement is : ' + return_statement)

						if return_statement[0] == '\'' and return_statement[len(return_statement) - 1] == '\'':
							self._return_data_type = 'str'
						elif return_statement[0] == '{' and return_statement[len(return_statement) - 1] == '}':
							self._return_data_type = 'dict'
						elif return_statement[0] == '[' and return_statement[len(return_statement) - 1] == ']':
							self._return_data_type = 'list'
						elif return_statement == 'True' or return_statement == 'False':
							self._return_data_type = 'bool'
						elif return_statement.startswith('self.'):
							for f in self._class_of_constructor_that_this_function_is_in._fields:
								if f.get_internal_name() == return_statement:
									self._return_data_type = f.get_data_type()

						return_lines.append(line.replace('return ', '').lstrip()[0:line.replace('return ', '').lstrip().index(' ### ')])
						last_resort_documentation_to_use = line.replace('return ', '').lstrip()[line.replace('return ', '').lstrip().index(' ### ') + 5:]
					else:
						return_lines.append(line.replace('return ', '').lstrip())
						#print('Just added : ' + (line.replace('return', '').lstrip()))

			# Check if they are all booleans.
			booleans = 0
			for rl in return_lines:
				if rl == 'True' or rl == 'False':
					booleans += 1
			if booleans == len(return_lines) and len(return_lines) > 0:
				self._return_data_type = 'bool'


			return_statements_gathered = []
			if len(return_lines) > 0:
				for rl in return_lines:
					return_statements_gathered.append(rl)

			if len(return_statements_gathered) > 0:
				vc_to_use = None
				documentation_to_use = ' | Missing documentation.'
				all_names_matched = True
				for rsg in return_statements_gathered:
					name_found_in_vc = False
					for vc in variables.all_variable_chunks:
						for v in vc:
							if rsg in str(v):
								name_found_in_vc = True
								vc_to_use = vc
					if name_found_in_vc is False:
						all_names_matched = False
				if all_names_matched:
					documentation_to_use = ' | ' + vc_to_use.get_documentation()
					self._return_data_type = vc_to_use.get_variables_data_type()
				else:
					documentation_to_use = ' | ' + last_resort_documentation_to_use

				# If we still don't have a return type lets see if are returning a local variable.
				# TODO : Make this more elegant.
				if len(return_statements_gathered) == 1:
					variable_name = return_statements_gathered[0]
					# Lets see if this just a local variable.
					for line in functions_body_text:
						# Lets see if we can find an assignment statement. (Yeah this isn't the best system but will work for now.)
						if variable_name in line and ' = ' in line:
							value_assigned_to = line.lstrip()[line.lstrip().index(' = ') + 3:]

							if value_assigned_to.isdigit():
								self._return_data_type = 'int'
					# Now lets check to see if it is a global variable.
					if self._return_data_type is None:
						for line in functions_body_text:
							if variable_name in line and 'global ' in line:
								# Find the type of this global variable.
								self._return_data_type = variables.get_type_of_global_variable_by_name()

				if self._return_data_type is None:
					text += tabbing + COLON_RETURN_COLON_SPACE + 'Void' + documentation_to_use + '\n'
				else:
					text += tabbing + COLON_RETURN_COLON_SPACE + self._return_data_type + documentation_to_use + '\n'
			else:
				text += tabbing + COLON_RETURN_COLON_SPACE + 'Void | Void.\n'

		text += tabbing + '"""\n'
		return text

	def get_local_variables(self):
		"""Utility function to get local_variables code text.
		:return: The code as a string.
		"""
		text = ''
		for lv in self._local_variables:
			text += self.get_tabs() + str(lv) + '\n'
		return text

	def get_function_body_text(self):
		"""This gets the function's body text. The actual logic of the function.
		:return: The code as a string.
		"""
		body_text = self.get_local_variables()
		if len(body_text) < 1:
			body_text = ''

		for f in self._functionalities:
			if str(f).count('\n') > 1:
				single_lines = str(f).split('\n')
				for sl in single_lines:
					if len(sl) > 0:
						body_text += self.get_tabs(1) + str(sl) + '\n'
			else:
				body_text += self.get_tabs(1) + str(f)
		return body_text

	def __str__(self):

		if len(self._annotation_comment) > 0:
			function_text = self.get_annotation_comment()
		else:
			function_text = ''
		gfds = self.get_function_full_documentation_string()
		gfbt = self.get_function_body_text()
		gfs  = self.get_function_start()
		gps  = self.get_parameters_string()
		gfhe = self.get_function_header_ending()

		function_text += gfs + gps + gfhe + gfds + gfbt
		if self._call_super_at_end:
			function_text += self.get_tabs() + 'super().' + self._name + '()\n'
		return function_text

	def get_name(self):
		"""Return the name of this function.
		:return: The name of this function as a string.
		"""
		return self._name


class ClassFunctionThatChildrenOverrideAndCallOnceAtEnd(Function):
	"""
	This represents a single class function that child classes MUST override and MUST call the parent function as it's last line of code.
	"""
	def __init__(self, class_function_documentation):
		super().__init__(class_function_documentation)
		self._number_of_tabs = 1
		self._parameters = []
		self.use_self = True

# --------------------------------------------------------------------------
