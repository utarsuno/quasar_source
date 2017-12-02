# coding=utf-8

"""
This module, class.py, is used for generating and maintaining classes.
"""

from code_manager.abstract_definitions import functions
from code_manager.abstract_definitions.variables import PassedInStringField
from code_manager.miscellaneous_scripts import formatting

# This is needed for the custom compiler.
_PARENT_CLASS           = 'PC('
_CHILD_CLASS            = 'CC('
_PARENT_CLASS_IN_USE    = ' = PC('
_CHILD_CLASS_IN_USE     = ' = CC('
KEYWORDS_ALL            = [_PARENT_CLASS, _CHILD_CLASS]
KEYWORDS_IN_USE_ALL     = [_PARENT_CLASS_IN_USE, _CHILD_CLASS_IN_USE]
KEYWORDS_PARENT_CLASSES = [_PARENT_CLASS]
KEYWORDS_CHILD_CLASSES  = [_CHILD_CLASS]

library_nickname_mapping = {'PC' : 'from code_manager.abstract_definitions.classes import ParentClass as PC',
                            'CC' : 'from code_manager.abstract_definitions.classes import ChildClass as CC'}

TAB     = '\t'
TAB_TAB = '\t\t'


def get_alphabetic_name(variable):
	"""Just a utility function for alphabetic sorting.
	:param variable: The variable to work with.
	:return: The name of the variable.
	"""
	return variable.get_name()


def get_x_tabs(number_of_tabs) -> str:
	"""Just a utility function to get concatenated tabs.
	:param number_of_tabs: The number of tabs to get.
	:return: The tabs combined as a single string.
	"""
	return_text = ''
	for x in range(number_of_tabs):
		return_text += '\t'
	return return_text


class ParentClass:
	"""
	This represents a single Class in a code file.
	"""

	def __init__(self, documentation):
		self._name                     = ''
		self._code_text                = ''
		self._documentation            = documentation
		self._fields                   = []
		self._constant_fields          = []
		self._constant_variable_chunks = []
		self._functions                = []
		self._tabs                     = 0
		self._parent_class             = None
		self._needs_constructor        = False
		self._parameter_values         = {}
		self._constructor_functionalities = []

	def add_getter_for(self, variable):
		"""This will make a getter function for the variable.
		:param variable: The variable to make a getter function for.
		:return: Void.
		"""
		f = functions.Function("Return's the variable : " + variable.get_name())
		f._name = 'get_' + variable.get_name_without_hidden_character()
		f.set_parent_entity_class_type(self)
		f.use_self = True
		func = functions.FunctionalityCustom("return " + variable.get_internal_name())
		f._return_data_type = variable.get_data_type()
		f._return_documentation = variable.get_documentation()
		f.add_functionality(func)
		self.add_function(f)

	def add_functionality(self, functionality):
		"""Add a functionality to the constructor.
		:param functionality: The functionality to add.
		:return: Void.
		"""
		self._constructor_functionalities.append(functionality)
		self._needs_constructor = True

	def set_name(self, name):
		"""Just a simple function to set the name of this class.
		:param name: The name to set to.
		:return: Void.
		"""
		self._name = name

	def add_parameter(self, parameter):
		"""This function is specifically used to add constructor parameters that just need to be referenced and not saved.
		:param parameter: The parameter to add (it should be a variable object of some sort).
		:return: Void.
		"""
		self._fields.append(parameter)
		self._needs_constructor = True

	def _get_constant_fields_text(self):
		"""A utility function to get the text for the constant fields.
		:return: The code text as a string.
		"""
		text = ''
		for cf in self._constant_fields:
			text += get_x_tabs(self._tabs) + str(cf)
		return text

	def add_constant_field(self, constant_field):
		"""Add a constant field to this class.
		:param constant_field: The constant field to add.
		:return: Void.
		"""
		self._constant_fields.append(constant_field)

	def _get_constant_variable_chunks(self):
		"""A utility function to get the text for the variable chunks.
		:return: The code text as a string.
		"""
		text = ''
		for vc in self._constant_variable_chunks:
			vc.set_tabbing(self._tabs)
			text += get_x_tabs(self._tabs) + str(vc)
		return text + '\n'

	def add_constant_variable_chunk(self, variable_chunk):
		"""Add a constant variable chunk to this class.
		:param variable_chunk: The variable chunk to add.
		:return: Void.
		"""
		self._constant_variable_chunks.append(variable_chunk)

	def _get_constructor(self):
		"""Get the code text of the constructor.
		:return: Get the code text of the constructor, as a string.
		"""
		text = get_x_tabs(self._tabs + 1) + 'def __init__(self'

		# Sort the fields by their alphabetic names.
		self._fields = sorted(self._fields, key=get_alphabetic_name)

		for p in self._fields:
			if p.is_parameter():
				text += ', ' + p.get_name_without_hidden_character() + ': ' + p.get_data_type()

		text += ') -> None:\n' + get_x_tabs(self._tabs + 2) + '"""\n'

		# Documentation.
		field_documentation_text = ''
		for f in self._fields:
			if not f.is_parameter():
				field_documentation_text += get_x_tabs(self._tabs + 2) + f.get_constructor_documentation() + '\n'
			else:
				field_documentation_text += get_x_tabs(self._tabs + 2) + f.get_function_documentation() + '\n'
		text += formatting.sort_by_two_deliminators(': {', '|', field_documentation_text)
		text += TAB_TAB + '"""\n'

		# Initialize constructor variables here.
		constructor_text = ''
		for f in self._fields:
			if not f.is_parameter():
				if isinstance(f, PassedInStringField):
					constructor_text += get_x_tabs(self._tabs + 2) + f.get_internal_name() + ' = ' + f.get_initialization_value()[1:len(f.get_initialization_value()) - 1] + '\n'
				else:
					if str(f.get_initialization_value()).startswith('\'DC:'):
						constructor_text += get_x_tabs(self._tabs + 2) + f.get_internal_name() + ' = ' + f.get_initialization_value()[4:len(f.get_initialization_value()) - 1] + '\n'
					else:
						constructor_text += get_x_tabs(self._tabs + 2) + f.get_internal_name() + ' = ' + f.get_initialization_value() + '\n'
			else:
				constructor_text += get_x_tabs(self._tabs + 2) + f.get_internal_name() + ' = ' + f.get_name_without_hidden_character() + '\n'
		text += formatting.sort_by_deliminator('=', constructor_text)

		# Now print any functionalities that we might have.
		for f in self._constructor_functionalities:
			text += str(f)

		return text

	def _get_start_the_class_text(self):
		"""Just a utility function that sub classes over-ride, easy design pattern.
		:return: The code string.
		"""
		return 'class ' + self._name + ':\n'

	def get__str__method(self):
		"""Will return the code for the class's __str__ method.
		:return: The code for the method as a string.
		"""
		text = get_x_tabs(self._tabs + 1) + 'def __str__(self):\n'
		text += get_x_tabs(self._tabs + 2) + 'return \'\\n\' + '
		for f in self._fields:
			text += "'" + f.get_internal_name() + " | ' + str(" + f.get_internal_name() + ') + \'\\n\' + '
		return text[:-3]

	def __str__(self):
		# Start the class.
		self._code_text = self._get_start_the_class_text()

		# Add the documentation. Changed on 04.05.2017.
		self._code_text += '    """' + self._documentation + '\n    """\n\n'

		# Add any constant variables or variable chunks.
		if len(self._constant_fields) > 0:
			self._code_text += self._get_constant_fields_text()
		if len(self._constant_variable_chunks) > 0:
			self._code_text += self._get_constant_variable_chunks()

		# Add the constructor.
		if self._needs_constructor or self._parent_class is not None:
			self._code_text += self._get_constructor() + '\n'

		# Add the functions.
		for f in self._functions:
			self._code_text += str(f) + '\n'

		# Add the __str__ method.
		self._code_text += self.get__str__method()

		return self._code_text

	def add_field(self, field):
		"""Adds a class field to this class.
		:param field: A field to add to this class.
		:return: Void.
		"""
		self._fields.append(field)
		if 'PassedIn' in str(type(field)):
			self._needs_constructor = True

	def add_function(self, function):
		"""Adds a function to this class.
		:param function: The function to add to this class.
		:return: Void.
		"""
		self._functions.append(function)

	def get_name(self):
		"""Return the name of this class.
		:return: The name of this class as a string.
		"""
		return self._name


class ChildClass(ParentClass):
	"""
	This represents a single ChildClass in a code file.
	"""

	def __init__(self, documentation):
		super().__init__(documentation)

	def set_a_parameter_value(self, parameter_value):
		"""This will set the value for a parameter that the parent class receives.
		:param parameter_value: The object containing useful setting information.
		:return: Void.
		"""
		self._parameter_values[parameter_value._name] = parameter_value._value

	def _get_start_the_class_text(self):
		"""Just a utility function that sub classes over-ride, easy design pattern.
		:return: The code string.
		"""
		return 'class ' + self._name + '(' + self._parent_class.get_name() + '):\n'

	def set_parent_class(self, parent_class):
		"""Set the parent class of this child class.
		:param parent_class: The parent class.
		:return: Void.
		"""
		self._parent_class = parent_class
		if self._parent_class._needs_constructor:
			self._needs_constructor = True

	def get_combined_parameters(self):
		combined_parameters = []
		for p in self._parent_class._fields:
			if p.is_parameter():
				combined_parameters.append(p)
		for p in self._fields:
			if p.is_parameter():
				combined_parameters.append(p)
		# Sort the combined parameters by their alphabetic names.
		combined_parameters = sorted(combined_parameters, key=get_alphabetic_name)
		return combined_parameters

	def get_combined_fields(self):
		combined_fields = []
		for p in self._parent_class._fields:
			combined_fields.append(p)
		for p in self._fields:
			combined_fields.append(p)
		# Sort the combined parameters by their alphabetic names.
		combined_parameters = sorted(combined_fields, key=get_alphabetic_name)
		return combined_parameters

	def get__str__method(self):
		"""Will return the code for the class's __str__ method.
		:return: The code for the method as a string.
		"""
		cf = self.get_combined_fields()
		text = get_x_tabs(self._tabs + 1) + 'def __str__(self):\n'
		text += get_x_tabs(self._tabs + 2) + 'return \'\\n\' + '
		for f in cf:
			text += "'" + f.get_internal_name() + " | ' + str(" + f.get_internal_name() + ') + \'\\n\' + '
		return text[:-3]

	def _get_constructor(self):
		"""Get the code text of the constructor.
		:return: Get the code text of the constructor, as a string.
		"""
		text = get_x_tabs(self._tabs + 1) + 'def __init__(self'

		# Sort the fields by their alphabetic names.
		self._fields = sorted(self._fields, key=get_alphabetic_name)

		combined_parameters = []
		for p in self._parent_class._fields:
			if p.is_parameter():
				combined_parameters.append(p)
		for p in self._fields:
			if p.is_parameter():
				combined_parameters.append(p)

		# Sort the combined parameters by their alphabetic names.
		combined_parameters = sorted(combined_parameters, key=get_alphabetic_name)

		for p in combined_parameters:
			if p.get_name_without_hidden_character() in self._parameter_values.keys():
				text += ', ' + p.get_name_without_hidden_character() + '=' + self._parameter_values[p.get_name_without_hidden_character()]
			else:
				text += ', ' + p.get_name_without_hidden_character() + ': ' + p.get_data_type()

		text += ') -> None:\n' + get_x_tabs(self._tabs + 2) + '"""\n'

		# Documentation.
		field_documentation_text = ''
		for f in self._parent_class._fields:
			if f.get_name() not in self._parameter_values.keys():
				if not f.is_parameter():
					field_documentation_text += get_x_tabs(self._tabs + 2) + f.get_constructor_documentation() + '\n'
				else:
					field_documentation_text += get_x_tabs(self._tabs + 2) + f.get_function_documentation() + '\n'
		text += formatting.sort_by_two_deliminators(': {', '|', field_documentation_text)
		text += TAB_TAB + '"""\n'

		# Call super constructor.
		parameter_text = ''
		#for p in combined_parameters:
		for p in self._parent_class._fields:
			if p.is_parameter():
				parameter_text += p.get_name_without_hidden_character() + ', '
		if len(parameter_text) > 1:
			parameter_text = parameter_text[:-2]
		text += get_x_tabs(self._tabs + 2) + 'super().__init__(' + parameter_text + ')\n'

		# Initialize constructor variables here.
		constructor_text = ''
		for f in self._fields:
			if not f.is_parameter():
				if isinstance(f, PassedInStringField):
					constructor_text += get_x_tabs(self._tabs + 2) + f.get_internal_name() + ' = ' + f.get_initialization_value()[1:len(f.get_initialization_value()) - 1] + '\n'
				else:
					if str(f.get_initialization_value()).startswith('\'DC:'):
						constructor_text += get_x_tabs(self._tabs + 2) + f.get_internal_name() + ' = ' + f.get_initialization_value()[4:len(f.get_initialization_value()) - 1] + '\n'
					else:
						constructor_text += get_x_tabs(self._tabs + 2) + f.get_internal_name() + ' = ' + f.get_initialization_value() + '\n'
		text += formatting.sort_by_deliminator('=', constructor_text)

		# Now print any functionalities that we might have.
		for f in self._constructor_functionalities:
			text += str(f)

		return text
