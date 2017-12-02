# coding=utf-8

"""
This module, line_of_code.py, defines the abstracted properties of a line of code.
"""

_IS_AN_IMPORT_STATEMENT     = 'Import Statement     '
_IS_A_COMMENT_BLOCK         = 'Comment Block        '
_IS_A_SINGLE_LINE_COMMENT   = 'Single Line Comment  '
_IS_A_CONDITIONAL           = 'Conditional Statement'
_IS_AN_EMPTY_LINE           = 'Empty Line           '
_IS_A_CLASS_DECLARATION     = 'Class Declaration    '
_IS_A_FUNCTION_DECLARATION  = 'Function Declaration '
_IS_A_VARIABLE_DECLARATION  = 'Variable Declaration '
_IS_A_CODE_FILE_DECLARATION = 'Code File Declaration'
_IS_A_CODE_LINE_DUMP        = 'Code Line Dump       '
_IS_A_CODE_BLOCK_DUMP       = 'Code Block Dump      '
_IS_A_SCRIPT_BLOCK          = 'Script Block         '

_IS_GENERATED               = 'Generated Line       '


# Allows each variable in the *_generator.py to have a unique id.
current_compiler_number = 0


class Code:
	"""
	Represents anywhere from a single to many lines of code.
	"""

	def __init__(self, text):
		self._text                       = text
		text_as_lines = self._text.split('\n')
		max_length = -1
		for l in text_as_lines:
			if len(l) > max_length:
				max_length = len(l)
		self._longest_line_length        = max_length
		self._contained_entities         = []
		self._is_generated               = False
		self._ignore_for_final_output    = False
		self._last_line_number           = None
		self._flags                      = {_IS_AN_IMPORT_STATEMENT: False, _IS_A_COMMENT_BLOCK: False, _IS_A_SINGLE_LINE_COMMENT: False, _IS_A_CONDITIONAL: False,
					                        _IS_AN_EMPTY_LINE: False, _IS_A_CLASS_DECLARATION: False, _IS_A_FUNCTION_DECLARATION: False, _IS_A_VARIABLE_DECLARATION: False,
					                        _IS_A_CODE_FILE_DECLARATION: False, _IS_A_CODE_LINE_DUMP: False, _IS_A_CODE_BLOCK_DUMP: False, _IS_A_SCRIPT_BLOCK: False}
		self._variable_name              = self._text.split(' ')[0]
		self._set_compiler_name()

		# Other useful flags.
		self._is_a_child_class           = None
		self._is_a_parent_class          = None

	def _set_compiler_name(self):
		"""Just a utility variable to set the compiler name for this Code object.
		:return: Void.
		"""
		global current_compiler_number
		self._compiler_name = self._variable_name + '_CN_' + str(current_compiler_number)
		current_compiler_number += 1

	def get_generated_code_to_add_script_block(self, code_file):
		"""This function will return a new Code object that will add a script block to the script file.
		:param code_file: The script file to add script code to.
		:return: The new Code object (reference).
		"""
		code = Code(code_file.get_compiler_name() + '.add_script_code(' + self.get_compiler_name() + ')\n')
		code.set_to_generated_line()
		return code

	def get_generated_code_convert_self_to_script_block(self):
		"""This function will return a new Code object that converts this code block into ScriptCode().
		:return: The Code object that is a ScriptBlock()
		"""
		code = None
		new_text = ''
		self._variable_name = 'sc'
		self._set_compiler_name()
		if self._text.startswith('cc("""'):
			split = self._text.split('\n')[1:-2]
			new_text = self._compiler_name + ' = ScriptCode("""'
			for s in split:
				new_text += s + '\\n'
			new_text += '""")\n'
		elif self._text.startswith('cc(\''):
			new_text = self._compiler_name + ' = ScriptCode("""' + self._text[3:-3] + '""")\n'
		else:
			print('erorororororrrrrr!?!?!?!')
			exit()
		code = Code(new_text)
		code.set_to_generated_line()
		return code

	def get_generated_code_convert_self_to_functionality_custom(self):
		"""This function will return a new Code object that converts this code block into FunctionalityCustom().
		:return: The Code object that is a FunctionalityCustom()
		"""
		code = None
		new_text = ''
		self._variable_name = 'fc'
		self._set_compiler_name()
		if self._text.startswith('c("""'):
			split = self._text.split('\n')[1:-2]
			new_text = self._compiler_name + ' = FunctionalityCustom("""'
			for s in split:
				new_text += s + '\\n'
			new_text += '""")\n'
			#print(new_text, end='')
		elif self._text.startswith('c(\''):
			new_text = self._compiler_name + ' = FunctionalityCustom("""' + self._text[3:-3] + '""")\n'
		else:
			print('error??!')
			exit()
		code = Code(new_text)
		code.set_to_generated_line()
		return code

	def get_ignore_this_line_for_final_output(self):
		"""Returns a boolean indicating if this line should be ignored.
		:return: A boolean indicating if this line should be ignored.
		"""
		return self._ignore_for_final_output

	def ignore_this_line_for_final_output(self):
		"""This function will set this Code to get ignored. This is used during the compilation stage.
		:return: Void.
		"""
		self._ignore_for_final_output = True

	def get_generated_code_to_add_function(self, function):
		"""This function will return a new Code object that has 'self.text' that will add a function to a class.
		:param function: The Code object that is a function declaration.
		:return: The new Code object (reference).
		"""
		code = Code(self._compiler_name + '.add_function(' + function._compiler_name + ')\n')
		code.set_to_generated_line()
		return code

	def get_generated_code_to_set_parent_class(self, parent_class_code):
		"""This fucntion will return a new Code object that has 'self.text' that will set this child class code's parent.
		:param parent_class_code: The parent object to set the parent as.
		:return: The new Code object (reference).
		"""
		code = Code(self._compiler_name + '.set_parent_class(' + parent_class_code.get_compiler_name() + ')\n')
		code.set_to_generated_line()
		return code

	def get_generated_code_to_add_variable(self, variable):
		"""This function will return a new Code object that has 'self.text' that will add this code variable to the provided class.
		:param variable: The Code object that is a variable declaration.
		:return: The new Code object (reference).
		"""
		code = None
		if 'P(\'' in variable._text:
			code = Code(self._compiler_name + '.add_parameter(' + variable._compiler_name + ')\n')
		elif 'F(\'' in variable._text:
			code = Code(self._compiler_name + '.add_field(' + variable._compiler_name + ')\n')
		elif 'FWG(\'' in variable._text:
			code = Code(self._compiler_name + '.add_field(' + variable._compiler_name + ')\n' + self._compiler_name + '.add_getter_for(' + variable._compiler_name + ')\n')
		elif 'PV(\'' in variable._text:
			code = Code(self._compiler_name + '.set_a_parameter_value(' + variable._compiler_name + ')\n')
		else:
			print(self._text)
			print('error?')
			exit(0)
		code.set_to_generated_line()
		return code

	def get_generated_code_to_set_parent_entity_class_type_for_this_function(self, function):
		"""This function will return a new Code object that has 'self.text' that will set the function's parent entity class type.
		:param function: The Code object that is a function declaration.
		:return: The new Code object (reference).
		"""
		code = None
		if 'PC(' in self._text:
			code = Code(function._compiler_name + '.set_parent_entity_class_type(PC)\n')
		else:
			code = Code(function._compiler_name + '.set_parent_entity_class_type(CC)\n')
		code.set_to_generated_line()
		return code

	def get_generated_code_to_add_functionality(self, functionality):
		"""This function will return a new Code object that will add functionality to an entity.
		:param functionality: The functionality to add to the entity.
		:return: The new Code object (reference).
		"""
		code = Code(self._compiler_name + '.add_functionality(' + functionality.get_compiler_name() + ')\n')
		code.set_to_generated_line()
		return code

	def get_generated_code_for_custom_code(self, custom_code):
		"""This function will return a new Code object that has custom code.
		:param custom_code: The custom code to put into the Code.
		:return: The new Code object (reference).
		"""
		code = Code(custom_code)
		code.set_to_generated_line()
		return code

	def get_generated_code_to_add_class(self, class_object):
		"""This function will return a new Code object that has 'self.text' that will add a class to the CodeFile.
		:param class_object: The Code object that is a class declaration.
		:return: The new Code object (reference).
		"""
		code = Code(self._compiler_name + '.add_class(' + class_object._compiler_name + ')\n')
		code.set_to_generated_line()
		return code

	def get_generated_code_to_set_variables_name(self):
		"""This function will return a new Code object that has 'self._text' that will set the variable name for this Code's compiler entity's name.
		:return: The new Code object (reference).
		"""
		code = Code(self._compiler_name + '.set_name(\'' + self._variable_name + '\')\n')
		code.set_to_generated_line()
		return code

	def replace_variable_name_with_compiler_name_in_text(self):
		"""This function will set the variable's name to it's compiler name in the code's text.
		:return: Void.
		"""
		self._text = self._text.replace(self._variable_name, self._compiler_name, 1)

	def get_is_generated(self):
		"""This function will return a boolean indicating if this code was made by the compiler or not.
		:return: A boolean that is True when the compiler has generated this Code object.
		"""
		return self._is_generated

	def get_variable_name(self):
		"""This function will return the variable name of this code's code text.
		:return: The variable name as a string.
		"""
		return self._variable_name

	def get_compiler_name(self):
		"""This function will return the compiler name of this variable.
		:return: The compiler name as a string.
		"""
		return self._compiler_name

	def get_longest_line_length(self):
		"""This function will return the length of this code's longest line as an integer.
		:return: An integer indicating what the length of this code's longest line is.
		"""
		return self._longest_line_length

	def get_last_line_number(self):
		"""Get the last line number that this code reaches.
		:return: An integer indicating the last line number that this code reaches.
		"""
		return self._last_line_number

	def get_is_a_child_class(self):
		return self._is_a_child_class

	def get_is_a_parent_class(self):
		return self._is_a_parent_class

	def set_last_line_number(self, line_number):
		"""Set this code's last line number that it reaches.
		:param line_number: The line number as an integer.
		:return: Void.
		"""
		self._last_line_number = line_number

	def is_a_class_declaration_statement(self):
		"""Returns a boolean indicating if this is a class declaration statement or not.
		:return: Boolean indicating if this is a class declaration statement or not.
		"""
		return self._flags[_IS_A_CLASS_DECLARATION]

	def is_a_code_file_declaration(self):
		"""Returns a boolean indicating if this is a code file declaration.
		:return: Void.
		"""
		return self._flags[_IS_A_CODE_FILE_DECLARATION]

	def is_an_empty_line(self):
		"""Returns a boolean indicating if this is a library statement or not.
		:return: Boolean indicating if this is a library statement or not.
		"""
		return self._flags[_IS_AN_EMPTY_LINE]

	def is_a_comment_block(self):
		"""Returns a boolean indicating if this is a comment block or not.
		:return: Boolean indicating if this is a comment block or not.
		"""
		return self._flags[_IS_A_COMMENT_BLOCK]

	def is_a_single_line_comment(self):
		"""Returns a boolean indicating if this is a single line comment or not.
		:return: Boolean indicating if this is a single line comment or not.
		"""
		return self._flags[_IS_A_SINGLE_LINE_COMMENT]

	def is_a_library_import_statement(self):
		"""Returns a boolean indicating if this is a library statement or not.
		:return: Boolean indicating if this is a library statement or not.
		"""
		return self._flags[_IS_AN_IMPORT_STATEMENT]

	def is_a_variable_declaration(self):
		"""Returns a boolean indicating if this is a variable declaration statement or not.
		:return: Boolean indicating if this is a variable declaration or not.
		"""
		return self._flags[_IS_A_VARIABLE_DECLARATION]

	def is_a_function_declaration(self):
		"""Returns a boolean indicating if this is a function declaration or not.
		:return: Boolean indicating if this is a function declaration or not.
		"""
		return self._flags[_IS_A_FUNCTION_DECLARATION]

	def is_a_code_block_dump(self):
		"""Returns a boolean indicating if this is a code block dump.
		:return: Boolean indicating if this is a code block dump.
		"""
		return self._flags[_IS_A_CODE_BLOCK_DUMP]

	def is_a_code_line_dump(self):
		"""Returns a boolean indicating if this is a code line dump.
		:return: Boolean indicating if this is a code line dump.
		"""
		return self._flags[_IS_A_CODE_LINE_DUMP]

	def is_a_script_block(self):
		"""Returns a boolean indicating if this is a script block.
		:return: Boolean indicating if this is a script block.
		"""
		return self._flags[_IS_A_SCRIPT_BLOCK]

	def set_to_script_block(self):
		"""Sets a boolean flag indicating that this code is a script block.
		:return: Void.
		"""
		self._flags[_IS_A_SCRIPT_BLOCK] = True

	def set_to_generated_line(self):
		"""Sets a boolean flag indicating that this code is generated and not from the original source file.
		:return: Void.
		"""
		self._is_generated = True

	def set_to_a_code_line_dump(self):
		"""Sets a flag indicating that this code is a code line dump statement.
		:return: Void.
		"""
		self._flags[_IS_A_CODE_LINE_DUMP] = True

	def set_to_a_code_block_dump(self):
		"""Sets a flag indicating that this code is a code block dump statement.
		:return: Void.
		"""
		self._flags[_IS_A_CODE_BLOCK_DUMP] = True

	def set_to_a_variable_declaration(self):
		"""Sets a flag indicating that this code is a variable declaration statement.
		:return: Void.
		"""
		self._flags[_IS_A_VARIABLE_DECLARATION] = True

	def set_to_a_code_file_declaration(self):
		"""Sets a flag indicating that this code is a code file declaration statement.
		:return: Void.
		"""
		self._flags[_IS_A_CODE_FILE_DECLARATION] = True

	def set_to_a_class_declaration(self):
		"""Sets a flag indicating that this code is a class declaration statement.
		:return: Void.
		"""
		self._flags[_IS_A_CLASS_DECLARATION] = True
		if 'PC(' in self._text:
			self._is_a_parent_class = True
			self._is_a_child_class  = False
		else:
			self._is_a_parent_class = False
			self._is_a_child_class  = True

	def set_to_a_function_declaration(self):
		"""Sets a flag indicating that this code is a function declaration statement.
		:return: Void.
		"""
		self._flags[_IS_A_FUNCTION_DECLARATION] = True

	def set_to_import_statement(self):
		"""Sets a flag indicating that this code is an import statement.
		:return: Void.
		"""
		self._flags[_IS_AN_IMPORT_STATEMENT] = True

	def set_to_a_single_line_comment(self):
		"""Sets a flag indicating that this code is a single line comment.
		:return: Void.
		"""
		self._flags[_IS_A_SINGLE_LINE_COMMENT] = True

	def set_to_a_comment_block(self):
		"""Sets a flag indicating that this code is a comment block.
		:return: Void.
		"""
		self._flags[_IS_A_COMMENT_BLOCK] = True

	def set_to_a_conditional(self):
		"""Sets a flag indicating that this code is a conditional statement.
		:return: Void.
		"""
		self._flags[_IS_A_CONDITIONAL] = True

	def set_to_empty_line(self):
		"""Sets a flag indicating that this code is an empty line.
		:return: Void.
		"""
		self._flags[_IS_AN_EMPTY_LINE] = True

	def __str__(self):
		text = ''
		if self._is_generated:
			return _IS_GENERATED + ' : [' + str('-1') + '] ' + self._text
		else:
			for key in self._flags.keys():
				if self._flags[key]:
					text = key + ' : [' + str(self._last_line_number) + '] '
			text += self._text
		return text


class GeneratedCode(Code):
	"""Represents anywhere from a single to many lines of code that was generated.
	"""

	def __init__(self, text):
		super().__init__(text)
		self._is_generated = True


class ScriptCode(Code):
	"""Represents anywhere from a
	"""