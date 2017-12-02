# coding=utf-8

"""
This module, generator_parser.py, will be used to give live syntax commenting and formatting to *_generator.py files.
"""

import tempfile

from typing import List

from code_manager.abstract_definitions import classes
from code_manager.abstract_definitions import code_file
from code_manager.abstract_definitions import conditionals
from code_manager.abstract_definitions import functions
from code_manager.abstract_definitions import variables

from code_manager.code_generator_support.file_modifier import FileModifier

from universal_code import debugging as dbg
from code_manager.code_generator_support import fancy_comments

from code_manager.abstract_definitions.code import Code

class_keywords = classes.KEYWORDS_IN_USE_ALL
code_file_keywords = code_file.KEYWORDS_IN_USE_ALL
conditional_keywords = conditionals.KEYWORDS_IN_USE_ALL
function_keywords = functions.KEYWORDS_IN_USE_ALL
variable_keywords = variables.KEYWORDS_IN_USE_ALL


def does_line_only_contain_white_space_and_newline(text_to_check) -> bool:
	"""Just a utility function to check if a string is whitespace up until a new line character.
	:param text_to_check: The text to check.
	:return: A boolean indicating true or false.
	"""
	index = 0
	only_whitespace = True
	while index < len(text_to_check) - 1:
		if text_to_check[index] != ' ' or text_to_check[index] != '\t':
			only_whitespace = False
		index += 1
	if only_whitespace:
		if text_to_check[index] == '\n':
			return True
	return False


def has_keyword_match(text_content, keywords_to_check_for):
	"""Just a utility function to see if any of the provided keywords appear in the text.
	:param text_content: The text content to look for keywords in.
	:param keywords_to_check_for: The keywords to look for.
	:return: A boolean indicating if a match was found or not.
	"""
	for w in keywords_to_check_for:
		if w in text_content:
			return True
	return False


def get_the_length_of_the_longest_code_line(codes):
	"""This utility function will return the length of the longest generator code line.
	:param codes: The list of codes to use as reference.
	:return: An integer indicating the length of the longest code line.
	"""
	longest = -1
	for c in codes:
		if c.get_longest_line_length() > longest:
			longest = c.get_longest_line_length()
	return longest


def create_a_single_line_comment(index, content, codes):
	"""Just a utility function to avoid typing the same thing over and over.
	:param index: The current line number in the file.
	:param content: The content of the single line comment code.
	:param codes: The codes to add to.
	:return: Void.
	"""
	code_to_add = Code(content)
	code_to_add.set_to_a_single_line_comment()
	code_to_add.set_last_line_number(index)
	codes.append(code_to_add)


def insert_a_single_line_comment(index, insert_index, content, codes):
	"""Just a utility function to avoid typing the same thing over and over.
	:param index: The current line number in the file.
	:param insert_index: The position in codes to insert into.
	:param content: The content of the single line comment code.
	:param codes: The codes to add to.
	:return: Void.
	"""
	code_to_add = Code(content)
	code_to_add.set_to_a_single_line_comment()
	code_to_add.set_last_line_number(index)
	codes.insert(insert_index, code_to_add)


def create_an_empty_line(index, content, codes):
	"""Just a utility function to avoid typing the same thing over and over.
	:param index: The current line number in the file.
	:param content: The content of the single line comment code.
	:param codes: The codes to add to.
	:return: Void.
	"""
	code_to_add = Code(content)
	code_to_add.set_to_empty_line()
	code_to_add.set_last_line_number(index)
	codes.append(code_to_add)


def create_a_code_dump_line(index, content, codes):
	"""Just a utility function to avoid typing the same thing over and over.
	:param index: The current line number in the file.
	:param content: The content of the single line comment code.
	:param codes: The codes to add to.
	:return: Void.
	"""
	code_to_add = Code(content)
	code_to_add.set_to_a_code_line_dump()
	code_to_add.set_last_line_number(index)
	codes.append(code_to_add)


def create_a_script_block(index, content, codes):
	"""Just a utility function to avoid typing the same thing over and over.
	:param index: The current line number in the file.
	:param content: The content of the single script line code.
	:param codes: The codes to add to.
	:return: Void.
	"""
	code_to_add = Code(content)
	code_to_add.set_to_script_block()
	code_to_add.set_last_line_number(index)
	codes.append(code_to_add)


def create_a_code_dump_block(index, content, codes):
	"""Just a utility function to avoid typing the same thing over and over.
	:param index: The current line number in the file.
	:param content: The content of the single line comment code.
	:param codes: The codes to add to.
	:return: Void.
	"""
	code_to_add = Code(content)
	code_to_add.set_to_a_code_block_dump()
	code_to_add.set_last_line_number(index)
	codes.append(code_to_add)


def create_an_import_statement(index, content, codes):
	"""Just a utility function to avoid typing the same thing over and over.
	:param index: The current line number in the file.
	:param content: The content of the single line comment code.
	:param codes: The codes to add to.
	:return: Void.
	"""
	code_to_add = Code(content)
	code_to_add.set_to_import_statement()
	code_to_add.set_last_line_number(index)
	codes.append(code_to_add)


def create_a_class_declaration(index, content, codes):
	"""Just a utility function to avoid typing the same thing over and over.
	:param index: The current line number in the file.
	:param content: The content of the single line comment code.
	:param codes: The codes to add to.
	:return: Void.
	"""
	code_to_add = Code(content)
	code_to_add.set_to_a_class_declaration()
	code_to_add.set_last_line_number(index)
	codes.append(code_to_add)


def create_a_function_declaration(index, content, codes):
	"""Just a utility function to avoid typing the same thing over and over.
	:param index: The current line number in the file.
	:param content: The content of the single line comment code.
	:param codes: The codes to add to.
	:return: Void.
	"""
	code_to_add = Code(content)
	code_to_add.set_to_a_function_declaration()
	code_to_add.set_last_line_number(index)
	codes.append(code_to_add)


def create_a_conditional_statement(index, content, codes):
	"""Just a utility function to avoid typing the same thing over and over.
	:param index: The current line number in the file.
	:param content: The content of the single line comment code.
	:param codes: The codes to add to.
	:return: Void.
	"""
	code_to_add = Code(content)
	code_to_add.set_to_a_conditional()
	code_to_add.set_last_line_number(index)
	codes.append(code_to_add)


def create_a_variable_declaration(index, content, codes):
	"""Just a utility function to avoid typing the same thing over and over.
	:param index: The current line number in the file.
	:param content: The content of the single line comment code.
	:param codes: The codes to add to.
	:return: Void.
	"""
	code_to_add = Code(content)
	code_to_add.set_to_a_variable_declaration()
	code_to_add.set_last_line_number(index)
	codes.append(code_to_add)


def create_a_code_file_declaration(index, content, codes):
	"""Just a utility function to avoid typing the same thing over and over.
	:param index: The current line number in the file.
	:param content: The content of the single line comment code.
	:param codes: The codes to add to.
	:return: Void.
	"""
	code_to_add = Code(content)
	code_to_add.set_to_a_code_file_declaration()
	code_to_add.set_last_line_number(index)
	codes.append(code_to_add)


def create_a_comment_block(index, content, codes):
	"""Just a utility function to avoid typing the same thing over and over.
	:param index: The current line number in the file.
	:param content: The content of the single line comment code.
	:param codes: The codes to add to.
	:return: Void.
	"""
	code_to_add = Code(content)
	code_to_add.set_to_a_comment_block()
	code_to_add.set_last_line_number(index)
	codes.append(code_to_add)


def get_generation_file_as_code_objects(file_path) -> List[Code]:
	"""Returns the file as a list of code objects.
	:param file_path: The path location of the file.
	:return: A list of code objects.
	"""
	with open(file_path) as f:
		content = f.readlines()
	codes = []

	index = 0

	currently_in_a_comment_block = False
	comment_block_text = ''

	currently_in_a_code_dump_block = False
	code_dump_text = ''

	currently_in_a_script_block = False
	script_block_text = ''

	while index < len(content):
		current_content = content[index]
		# print(current_content, end='')
		# Empty lines.
		if does_line_only_contain_white_space_and_newline(current_content):
			create_an_empty_line(index, current_content, codes)
		# Import statements.
		elif 'from ' in current_content and ' import ' in current_content:
			create_an_import_statement(index, current_content, codes)
		# Single line comment.
		elif current_content.lstrip().startswith('#'):
			create_a_single_line_comment(index, current_content, codes)
		# Comment blocks.
		elif current_content.lstrip().startswith('"""') and not current_content.lstrip().startswith('""")'):
			if not currently_in_a_comment_block:
				comment_block_text += current_content
				currently_in_a_comment_block = True
			else:
				comment_block_text += current_content
				create_a_comment_block(index, comment_block_text, codes)
				comment_block_text = ''
				currently_in_a_comment_block = False
		# Inside of a comment block.
		elif currently_in_a_comment_block:
			comment_block_text += current_content
		# Raw code dump single line version.
		elif current_content.lstrip().startswith('c(\''):
			create_a_code_dump_line(index, current_content, codes)
		# Script code single line version.
		elif current_content.lstrip().startswith('cc(\''):
			create_a_script_block(index, current_content, codes)
		# Script code block start.
		elif current_content.lstrip().startswith('cc("""'):
			script_block_text += current_content
			currently_in_a_script_block = True
		# Raw code dump block start.
		elif current_content.lstrip().startswith('c("""'):
			code_dump_text += current_content
			currently_in_a_code_dump_block = True
		# Raw code dump block end OR script code block end.
		elif current_content.lstrip().startswith('""")'):
			if currently_in_a_code_dump_block:
				code_dump_text += current_content
				create_a_code_dump_block(index, code_dump_text, codes)
				code_dump_text = ''
				currently_in_a_code_dump_block = False
			elif currently_in_a_script_block:
				script_block_text += current_content
				create_a_script_block(index, script_block_text, codes)
				script_block_text = ''
				currently_in_a_script_block = False
		# Inside a raw code dump block.
		elif currently_in_a_code_dump_block:
			code_dump_text += current_content
		# Inside a script block.
		elif currently_in_a_script_block:
			script_block_text += current_content
		# Class declaration.
		elif has_keyword_match(current_content, class_keywords):
			create_a_class_declaration(index, current_content, codes)
		# Function declaration.
		elif has_keyword_match(current_content, function_keywords):
			create_a_function_declaration(index, current_content, codes)
		# Conditional declaration.
		elif has_keyword_match(current_content, conditional_keywords):
			create_a_conditional_statement(index, current_content, codes)
		# Variable declaration.
		elif has_keyword_match(current_content, variable_keywords):
			create_a_variable_declaration(index, current_content, codes)
		# CodeFile declaration.
		elif has_keyword_match(current_content, code_file_keywords):
			create_a_code_file_declaration(index, current_content, codes)

		index += 1
	return codes

###################################################################################

library_nickname_mapping = {}
for key in classes.library_nickname_mapping.keys():
	library_nickname_mapping[key] = classes.library_nickname_mapping[key]
for key in code_file.library_nickname_mapping.keys():
	library_nickname_mapping[key] = code_file.library_nickname_mapping[key]
for key in conditionals.library_nickname_mapping.keys():
	library_nickname_mapping[key] = conditionals.library_nickname_mapping[key]
for key in functions.library_nickname_mapping.keys():
	library_nickname_mapping[key] = functions.library_nickname_mapping[key]
for key in variables.library_nickname_mapping.keys():
	library_nickname_mapping[key] = variables.library_nickname_mapping[key]
library_nickname_mapping['c']  = 'from code_manager.code_generator_support.import_error_mask import c'
library_nickname_mapping['cc'] = 'from code_manager.code_generator_support.import_error_mask import cc'
###################################################################################


def get_currently_imported_libraries_from_a_code_list(codes_parameter):
	"""A utility function to get the current list of libraries in the code.
	:param codes_parameter: The codes to search through.
	:return: A list of library names as strings.
	"""
	libraries_currently_imported = []
	for lib in codes_parameter:
		if lib.is_a_library_import_statement():
			words = str(lib).split(' ')
			libraries_currently_imported.append(words[-1].replace('\n', ''))
	return libraries_currently_imported


def get_currently_used_libraries_from_a_code_list(codes_parameter):
	"""A utility function to get the current list of libraries in the code.
	:param codes_parameter: The codes to search through.
	:return: A list of library names as strings.
	"""
	libraries_currently_used = []
	for line in codes_parameter:
		# Go through each custom keyword that we have.
		for key in library_nickname_mapping:
			if key + '(' in str(line):
				libraries_currently_used.append(key)
	return libraries_currently_used


def get_last_import_statement_line_number(codes_parameter):
	"""A utility function to get the line number of the last library import statement. This function will crash the program if there is more than one library import statement block.
	:param codes_parameter: The codes to search through.
	:return: The last line number (of library imports) as an integer.
	"""
	last_line_number = -1
	should_set_last_line_number = False
	number_of_import_statement_blocks = 0
	for index, line in enumerate(codes_parameter):
		if line.is_a_library_import_statement():
			should_set_last_line_number = True
		else:
			if should_set_last_line_number:
				number_of_import_statement_blocks += 1
				last_line_number = codes_parameter[index - 1].get_last_line_number()
				should_set_last_line_number = False
	if number_of_import_statement_blocks != 1:
		dbg.terminate('There is either none or more than one library import statement blocks!')
	return last_line_number + 1 # We want the line after it to be modified, not before it.


def get_index_of_first_empty_line_above_code(current_index, codes):
	"""Just a utility function to get the line number of the first code that is an empty line that is above the current_index. -1 if none found.
	:param current_index: The index to start searching above from. (Numerically the index will be decreasing)
	:param codes: The list of codes.
	:return: The index if found or -1, as an integer.
	"""
	index = current_index
	while index > -1:
		if codes[index].is_an_empty_line():
			return index
		index -= 1
	return -1


def get_index_of_first_empty_line_below_code(current_index, codes):
	"""Just a utility function to get the line number of the first code taht is an empty line that is below the current_index.
	:param current_index: The index to start searching below from. (Numerically the index will be increasing)
	:param codes: The list of codes.
	:return: The index if found or -1, as an integer.
	"""
	index = current_index
	while index < len(codes):
		if codes[index].is_an_empty_line():
			return index
		index += 1
	return -1


def parse_generator_file(file_path):
	"""This function will provide live assistance to generator files.
	:param file_path: The file path to the generator file.
	:return: Void.
	"""
	file_name = file_path
	codes = get_generation_file_as_code_objects(file_name)
	#for c in codes:
	#	print(c, end='')

	currently_used_libraries     = get_currently_used_libraries_from_a_code_list(codes)
	currently_imported_libraries = get_currently_imported_libraries_from_a_code_list(codes)
	missing_imports              = set(currently_used_libraries) - set(currently_imported_libraries)

	if len(missing_imports) > 0:
		with FileModifier(file_name) as file_pointer:
			for mi in missing_imports:
				file_pointer.write_line(library_nickname_mapping[mi], get_last_import_statement_line_number(codes))


	'''
	# Files are imported now check for class commenting needed.
	index = 0
	while index < len(codes):
		current_line = codes[index]
		#print(str(current_line), end='')

		if current_line.is_a_class_declaration_statement():
			#print(str(codes[index - 1]), end='')
			#print(str(current_line), end='')
			first_empty_line_above = get_index_of_first_empty_line_above_code(index, codes)
			first_empty_line_below = get_index_of_first_empty_line_below_code(index, codes)
			if first_empty_line_above == -1:
				dbg.terminate('Something went wrong.')
			elif first_empty_line_below == -1:
				dbg.terminate('Something else went wrong.')

			# What the starting class comment should be.
			#start_comment = fancy_comments.get_comment_divider('Class name here', get_the_length_of_the_longest_code_line(codes))
			start_comment = 'YOLO'

			# There currently exists no starting class comment.
			if first_empty_line_above + 1 == index:
				print(codes[first_empty_line_above + 1])
				#print(index)
				insert_a_single_line_comment(index, first_empty_line_above, start_comment, codes)
				index += 1
				#print(index)
				#print(codes)

			else:
				y = 2
				# double check the existing comment.


			# Insert comment below.
			#code_to_add = Code(fancy_comments.get_comment_divider("Class name here", ))
			#code_to_add.set_to_a_single_line_comment()
			#codes.insert

			#print(str(codes[first_empty_line]), end='')
			#print(str(current_line), end='')
		index += 1
	'''


