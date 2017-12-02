# coding=utf-8

"""
This module, code_generator_compiler.py, will take the '*_generator.py' and convert it to '*.py'.
"""

# Needed for getting the code text as basic Code objects. Basic in the sense that not all information is gathered, only what the parser needed.
from code_manager.code_generator_support import generator_parser
# Has all the *_generator.py's custom keywords needed for library imports.
from code_manager.code_generator_support import custom_keyword_mapping
# Needed for debugging.
from universal_code import debugging as dbg
# Needed to create new Code objects.
from code_manager.abstract_definitions.code import Code
# Needed for basic performance benchmarks.
from universal_code import anything_time_related as atr
# Needed for running the temp generation file.
import subprocess
# Needed for regular expression parsing.
import re

from code_manager.abstract_definitions import variables
from code_manager.abstract_definitions import libraries


base = '/Users/utarsuno/git_repos/urbtek/urbtek/code_manager/'
abstract_definitions_path           = base + 'abstract_definitions'
code_generation_projects_path       = base + 'code_generation_projects/'
temporary_output_path               = code_generation_projects_path + 'temporary_output/'
urbtek_generator_path               = code_generation_projects_path + 'urbtek_generator/'
code_generator_compiler_path        = base + 'code_generator_compiler'
miscellaneous_scripts_path          = base + 'miscellaneous_scripts'



def _create_file_from_codes(codes, output_file_path):
	"""This function will create the physical code file.
	:param codes: The codes that contain the code text.
	:param output_file_path: The full path of the output file.
	:return: Void.
	"""
	with open(output_file_path, 'w') as file_handler:
		for c in codes:
			# Skip the following:
			if not c.is_a_code_block_dump() and not c.is_a_code_line_dump():
				file_handler.write(c._text)


class GenerationFileCompiler:
	"""
	This is a general compiler for *_generator.py files. It will take a generator file and output a *_temp.py file. Running this *_temp.py file will generate the final Python file output.
	"""

	def __init__(self, codes_from_parser, o0, o1):
		self.codes_from_parser          = codes_from_parser
		self.temp_path                  = o0
		self.output_path                = o1

		self._code_file_code_object     = None
		self._previous_class_object     = None
		self._previous_parent_object    = None
		self._previous_child_object     = None
		self._previous_function_object  = None
		self._previous_code_file_object = None

		self._required_variable_chunks = []

		self._function_is_more_recent_than_class = False

		self.parse_codes_from_parser()
		self.add_variable_chunks_needed()
		self.add_libraries_and_timer()

	def parse_codes_from_parser(self):
		for i, c in enumerate(self.codes_from_parser):
			# print('{' + str(i) + '}\t' + str(c), end='')

			# Set to ignore and skip what we don't need to parse.
			if c.is_a_single_line_comment() or c.is_a_comment_block():
				c.ignore_this_line_for_final_output()
			# Skip what we don't need to parse.
			elif c.get_ignore_this_line_for_final_output() or c.get_is_generated() or c.is_an_empty_line() or c.is_a_library_import_statement():
				y = 2
			else:
				# CodeFile.
				if c.is_a_code_file_declaration():
					c.replace_variable_name_with_compiler_name_in_text()
					self.codes_from_parser.insert(i + 1, c.get_generated_code_to_set_variables_name())
					self._code_file_code_object     = c
					self._previous_code_file_object = c
				# Class.
				elif c.is_a_class_declaration_statement():
					c.replace_variable_name_with_compiler_name_in_text()
					self.codes_from_parser.insert(i + 1, c.get_generated_code_to_set_variables_name())
					self.codes_from_parser.insert(i + 2, self._code_file_code_object.get_generated_code_to_add_class(c))

					if c.get_is_a_child_class():
						self.codes_from_parser.insert(i + 3, c.get_generated_code_to_set_parent_class(self._previous_parent_object))
						self._previous_child_object = c
					else:
						self._previous_parent_object = c

					self._previous_class_object              = c
					self._function_is_more_recent_than_class = False
				# Variables.
				elif c.is_a_variable_declaration():
					c.replace_variable_name_with_compiler_name_in_text()
					self.codes_from_parser.insert(i + 1, c.get_generated_code_to_set_variables_name())

					position_of_function  = -1
					position_of_class     = -1
					position_of_code_file = -1

					if self._previous_function_object is not None:
						position_of_function = self.codes_from_parser.index(self._previous_function_object)
					if self._previous_class_object is not None:
						position_of_class = self.codes_from_parser.index(self._previous_class_object)
					if self._previous_code_file_object is not None:
						position_of_code_file = self.codes_from_parser.index(self._previous_code_file_object)

					if position_of_function == -1 and position_of_class == -1 and position_of_code_file != -1:
						self.codes_from_parser.insert(i + 2, self._previous_code_file_object.get_generated_code_to_add_variable(c))
					elif position_of_function == -1:
						self.codes_from_parser.insert(i + 2, self._previous_class_object.get_generated_code_to_add_variable(c))
					elif position_of_function > position_of_class:
						self.codes_from_parser.insert(i + 2, self._previous_function_object.get_generated_code_to_add_variable(c))
					else:
						self.codes_from_parser.insert(i + 2, self._previous_class_object.get_generated_code_to_add_variable(c))
				# Functions.
				elif c.is_a_function_declaration():
					c.replace_variable_name_with_compiler_name_in_text()
					self.codes_from_parser.insert(i + 1, c.get_generated_code_to_set_variables_name())

					if self._previous_child_object is not None or self._previous_parent_object is not None:
						self.codes_from_parser.insert(i + 2, self._previous_class_object.get_generated_code_to_add_function(c))
						self.codes_from_parser.insert(i + 3, self._previous_class_object.get_generated_code_to_set_parent_entity_class_type_for_this_function(c))
						self.codes_from_parser.insert(i + 4, c.get_generated_code_for_custom_code(c.get_compiler_name() + '.set_class_of_constructor_that_this_function_is_in(' + self._previous_class_object.get_compiler_name() + ')\n'))
					else:
						self.codes_from_parser.insert(i + 2, self._code_file_code_object.get_generated_code_to_add_function(c))

					self._previous_function_object           = c
					self._function_is_more_recent_than_class = True
				# c("""...""") and c('...')
				elif c.is_a_code_block_dump() or c.is_a_code_line_dump():
					c.ignore_this_line_for_final_output()
					self.codes_from_parser.insert(i + 1, c.get_generated_code_convert_self_to_functionality_custom())

					if self._function_is_more_recent_than_class:
						self.codes_from_parser.insert(i + 2, self._previous_function_object.get_generated_code_to_add_functionality(c))
					else:
						self.codes_from_parser.insert(i + 2, c.get_generated_code_for_custom_code(c.get_compiler_name() + '.set_number_of_starting_tabs(2)\n'))
						self.codes_from_parser.insert(i + 3, self._previous_class_object.get_generated_code_to_add_functionality(c))
				# cc("""...""") and cc('...')
				elif c.is_a_script_block():
					c.ignore_this_line_for_final_output()
					self.codes_from_parser.insert(i + 1, c.get_generated_code_convert_self_to_script_block())
					self.codes_from_parser.insert(i + 2, self._previous_code_file_object.get_generated_code_to_add_script_block(c))

				# print('{' + str(i) + '} | ' + str(c), end = '')

		#for c in self.codes_from_parser:
		#	if not c.get_ignore_this_line_for_final_output():
		#		print(c, end = '')

	def add_variable_chunks_needed(self):
		all_unique_words = set()
		# First grab every single word from the code object's text.
		for c in self.codes_from_parser:
			word_list = re.sub('[^\w]', ' ', c._text).split()
			for word in word_list:
				all_unique_words.add(word)
		# Now go through every variable chunk and search for a match.
		for vc in variables.all_variable_chunks:
			keep_searching_this_chunk = True
			for v in vc.get_variables():
				if keep_searching_this_chunk:
					if v.get_name() in all_unique_words:
						self._required_variable_chunks.append(vc)
						keep_searching_this_chunk = False
		# Now add the required variable chunks.
		for rvc in self._required_variable_chunks:
			self.codes_from_parser.insert(len(self.codes_from_parser), self.codes_from_parser[0].get_generated_code_for_custom_code(self._code_file_code_object.get_compiler_name() + """.add_variable_chunk(variables.""" + rvc.get_name() + """)\n"""))

	def add_libraries_and_timer(self):

		self.codes_from_parser.insert(1, self.codes_from_parser[0].get_generated_code_for_custom_code('from universal_code import anything_time_related as atr\n'))
		self.codes_from_parser.insert(2, self.codes_from_parser[0].get_generated_code_for_custom_code('temp_code_generation_timer = atr.EasyTimer()\n'))
		self.codes_from_parser.insert(3, self.codes_from_parser[0].get_generated_code_for_custom_code('from code_manager.abstract_definitions.functions import FunctionalityCustom\n'))
		self.codes_from_parser.insert(4, self.codes_from_parser[0].get_generated_code_for_custom_code('from code_manager.abstract_definitions import variables\n'))
		self.codes_from_parser.insert(5, self.codes_from_parser[0].get_generated_code_for_custom_code('from code_manager.abstract_definitions import libraries\n'))

		required_libraries = set()

		# Check each library.
		for library in libraries.all_python_libraries:
			reserved_words = libraries.get_reserved_words_from_library(library.get_name(), library.get_is_system_library())

			# Check each reserved word.
			keep_searching_reserved_words = True
			for word in reserved_words:
				if keep_searching_reserved_words:
					term_to_search_for = library.get_name() + '.' + word
					second_term_to_search_for = ''
					if len(library.get_nickname()) > 1:
						second_term_to_search_for = library.get_nickname() + '.' + word
					for c in self.codes_from_parser:
						if term_to_search_for in c._text:
							required_libraries.add(library)
							keep_searching_reserved_words = False
						if keep_searching_reserved_words and len(second_term_to_search_for) > 0:
							if second_term_to_search_for in c._text:
								required_libraries.add(library)
								keep_searching_reserved_words = False

		for rvc in self._required_variable_chunks:
			for l in rvc.get_required_libraries():
				if l not in required_libraries:
					required_libraries.add(l)

		for l in required_libraries:
			self.codes_from_parser.insert(len(self.codes_from_parser), self.codes_from_parser[0].get_generated_code_for_custom_code(self._code_file_code_object.get_compiler_name() + '.add_library(libraries.python_library_' + l.get_name() + ')\n'))

		self.codes_from_parser.insert(len(self.codes_from_parser), self.codes_from_parser[0].get_generated_code_for_custom_code("""print('It took an ' + str(temp_code_generation_timer) + ' to generate the code.')\n"""))
		self.codes_from_parser.insert(len(self.codes_from_parser), self.codes_from_parser[0].get_generated_code_for_custom_code("""file_generation_timer = atr.EasyTimer()\n"""))
		self.codes_from_parser.insert(len(self.codes_from_parser), self.codes_from_parser[0].get_generated_code_for_custom_code(self._code_file_code_object.get_compiler_name() + """.create_physical_file_in_specified_output('""" + self.output_path + """')\n"""))
		self.codes_from_parser.insert(len(self.codes_from_parser), self.codes_from_parser[0].get_generated_code_for_custom_code("""print('It took an ' + str(file_generation_timer) + ' to write the code file.')\n"""))


def compile_generation_file(codes_from_parser, temp_file_path, output_file_path):
	"""This function will compile the *_generator.py into a *_temp.py, the temp file generates the actual *.py file.
	:param codes_from_parser: The codes to extract information from.
	:param temp_file_path: The path to place the temp file into.
	:param output_file_path: The final path that the file gets placed into.
	:return: Void.
	"""

	compiler_run_time = atr.EasyTimer()
	gfc = GenerationFileCompiler(codes_from_parser, temp_file_path.replace('.py', '_temp.py'), output_file_path)
	_create_file_from_codes(gfc.codes_from_parser, temp_file_path)

	print('It took an ' + str(compiler_run_time) + ' to compile the generation code.')

	p = subprocess.Popen(['python3', temp_file_path, '1'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	out, err = p.communicate()

	output = out.decode('utf-8')
	error  = err.decode('utf-8')

	print(output)
	print('---')
	# TODO: !!! Errors should get sent back to the original generation file so that debugging is even quicker !!!
	print(error)

