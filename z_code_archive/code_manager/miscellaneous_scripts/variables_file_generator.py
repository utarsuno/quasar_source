# coding=utf-8

"""
Just doing some tests here.
"""

variables = '''class ARG0Variable(Variable):
	"""
	This represents a single code variable that happens to be a ARG0.
	"""
	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._initialization_value = initialization_value
		self._data_type            = \'ARG1\''''

local_variables = '''class LocalARG0Variable(Variable):
	"""
	This represents a single local variable that happens to be the data type of ARG0.
	"""
	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type             = \'ARG1\'
		self._local_variable        = True
		self._initialization_value  = initialization_value
		self._is_parameter          = False
		self._should_be_initialized = True'''

parameters = '''class ARG0Parameter(Variable):
	"""
	This represents a single function parameter ( a ARG0 specifically ).
	"""
	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type             = \'ARG1\'
		self._local_variable        = False
		self._is_parameter          = True
		self._should_be_initialized = False'''

class_fields = '''class ARG0Field(Variable):
	"""
	This represents a single class field ( a ARG0 specifically ).
	"""
	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type             = \'ARG1\'
		self._initialization_value  = initialization_value
		self._local_variable        = False
		self._is_parameter          = False
		self._should_be_initialized = True'''

class_fields_with_getter = '''class ARG0FieldWithGetter(Variable):
	"""
	This represents a single class field ( a ARG0 specifically ).
	"""
	def __init__(self, initialization_value, documentation):
		super().__init__(documentation)
		self._data_type             = \'ARG1\'
		self._initialization_value  = initialization_value
		self._local_variable        = False
		self._is_parameter          = False
		self._should_be_initialized = True
		self._should_have_getter    = True'''

class_passed_in_fields = '''class PassedInARG0Field(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a ARG0 specifically ).
	"""
	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type             = \'ARG1\'
		self._initialization_value  = self.get_name_without_hidden_character()
		self._local_variable        = False
		self._is_parameter          = True
		self._should_be_initialized = True'''

class_passed_in_fields_with_getter = '''class PassedInARG0FieldWithGetter(Variable):
	"""
	This represents a single class field that gets passed in through the constructor ( a ARG0 specifically ).
	"""
	def __init__(self, documentation):
		super().__init__(documentation)
		self._data_type             = \'ARG1\'
		self._initialization_value  = self.get_name_without_hidden_character()
		self._local_variable        = False
		self._is_parameter          = True
		self._should_be_initialized = True
		self._should_have_getter    = True'''


data_types = {'Boolean': 'bool', 'Integer': 'int', 'String': 'str', 'Float': 'float', 'List': 'list', 'Dictionary': 'dict', 'Object': 'object', 'None': 'None'}

#for dt in data_types:
#	print('\'ARG0Parameter'.replace('ARG0', dt) + '(\', ', end='')
#print()
#exit(1)


for dt in data_types.keys():
	print(variables.replace('ARG0', dt).replace('ARG1', data_types[dt]))
	print('\n')

for dt in data_types.keys():
	print(local_variables.replace('ARG0', dt).replace('ARG1', data_types[dt]))
	print('\n')

for dt in data_types.keys():
	print(parameters.replace('ARG0', dt).replace('ARG1', data_types[dt]))
	print('\n')

for dt in data_types.keys():
	print(class_fields.replace('ARG0', dt).replace('ARG1', data_types[dt]))
	print('\n')

for dt in data_types.keys():
	print(class_fields_with_getter.replace('ARG0', dt).replace('ARG1', data_types[dt]))
	print('\n')

for dt in data_types.keys():
	print(class_passed_in_fields.replace('ARG0', dt).replace('ARG1', data_types[dt]))
	print('\n')

for dt in data_types.keys():
	print(class_passed_in_fields_with_getter.replace('ARG0', dt).replace('ARG1', data_types[dt]))
	print('\n')

print('#####################################################################')
keywords_in_use = []
library_nickname_mapping = []
print('KEYWORDS_REGULAR_VARIABLES                      = [', end='')
for dt in data_types.keys():
	text = "'" + dt[0] + "V(', "
	print(text, end='')
	keywords_in_use.append("' = " + dt[0] + "V(', ")
	library_nickname_mapping.append(text + ': \'' + dt + 'Variable\'')
print(']')
print('KEYWORDS_PASSED_IN_CLASS_FIELDS                 = [', end='')
for dt in data_types.keys():
	text = "'PI" + dt[0] + "F(', "
	print(text, end='')
	keywords_in_use.append("' = PI" + dt[0] + "F(', ")
	library_nickname_mapping.append(text + ': \'PassedIn' + dt + 'Field\'')
print(']')
print('KEYWORDS_PASSED_IN_CLASS_FIELDS_WITH_GETTER     = [', end='')
for dt in data_types.keys():
	text = "'PI" + dt[0] + "FWG(', "
	print(text, end='')
	keywords_in_use.append("' = PI" + dt[0] + "FWG(', ")
	library_nickname_mapping.append(text + ': \'PassedIn' + dt + 'FieldWithGetter\'')
print(']')
print('KEYWORDS_NON_PASSED_IN_CLASS_FIELDS             = [', end='')
for dt in data_types.keys():
	text = "'" + dt[0] + "F(', "
	print(text, end='')
	keywords_in_use.append("' = " + dt[0] + "F(' ,")
	library_nickname_mapping.append(text + ': \'' + dt + 'Field\'')
print(']')
print('KEYWORDS_NON_PASSED_IN_CLASS_FIELDS_WITH_GETTER = [', end='')
for dt in data_types.keys():
	text = "'" + dt[0] + "FWG(', "
	print(text, end='')
	keywords_in_use.append("' = " + dt[0] + "FWG(', ")
	library_nickname_mapping.append(text + ': \'' + dt + 'FieldWithGetter\'')
print(']')
print('KEYWORDS_PARAMETERS                             = [', end='')
for dt in data_types.keys():
	text = "'" + dt[0] + "P(', "
	print(text, end='')
	keywords_in_use.append("' = " + dt[0] + "P(', ")
	library_nickname_mapping.append(text + ': \'' + dt + 'Parameter\'')
print(']')
print('KEYWORDS_LOCAL_VARIABLES                        = [', end='')
for dt in data_types.keys():
	text = "'L" + dt[0] + "V(', "
	print(text, end='')
	keywords_in_use.append("' = " + dt[0] + "V(', ")
	library_nickname_mapping.append(text + ': \'' + dt + 'Variable\'')
print(']')
print('KEYWORDS_PARAMETER_VALUE                        = [', end='')
print("'PV(']")
library_nickname_mapping.append('\'PV\'' + ': \'' + 'ParameterValue\'')
keywords_in_use.append("' = PV(', ")
print('KEYWORDS_IN_USE_ALL                             = [', end='')
for kiu in keywords_in_use:
	print(kiu, end='')
print(']')


print('#####################################################################')

#library_nickname_mapping = {'PC', 'ParentClass',
#                            'CC', 'ChildClass',
#                            }
print('library_nickname_mapping = {', end='')
for lnm in library_nickname_mapping:
	nickname = lnm.replace(', ', '').replace('(', '') + ', '
	#print(nickname.split(' '))
	split = nickname.split(' ')
	print(split[0] + ' \'from code_manager.abstract_definitions.variables import ' + split[1].replace('\'', '').replace(',', '') + ' as ' + split[0].replace('\'', '').replace(':', '') + '\', ')
print('}')
