# coding=utf-8

"""
This module, variable.py, is used for generating and maintaining variables.
"""
from code_manager.abstract_definitions import libraries as lib

from code_manager.miscellaneous_scripts import formatting

# Import our custom library for debugging utilities.

# This is needed for the custom compiler.
KEYWORDS_REGULAR_VARIABLES = ['LV(', 'OV(', 'NV(', 'FV(', 'SV(', 'DV(', 'BV(', 'IV(', ]
KEYWORDS_PASSED_IN_CLASS_FIELDS = ['PILF(', 'PIOF(', 'PINF(', 'PIFF(', 'PISF(', 'PIDF(', 'PIBF(', 'PIIF(', ]
KEYWORDS_PASSED_IN_CLASS_FIELDS_WITH_GETTER = ['PILFWG(', 'PIOFWG(', 'PINFWG(', 'PIFFWG(', 'PISFWG(', 'PIDFWG(', 'PIBFWG(', 'PIIFWG(', ]
KEYWORDS_NON_PASSED_IN_CLASS_FIELDS = ['LF(', 'OF(', 'NF(', 'FF(', 'SF(', 'DF(', 'BF(', 'IF(', ]
KEYWORDS_NON_PASSED_IN_CLASS_FIELDS_WITH_GETTER = ['LFWG(', 'OFWG(', 'NFWG(', 'FFWG(', 'SFWG(', 'DFWG(', 'BFWG(', 'IFWG(', ]
KEYWORDS_PARAMETERS = ['LP(', 'OP(', 'NP(', 'FP(', 'SP(', 'DP(', 'BP(', 'IP(', ]
KEYWORDS_LOCAL_VARIABLES = ['LLV(', 'LOV(', 'LNV(', 'LFV(', 'LSV(', 'LDV(', 'LBV(', 'LIV(', ]
KEYWORDS_PARAMETER_VALUE = ['PV(']
KEYWORDS_VARIABLE_CHUNK = ['VC(']
KEYWORDS_IN_USE_ALL = [' = NV(', ' = LV(', ' = DV(', ' = IV(', ' = OV(', ' = BV(', ' = FV(', ' = SV(', ' = PINF(', ' = PILF(', ' = PIDF(', ' = PIIF(', ' = PIOF(', ' = PIBF(', ' = PIFF(', ' = PISF(', ' = PINF(',
                       ' = PILF(', ' = PIDF(', ' = PIIF(', ' = PIOF(', ' = PIBF(', ' = PIFF(', ' = PISF(', ' = NF(', ' = LF(', ' = DF(', ' = IF(', ' = OF(', ' = BF(', ' = FF(', ' = SF(', ' = NFWG(', ' = LFWG(',
                       ' = DFWG(', ' = IFWG(', ' = OFWG(', ' = BFWG(', ' = FFWG(', ' = SFWG(', ' = NP(', ' = LP(', ' = DP(', ' = IP(', ' = OP(', ' = BP(', ' = FP(', ' = SP(', ' = NV(', ' = LV(', ' = DV(', ' = IV(',
                       ' = OV(', ' = BV(', ' = FV(', ' = SV(', ' = PV(', ]

library_nickname_mapping = {'SV'    : 'from code_manager.abstract_definitions.variables import StringVariable as SV',
                            'BV'    : 'from code_manager.abstract_definitions.variables import BooleanVariable as BV',
                            'DV'    : 'from code_manager.abstract_definitions.variables import DictionaryVariable as DV',
                            'OV'    : 'from code_manager.abstract_definitions.variables import ObjectVariable as OV',
                            'IV'    : 'from code_manager.abstract_definitions.variables import IntegerVariable as IV',
                            'NV'    : 'from code_manager.abstract_definitions.variables import NoneVariable as NV',
                            'FV'    : 'from code_manager.abstract_definitions.variables import FloatVariable as FV',
                            'LV'    : 'from code_manager.abstract_definitions.variables import ListVariable as LV',
                            'PISF'  : 'from code_manager.abstract_definitions.variables import PassedInStringField as PISF',
                            'PIBF'  : 'from code_manager.abstract_definitions.variables import PassedInBooleanField as PIBF',
                            'PIDF'  : 'from code_manager.abstract_definitions.variables import PassedInDictionaryField as PIDF',
                            'PIOF'  : 'from code_manager.abstract_definitions.variables import PassedInObjectField as PIOF',
                            'PIIF'  : 'from code_manager.abstract_definitions.variables import PassedInIntegerField as PIIF',
                            'PINF'  : 'from code_manager.abstract_definitions.variables import PassedInNoneField as PINF',
                            'PIFF'  : 'from code_manager.abstract_definitions.variables import PassedInFloatField as PIFF',
                            'PILF'  : 'from code_manager.abstract_definitions.variables import PassedInListField as PILF',
                            'PISFWG': 'from code_manager.abstract_definitions.variables import PassedInStringFieldWithGetter as PISFWG',
                            'PIBFWG': 'from code_manager.abstract_definitions.variables import PassedInBooleanFieldWithGetter as PIBFWG',
                            'PIDFWG': 'from code_manager.abstract_definitions.variables import PassedInDictionaryFieldWithGetter as PIDFWG',
                            'PIOFWG': 'from code_manager.abstract_definitions.variables import PassedInObjectFieldWithGetter as PIOFWG',
                            'PIIFWG': 'from code_manager.abstract_definitions.variables import PassedInIntegerFieldWithGetter as PIIFWG',
                            'PINFWG': 'from code_manager.abstract_definitions.variables import PassedInNoneFieldWithGetter as PINFWG',
                            'PIFFWG': 'from code_manager.abstract_definitions.variables import PassedInFloatFieldWithGetter as PIFFWG',
                            'PILFWG': 'from code_manager.abstract_definitions.variables import PassedInListFieldWithGetter as PILFWG',
                            'SF'    : 'from code_manager.abstract_definitions.variables import StringField as SF',
                            'BF'    : 'from code_manager.abstract_definitions.variables import BooleanField as BF',
                            'DF'    : 'from code_manager.abstract_definitions.variables import DictionaryField as DF',
                            'OF'    : 'from code_manager.abstract_definitions.variables import ObjectField as OF',
                            'IF'    : 'from code_manager.abstract_definitions.variables import IntegerField as IF',
                            'NF'    : 'from code_manager.abstract_definitions.variables import NoneField as NF',
                            'FF'    : 'from code_manager.abstract_definitions.variables import FloatField as FF',
                            'LF'    : 'from code_manager.abstract_definitions.variables import ListField as LF',
                            'SFWG'  : 'from code_manager.abstract_definitions.variables import StringFieldWithGetter as SFWG',
                            'BFWG'  : 'from code_manager.abstract_definitions.variables import BooleanFieldWithGetter as BFWG',
                            'DFWG'  : 'from code_manager.abstract_definitions.variables import DictionaryFieldWithGetter as DFWG',
                            'OFWG'  : 'from code_manager.abstract_definitions.variables import ObjectFieldWithGetter as OFWG',
                            'IFWG'  : 'from code_manager.abstract_definitions.variables import IntegerFieldWithGetter as IFWG',
                            'NFWG'  : 'from code_manager.abstract_definitions.variables import NoneFieldWithGetter as NFWG',
                            'FFWG'  : 'from code_manager.abstract_definitions.variables import FloatFieldWithGetter as FFWG',
                            'LFWG'  : 'from code_manager.abstract_definitions.variables import ListFieldWithGetter as LFWG',
                            'SP'    : 'from code_manager.abstract_definitions.variables import StringParameter as SP',
                            'BP'    : 'from code_manager.abstract_definitions.variables import BooleanParameter as BP',
                            'DP'    : 'from code_manager.abstract_definitions.variables import DictionaryParameter as DP',
                            'OP'    : 'from code_manager.abstract_definitions.variables import ObjectParameter as OP',
                            'IP'    : 'from code_manager.abstract_definitions.variables import IntegerParameter as IP',
                            'NP'    : 'from code_manager.abstract_definitions.variables import NoneParameter as NP',
                            'FP'    : 'from code_manager.abstract_definitions.variables import FloatParameter as FP',
                            'LP'    : 'from code_manager.abstract_definitions.variables import ListParameter as LP',
                            'LSV'   : 'from code_manager.abstract_definitions.variables import StringVariable as LSV',
                            'LBV'   : 'from code_manager.abstract_definitions.variables import BooleanVariable as LBV',
                            'LDV'   : 'from code_manager.abstract_definitions.variables import DictionaryVariable as LDV',
                            'LOV'   : 'from code_manager.abstract_definitions.variables import ObjectVariable as LOV',
                            'LIV'   : 'from code_manager.abstract_definitions.variables import IntegerVariable as LIV',
                            'LNV'   : 'from code_manager.abstract_definitions.variables import NoneVariable as LNV',
                            'LFV'   : 'from code_manager.abstract_definitions.variables import FloatVariable as LFV',
                            'LLV'   : 'from code_manager.abstract_definitions.variables import ListVariable as LLV',
                            'PV'    : 'from code_manager.abstract_definitions.variables import ParameterValue as PV',
                            }

DATA_TYPE_STRING = 'str'
DATA_TYPE_INTEGER = 'int'
DATA_TYPE_FLOAT = 'float'
DATA_TYPE_LIST = 'list'
DATA_TYPE_DICTIONARY = 'dict'
DATA_TYPE_OBJECT = 'object'
DATA_TYPE_BOOLEAN = 'bool'
DATA_TYPE_NONE = 'None'
DATA_TYPES = [DATA_TYPE_STRING, DATA_TYPE_INTEGER, DATA_TYPE_FLOAT, DATA_TYPE_LIST, DATA_TYPE_DICTIONARY, DATA_TYPE_OBJECT, DATA_TYPE_BOOLEAN, DATA_TYPE_NONE]


def get_x_tabs(number_of_tabs) -> str:
	"""Just a utility function to get concatenated tabs.
	:param number_of_tabs: The number of tabs to get.
	:return: The tabs combined as a single string.
	"""
	return_text = ''
	for x in range(number_of_tabs):
		return_text += '    '
	return return_text


class Variable:
	"""
	This represents a single variable.
	"""

	def __init__(self, documentation, extra_data = None):
		self._name = None
		self._hidden = None
		self._data_type = None
		self._name_of_object_data_type_class = None  # Used if this variable is an object.
		self._initialization_value = None  # The default value.
		self._is_parameter = None
		self._should_be_initialized = None
		self._local_variable = None
		self._documentation = documentation
		if isinstance(self, ObjectField) or isinstance(self, ObjectParameter) or isinstance(self, ObjectFieldWithGetter) or isinstance(self, ObjectVariable) or isinstance(self, PassedInObjectField) or isinstance(self,
		                                                                                                                                                                                                            PassedInObjectFieldWithGetter):
			self._name_of_object_data_type_class = extra_data

	def is_parameter(self):
		"""Simply returns True/False depending on if this variable is a parameter or not.
		:return: Boolean indicating if this variable is a parameter or not.
		"""
		return self._is_parameter

	def set_name(self, name):
		"""Set this variable's name.
		:param name: The name to set to.
		:return: Void.
		"""
		self._name = name
		if self._name[0] == '_':
			self._hidden = True
		else:
			self._hidden = False

	def get_name(self):
		"""Return the name of the variable.
		:return: The name of the variable as a String.
		"""
		return self._name

	def get_is_hidden(self):
		"""Return a boolean indicating if this variable is hidden.
		:return: A boolean to indicate if this variable is hidden.
		"""
		return self._hidden

	def get_name_without_hidden_character(self):
		"""Return the name of the variable without any leading underscore.
		:return: The name of the variable (as a string) without any leading underscore.
		"""
		if self._hidden:
			return self._name[1:]
		else:
			return self._name

	def get_internal_name(self):
		"""Return the internal name of this variable.
		:return: The internal name as a string.
		"""
		return 'self.' + self._name

	def set_name_of_object_data_type_class(self, class_name):
		"""Utility function to set the object's class type.
		:param class_name: The name of the class that this object is a type of.
		:return: Void.
		"""
		self._name_of_object_data_type_class = class_name

	def get_data_type(self):
		"""Return the data type of this variable.
		:return: The data type of this variable, as a String.
		"""
		if self._data_type == DATA_TYPE_OBJECT:
			if self._name_of_object_data_type_class is not None:
				return self._name_of_object_data_type_class
		return self._data_type

	def get_should_be_initialized(self):
		"""Return a boolean indicating if this variable should be initialized or not.
		:return: A boolean indicating if this variable should be initialized or not.
		"""
		return self._should_be_initialized

	def get_initialization_value(self):
		"""Get the default value that this variable should be set to. If the value is a string it will be returned wrapped in single quotes.
		:return: The default value that the variable should be set to, as a String. If the value is a string it will be returned wrapped in single quotes.
		"""
		if self._data_type == DATA_TYPE_STRING:
			return "'" + self._initialization_value + "'"
		elif self._data_type == DATA_TYPE_LIST:
			return str(self)
		else:
			return str(self._initialization_value)

	def get_documentation(self):
		"""Get the documentation string that describes this variable.
		:return: The documentation string describing this variable.
		"""
		return self._documentation

	def get_constructor_documentation(self):
		"""Get a specific format of a documentation string that describes this variable.
		:return: The documentation string describing this variable.
		"""
		return ':' + self._name + ' : {' + self._data_type + '} | ' + self._documentation

	def get_function_documentation(self):
		"""Get a specific format of a documentation string that describes this variable.
		:return: The documentation string describing this variable.
		"""
		return ':param ' + self._name + ' : {' + self._data_type + '} | ' + self._documentation

	def __str__(self):
		if self._data_type == DATA_TYPE_LIST:
			if self._initialization_value == '[]' or len(self._initialization_value) == 0:
				return '[]'
			else:
				data_list_as_string = '['
				for v in self._initialization_value:
					data_list_as_string += str(v.get_name()) + ', '
				return self._name + ' = ' + data_list_as_string[0:len(data_list_as_string) - 2] + ']'
		elif self._data_type == DATA_TYPE_STRING:
			if self._initialization_value.startswith('\'DC:'):
				return self._name + ' = ' + self._initialization_value[4:]
			elif self._initialization_value.startswith('DC:'):
				return self._name + ' = ' + self._initialization_value[3:]
			else:
				return self._name + ' = ' + "'" + self._initialization_value + "'"
		else:
			return self._name + ' = ' + str(self._initialization_value)

	# NOTE : This function is never used, just put in to remove IDE warnings (the compiler supports the notation, not the code_generation code).
	def increment(self):
		"""Does nothing on purpose.
		:return: Void.
		"""
		y = 2


class ParameterValue:
	"""
	This helps set the value of a parameter.
	"""

	def __init__(self, value):
		self._name = ''
		self._value = value

	def set_name(self, name):
		"""Simple function to set the name of this parameter_value.
		:param name: The name to set to.
		:return: Void.
		"""
		self._name = name


# -------------------------------------------------------------------------------------------------------------------------------------------------------


class DictionaryVariable(Variable):
	"""
	This represents a single code variable that happens to be a Dictionary.
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._initialization_value = initialization_value
		self._data_type = 'dict'


class ObjectVariable(Variable):
	"""
	This represents a single code variable that happens to be a Object.
	"""

	def __init__(self, initialization_value, documentation, extra_data = None):
		super().__init__(documentation, extra_data)
		self._initialization_value = initialization_value
		self._data_type = 'object'


class BooleanVariable(Variable):
	"""
	This represents a single code variable that happens to be a Boolean.
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._initialization_value = initialization_value
		self._data_type = 'bool'


class FloatVariable(Variable):
	"""
	This represents a single code variable that happens to be a Float.
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._initialization_value = initialization_value
		self._data_type = 'float'


class ListVariable(Variable):
	"""
	This represents a single code variable that happens to be a List.
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._initialization_value = initialization_value
		self._data_type = 'list'


class NoneVariable(Variable):
	"""
	This represents a single code variable that happens to be a None.
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._initialization_value = initialization_value
		self._data_type = 'None'


class IntegerVariable(Variable):
	"""
	This represents a single code variable that happens to be a Integer.
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._initialization_value = initialization_value
		self._data_type = 'int'


class StringVariable(Variable):
	"""
	This represents a single code variable that happens to be a String.
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._initialization_value = initialization_value
		self._data_type = 'str'


class LocalDictionaryVariable(Variable):
	"""
	This represents a single local variable that happens to be the data type of Dictionary.
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'dict'
		self._local_variable = True
		self._initialization_value = initialization_value
		self._is_parameter = False
		self._should_be_initialized = True


class LocalObjectVariable(Variable):
	"""
	This represents a single local variable that happens to be the data type of Object.
	"""

	def __init__(self, initialization_value, documentation, extra_data = None):
		super().__init__(documentation, extra_data)
		self._data_type = 'object'
		self._local_variable = True
		self._initialization_value = initialization_value
		self._is_parameter = False
		self._should_be_initialized = True


class LocalBooleanVariable(Variable):
	"""
	This represents a single local variable that happens to be the data type of Boolean.
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'bool'
		self._local_variable = True
		self._initialization_value = initialization_value
		self._is_parameter = False
		self._should_be_initialized = True


class LocalFloatVariable(Variable):
	"""
	This represents a single local variable that happens to be the data type of Float.
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'float'
		self._local_variable = True
		self._initialization_value = initialization_value
		self._is_parameter = False
		self._should_be_initialized = True


class LocalListVariable(Variable):
	"""
	This represents a single local variable that happens to be the data type of List.
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'list'
		self._local_variable = True
		self._initialization_value = initialization_value
		self._is_parameter = False
		self._should_be_initialized = True


class LocalNoneVariable(Variable):
	"""
	This represents a single local variable that happens to be the data type of None.
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'None'
		self._local_variable = True
		self._initialization_value = initialization_value
		self._is_parameter = False
		self._should_be_initialized = True


class LocalIntegerVariable(Variable):
	"""
	This represents a single local variable that happens to be the data type of Integer.
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'int'
		self._local_variable = True
		self._initialization_value = initialization_value
		self._is_parameter = False
		self._should_be_initialized = True


class LocalStringVariable(Variable):
	"""
	This represents a single local variable that happens to be the data type of String.
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'str'
		self._local_variable = True
		self._initialization_value = initialization_value
		self._is_parameter = False
		self._should_be_initialized = True


class DictionaryParameter(Variable):
	"""
	This represents a single function parameter ( a Dictionary specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'dict'
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = False


class ObjectParameter(Variable):
	"""
	This represents a single function parameter ( a Object specifically ).
	"""

	def __init__(self, documentation, extra_data = None):
		super().__init__(documentation, extra_data)
		self._data_type = 'object'
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = False


class BooleanParameter(Variable):
	"""
	This represents a single function parameter ( a Boolean specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'bool'
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = False


class FloatParameter(Variable):
	"""
	This represents a single function parameter ( a Float specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'float'
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = False


class ListParameter(Variable):
	"""
	This represents a single function parameter ( a List specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'list'
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = False


class NoneParameter(Variable):
	"""
	This represents a single function parameter ( a None specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'None'
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = False


class IntegerParameter(Variable):
	"""
	This represents a single function parameter ( a Integer specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'int'
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = False


class StringParameter(Variable):
	"""
	This represents a single function parameter ( a String specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'str'
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = False


class DictionaryField(Variable):
	"""
	This represents a single class field ( a Dictionary specifically ).
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'dict'
		self._initialization_value = initialization_value
		self._local_variable = False
		self._is_parameter = False
		self._should_be_initialized = True


class ObjectField(Variable):
	"""
	This represents a single class field ( a Object specifically ).
	"""

	def __init__(self, initialization_value, documentation, extra_data = None):
		super().__init__(documentation, extra_data)
		self._data_type = 'object'
		self._initialization_value = initialization_value
		self._local_variable = False
		self._is_parameter = False
		self._should_be_initialized = True


class BooleanField(Variable):
	"""
	This represents a single class field ( a Boolean specifically ).
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'bool'
		self._initialization_value = initialization_value
		self._local_variable = False
		self._is_parameter = False
		self._should_be_initialized = True


class FloatField(Variable):
	"""
	This represents a single class field ( a Float specifically ).
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'float'
		self._initialization_value = initialization_value
		self._local_variable = False
		self._is_parameter = False
		self._should_be_initialized = True


class ListField(Variable):
	"""
	This represents a single class field ( a List specifically ).
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'list'
		self._initialization_value = initialization_value
		self._local_variable = False
		self._is_parameter = False
		self._should_be_initialized = True


class NoneField(Variable):
	"""
	This represents a single class field ( a None specifically ).
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'None'
		self._initialization_value = initialization_value
		self._local_variable = False
		self._is_parameter = False
		self._should_be_initialized = True


class IntegerField(Variable):
	"""
	This represents a single class field ( a Integer specifically ).
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'int'
		self._initialization_value = initialization_value
		self._local_variable = False
		self._is_parameter = False
		self._should_be_initialized = True


class StringField(Variable):
	"""
	This represents a single class field ( a String specifically ).
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'str'
		self._initialization_value = initialization_value
		self._local_variable = False
		self._is_parameter = False
		self._should_be_initialized = True


class DictionaryFieldWithGetter(Variable):
	"""
	This represents a single class field ( a Dictionary specifically ).
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'dict'
		self._initialization_value = initialization_value
		self._local_variable = False
		self._is_parameter = False
		self._should_be_initialized = True
		self._should_have_getter = True


class ObjectFieldWithGetter(Variable):
	"""
	This represents a single class field ( a Object specifically ).
	"""

	def __init__(self, initialization_value, documentation, extra_data = None):
		super().__init__(documentation, extra_data)
		self._data_type = 'object'
		self._initialization_value = initialization_value
		self._local_variable = False
		self._is_parameter = False
		self._should_be_initialized = True
		self._should_have_getter = True


class BooleanFieldWithGetter(Variable):
	"""
	This represents a single class field ( a Boolean specifically ).
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'bool'
		self._initialization_value = initialization_value
		self._local_variable = False
		self._is_parameter = False
		self._should_be_initialized = True
		self._should_have_getter = True


class FloatFieldWithGetter(Variable):
	"""
	This represents a single class field ( a Float specifically ).
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'float'
		self._initialization_value = initialization_value
		self._local_variable = False
		self._is_parameter = False
		self._should_be_initialized = True
		self._should_have_getter = True


class ListFieldWithGetter(Variable):
	"""
	This represents a single class field ( a List specifically ).
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'list'
		self._initialization_value = initialization_value
		self._local_variable = False
		self._is_parameter = False
		self._should_be_initialized = True
		self._should_have_getter = True


class NoneFieldWithGetter(Variable):
	"""
	This represents a single class field ( a None specifically ).
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'None'
		self._initialization_value = initialization_value
		self._local_variable = False
		self._is_parameter = False
		self._should_be_initialized = True
		self._should_have_getter = True


class IntegerFieldWithGetter(Variable):
	"""
	This represents a single class field ( a Integer specifically ).
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'int'
		self._initialization_value = initialization_value
		self._local_variable = False
		self._is_parameter = False
		self._should_be_initialized = True
		self._should_have_getter = True


class StringFieldWithGetter(Variable):
	"""
	This represents a single class field ( a String specifically ).
	"""

	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type = 'str'
		self._initialization_value = initialization_value
		self._local_variable = False
		self._is_parameter = False
		self._should_be_initialized = True
		self._should_have_getter = True


class PassedInDictionaryField(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a Dictionary specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'dict'
		self._initialization_value = self.get_name_without_hidden_character()
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = True


class PassedInObjectField(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a Object specifically ).
	"""

	def __init__(self, documentation, extra_data = None):
		super().__init__(documentation, extra_data)
		self._data_type = 'object'
		self._initialization_value = self.get_name_without_hidden_character()
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = True


class PassedInBooleanField(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a Boolean specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'bool'
		self._initialization_value = self.get_name_without_hidden_character()
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = True


class PassedInFloatField(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a Float specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'float'
		self._initialization_value = self.get_name_without_hidden_character()
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = True


class PassedInListField(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a List specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'list'
		self._initialization_value = self.get_name_without_hidden_character()
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = True


class PassedInNoneField(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a None specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'None'
		self._initialization_value = self.get_name_without_hidden_character()
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = True


class PassedInIntegerField(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a Integer specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'int'
		self._initialization_value = self.get_name_without_hidden_character()
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = True


class PassedInStringField(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a String specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'str'
		self._initialization_value = self.get_name_without_hidden_character()
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = True


class PassedInDictionaryFieldWithGetter(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a Dictionary specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'dict'
		self._initialization_value = self.get_name_without_hidden_character()
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = True
		self._should_have_getter = True


class PassedInObjectFieldWithGetter(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a Object specifically ).
	"""

	def __init__(self, documentation, extra_data = None):
		super().__init__(documentation, extra_data)
		self._data_type = 'object'
		self._initialization_value = self.get_name_without_hidden_character()
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = True
		self._should_have_getter = True


class PassedInBooleanFieldWithGetter(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a Boolean specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'bool'
		self._initialization_value = self.get_name_without_hidden_character()
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = True
		self._should_have_getter = True


class PassedInFloatFieldWithGetter(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a Float specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'float'
		self._initialization_value = self.get_name_without_hidden_character()
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = True
		self._should_have_getter = True


class PassedInListFieldWithGetter(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a List specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'list'
		self._initialization_value = self.get_name_without_hidden_character()
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = True
		self._should_have_getter = True


class PassedInNoneFieldWithGetter(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a None specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'None'
		self._initialization_value = self.get_name_without_hidden_character()
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = True
		self._should_have_getter = True


class PassedInIntegerFieldWithGetter(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a Integer specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'int'
		self._initialization_value = self.get_name_without_hidden_character()
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = True
		self._should_have_getter = True


class PassedInStringFieldWithGetter(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a String specifically ).
	"""

	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type = 'str'
		self._initialization_value = self.get_name_without_hidden_character()
		self._local_variable = False
		self._is_parameter = True
		self._should_be_initialized = True
		self._should_have_getter = True


# -------------------------------------------------------------------------------------------------------------------------------------------------------


class VariableChunk:
	"""
	This represents a group of variables that belong together visually.
	"""

	def __init__(self, documentation, variables):
		self._documentation = documentation
		self._variables = variables
		self._tabs = 0
		self._name = None
		self._idx = 0
		self._required_libraries = []

	def add_required_library(self, library):
		self._required_libraries.append(library)

	def get_required_libraries(self):
		return self._required_libraries

	def get_variables_data_type(self):
		return self._variables[0].get_data_type()

	def __iter__(self):
		return iter(self._variables)

	def get_documentation(self):
		"""Get this variable chunk's documentation.
		:return: The documentation as a string.
		"""
		return self._documentation

	def get_name(self):
		"""Gets the name of this variable chunk.
		:return: The name as a string.
		"""
		return self._name

	def set_tabbing(self, tabbing_size):
		"""Set the number of tabs to start each line with.
		:param tabbing_size: The number of tabs.
		:return: Void.
		"""
		self._tabs = tabbing_size

	def get_variables(self):
		"""Simple function to return the list of variables that this variable chunk is composed of.
		:return: A list of variables that this variable chunk is composed of.
		"""
		return self._variables

	def __str__(self):
		code_text = ''
		for v in self._variables:
			code_text += get_x_tabs(self._tabs) + str(v) + '\n'
		code_text = formatting.sort_by_deliminator('=', code_text)
		return '# ' + self._documentation + '\n' + code_text

	def add_variable(self, variable):
		"""Add a variable to this variable chunk.
		:param variable: The variable to add.
		:return: Void.
		"""
		self._variables.append(variable)


#

def get_type_of_global_variable_by_name(variable_name):
	for vc in all_variable_chunks:
		for v in vc:
			if variable_name == v.get_name():
				return v.get_data_type()
	return None


# Often used variable chunks.

# Supported Data Types.
variable_data_type_none = StringVariable('None', 'Stores the value of the keyword that python uses for this variable data type {none}.')
variable_data_type_none._name = 'DATA_TYPE_NONE'
variable_data_type_boolean = StringVariable('bool', 'Stores the value of the keyword that python uses for this variable data type {boolean}.')
variable_data_type_boolean._name = 'DATA_TYPE_BOOLEAN'
variable_data_type_dictionary = StringVariable('dict', 'Stores the value of the keyword that python uses for this variable data type {dictionary}.')
variable_data_type_dictionary._name = 'DATA_TYPE_DICTIONARY'
variable_data_type_string = StringVariable('str', 'Stores the value of the keyword that python uses for this variable data type {string}.')
variable_data_type_string._name = 'DATA_TYPE_STRING'
variable_data_type_float = StringVariable('float', 'Stores the value of the keyword that python uses for this variable data type {float}.')
variable_data_type_float._name = 'DATA_TYPE_FLOAT'
variable_data_type_object = StringVariable('object', 'Stores the value of the keyword that python uses for this variable data type {object}.')
variable_data_type_object._name = 'DATA_TYPE_OBJECT'
variable_data_type_integer = StringVariable('int', 'Stores the value of the keyword that python uses for this variable data type {integer}.')
variable_data_type_integer._name = 'DATA_TYPE_INTEGER'
variable_data_type_list = StringVariable('list', 'Stores the value of the keyword that python uses for this variable data type {list}.')
variable_data_type_list._name = 'DATA_TYPE_LIST'
variable_data_type_all_list = ListVariable(
	[variable_data_type_none, variable_data_type_boolean, variable_data_type_dictionary, variable_data_type_string, variable_data_type_float, variable_data_type_object, variable_data_type_integer,
	 variable_data_type_list], 'Store a list of all the data types supported.')
variable_data_type_all_list._name = 'DATA_TYPES_ALL'
variable_data_type_utility_list = [variable_data_type_none, variable_data_type_boolean, variable_data_type_dictionary, variable_data_type_string, variable_data_type_float, variable_data_type_object,
                                   variable_data_type_integer, variable_data_type_list, variable_data_type_all_list]
variable_chunk_data_types = VariableChunk('Some supported Python data types that this application will support as well.', variable_data_type_utility_list)
variable_chunk_data_types._name = 'variable_chunk_data_types'

# Supported Environments.
variable_environment_dev = StringVariable('dev', 'Store the string representation of the Development Environment.')
variable_environment_dev._name = 'ENVIRONMENT_DEV'
variable_environment_qa = StringVariable('qa', 'Store the string representation of the Quality Assurance Environment.')
variable_environment_qa._name = 'ENVIRONMENT_QA'
variable_environment_prod = StringVariable('prod', 'Store the string representation of the Production Environment.')
variable_environment_prod._name = 'ENVIRONMENT_PROD'
variable_environment_all = ListVariable([variable_environment_dev, variable_environment_qa, variable_environment_prod], 'Stores a list of all the string representations for Environments.')
variable_environment_all._name = 'ENVIRONMENT_ALL'
variable_chunk_environments = VariableChunk('The different software environments that exist.', [variable_environment_dev, variable_environment_qa, variable_environment_prod, variable_environment_all])
variable_chunk_environments._name = 'variable_chunk_environments'

# ServerMessage dictionary keys (utility variables).
variable_server_message_content = StringVariable('content', 'The main message that was sent.')
variable_server_message_content._name = 'CONTENT'
variable_server_message_server_from = StringVariable('server_from', 'The server that originally sent this message.')
variable_server_message_server_from._name = 'SERVER_FROM'
variable_server_message_server_to = StringVariable('server_to', 'The server that received this message.')
variable_server_message_server_to._name = 'SERVER_TO'
variable_chunk_server_message_utility_variables = VariableChunk('Utility variables to access dictionary keys.', [variable_server_message_content, variable_server_message_server_from, variable_server_message_server_to])
variable_chunk_server_message_utility_variables._name = 'variable_chunk_server_message_utility_variables'

# Environment paths.
PROJECT_DIRECTORY = StringVariable("DC:(os.getcwd()+'/')[0:(os.getcwd()+'/').rfind('/urbtek/')+len('/urbtek/')]", 'The base directory of the project.')
PROJECT_DIRECTORY._name = 'PROJECT_DIRECTORY'
DEV_DIRECTORY = StringVariable("DC:PROJECT_DIRECTORY + 'dev'", 'The path location to the dev environment.')
DEV_DIRECTORY._name = 'DEV_DIRECTORY'
DEV_PID_DIRECTORY = StringVariable("DC:DEV_DIRECTORY + '/server_pids/'", 'The path location to the dev pids.')
DEV_PID_DIRECTORY._name = 'DEV_PID_DIRECTORY'
QA_DIRECTORY = StringVariable("DC:PROJECT_DIRECTORY + 'qa'", 'The path location to the qa environment.')
QA_DIRECTORY._name = 'QA_DIRECTORY'
QA_PID_DIRECTORY = StringVariable("DC:QA_DIRECTORY + '/server_pids/'", 'The path location to the qa pids.')
QA_PID_DIRECTORY._name = 'QA_PID_DIRECTORY'
PROD_DIRECTORY = StringVariable("DC:PROJECT_DIRECTORY + 'prod'", 'The path location to the prod environment.')
PROD_DIRECTORY._name = 'PROD_DIRECTORY'
PROD_PID_DIRECTORY = StringVariable("DC:PROD_DIRECTORY + '/server_pids/'", 'The path location to the prod pids.')
PROD_PID_DIRECTORY._name = 'PROD_PID_DIRECTORY'
ALL_PID_DIRECTORIES = ListVariable([DEV_PID_DIRECTORY, QA_PID_DIRECTORY, PROD_PID_DIRECTORY], 'All the directories that contain running server PIDs.')
ALL_PID_DIRECTORIES._name = 'ALL_PID_DIRECTORIES'
variable_chunk_environment_paths = VariableChunk('The paths for different environments.',
                                                 [PROJECT_DIRECTORY, DEV_DIRECTORY, DEV_PID_DIRECTORY, QA_DIRECTORY, QA_PID_DIRECTORY, PROD_DIRECTORY, PROD_PID_DIRECTORY, ALL_PID_DIRECTORIES])
variable_chunk_environment_paths._name = 'variable_chunk_environment_paths'

# ServerMessages that could be sent.
manual_to_nexus_run_django = StringVariable('run_django_project : ', 'This command will launch the django project.')
manual_to_nexus_run_django._name = 'MTN_run_django'
nexus_to_peon_run_django = StringVariable('run_django_project : ', 'This command will launch the django project.')
nexus_to_peon_run_django._name = 'NTP_run_django'
peon_to_nexus_verify = StringVariable('verify_peon_existence : ', 'This command registers the peon with the nexus.')
peon_to_nexus_verify._name = 'PTN_verify_peon'
terminate_server_message = StringVariable('terminate_server', 'This command will attempt to terminate whichever server server recieves this message.')
terminate_server_message._name = 'terminate_server'
variable_chunk_server_messages = VariableChunk('All the server messages that can be sent from the Nexus to a Peon and vise versa. NTP = \'Nexus To Peon\', PTN = \'Peon to Nexus\'',
                                               [nexus_to_peon_run_django, peon_to_nexus_verify])
variable_chunk_server_messages._name = 'variable_chunk_server_messages'
reply_success = StringVariable('reply_success', 'This is a reply to a command indicating that the command was executed successfully.')
reply_success._name = 'REPLY_SUCCESS'
reply_fail = StringVariable('reply_fail', 'This is a reply to a command indicating that the command failed.')
reply_fail._name = 'REPLY_FAIL'

# Saved Hosts and Ports.
DEFAULT_HOST = StringVariable('tcp://127.0.0.1:', 'The default host to connect to.')
DEFAULT_HOST._name = 'DEFAULT_HOST'
STARTING_PORT = IntegerVariable(50000, 'The starting port.')
STARTING_PORT._name = 'STARTING_PORT'
variable_chunk_hosts_and_ports = VariableChunk('A utility collection of hosts and ports.', [DEFAULT_HOST, STARTING_PORT])
variable_chunk_hosts_and_ports._name = 'variable_chunk_hosts_and_ports'

# Utility variables for database.
my_sql_default_port = IntegerVariable(3306, 'The default port to be used for MySQL database connections.')
my_sql_default_port._name = 'MySQL_default_port'
utf_8 = StringVariable('utf-8', 'The encoding type.')
utf_8._name = 'UTF_8'
variable_chunk_database_utility_variables = VariableChunk('Utility variables.', [my_sql_default_port, utf_8])
variable_chunk_database_utility_variables._name = 'variable_chunk_database_utility_variables'

# Nexus database connection variables.
_nexus_db_host = StringVariable("DC:base64.decodebytes(bytes('bmV4dXMtZGItbXlzcWwuY2gyaXUzc3NjYzdxLnVzLWVhc3QtMS5yZHMuYW1hem9uYXdzLmNvbQ==', 'utf-8')).decode('utf-8')", 'The database host.')
_nexus_db_host._name = '_nexus_db_host'
_nexus_db_user = StringVariable("DC:base64.decodebytes(bytes('dXRhcnN1bm8=', 'utf-8')).decode('utf-8')", 'The database user.')
_nexus_db_user._name = '_nexus_db_user'
_nexus_db_password = StringVariable("DC:base64.decodebytes(bytes('cTEyd2UzNHI=', 'utf-8')).decode('utf-8')", 'The database password.')
_nexus_db_password._name = '_nexus_db_password'
_nexus_db_name = StringVariable("DC:base64.decodebytes(bytes('ZGF0YWJhc2VfbmFtZQ==', 'utf-8')).decode('utf-8')", 'The database name.')
_nexus_db_name._name = '_nexus_db_name'
_nexus_db_port = IntegerVariable(3306, 'The port to connect to.')
_nexus_db_port._name = '_nexus_db_port'
variable_chunk_nexus_variables = VariableChunk('Variables needed to connect to the Nexus database instance.', [_nexus_db_host, _nexus_db_user, _nexus_db_password, _nexus_db_name, _nexus_db_port])
variable_chunk_nexus_variables._name = 'variable_chunk_nexus_variables'
variable_chunk_nexus_variables.add_required_library(lib.python_library_base64)

all_variable_chunks = [variable_chunk_data_types, variable_chunk_environments, variable_chunk_environment_paths, variable_chunk_server_message_utility_variables, variable_chunk_server_messages,
                       variable_chunk_hosts_and_ports, variable_chunk_database_utility_variables, variable_chunk_nexus_variables]
