# coding=utf-8

"""This module, fancy_comments.py, is used just to generate fancy ASCII comments."""

from libraries.code_api.code_abstraction.code_chunk import CodeChunk


ASCII_A = ("    \n"
           " /\\ \n"
           "/~~\\")

ASCII_B = (" __ \n"
           "|__)\n"
           "|__)")

ASCII_C = (" __ \n"
           "/  `\n"
           "\__,")

ASCII_D = (" __ \n"
           "|  \\\n"
           "|__/")

ASCII_E = (" ___\n"
           "|__ \n"
           "|___")

ASCII_F = (" ___\n"
           "|__ \n"
           "|   ")

ASCII_G = (" __ \n"
           "/ _`\n"
           "\__>")

ASCII_H = ("    \n"
           "|__|\n"
           "|  |")

ASCII_I = ("  \n"
           "| \n"
           "| ")

ASCII_J = ("    \n"
           "   |\n"
           "\__/")

ASCII_K = ("    \n"
           "|__/\n"
           "|  \\")

ASCII_L = ("    \n"
           "|   \n"
           "|___")

ASCII_M = ("    \n"
           "|\/|\n"
           "|  |")

ASCII_N = ("    \n"
           "|\ |\n"
           "| \|")

ASCII_O = (" __ \n"
           "/  \\\n"
           "\__/")

ASCII_P = (" __ \n"
           "|__)\n"
           "|   ")

ASCII_Q = (" __ \n"
           "/  \\\n"
           "\__X")

ASCII_R = (" __ \n"
           "|__)\n"
           "|  \\")

ASCII_S = (" __ \n"
           "/__`\n"
           ".__/")

ASCII_T = ("___\n"
           " | \n"
           " | ")

ASCII_U = ("    \n"
           "|  |\n"
           "\__/")

ASCII_V = ("    \n"
           "\  /\n"
           " \/ ")

ASCII_W = ("    \n"
           "|  |\n"
           "|/\|")

ASCII_X = ("   \n"
           "\_/\n"
           "/ \\")

ASCII_Y = ("   \n"
           "\ /\n"
           " | ")

ASCII_Z = ("__\n"
           " /\n"
           "/_")

ASCII_SPACE = ("  \n"
               "  \n"
               "  \n")

letters = [ASCII_A, ASCII_B, ASCII_C, ASCII_D, ASCII_E, ASCII_F, ASCII_G, ASCII_H, ASCII_I, ASCII_J, ASCII_K, ASCII_L, ASCII_M, ASCII_N, ASCII_O, ASCII_P, ASCII_Q, ASCII_R, ASCII_S, ASCII_T, ASCII_U, ASCII_V, ASCII_W, ASCII_X, ASCII_Y, ASCII_Z]


def _get_characters_to_print(string):
	"""Utility function."""
	characters_to_print = []
	for char in string:
		if char is ' ':
			characters_to_print.append(ASCII_SPACE)
		else:
			characters_to_print.append(letters[ord(char) - ord('a')])
	return characters_to_print


def _get_ascii_comment(string_to_print):
	"""Returns string to print as ascii text."""
	characters_to_print = _get_characters_to_print(string_to_print.lower())

	lines = ['', '', '']

	for character in characters_to_print:
		ascii_lines = character.split('\n')
		lines[0] += ascii_lines[0] + ' '
		lines[1] += ascii_lines[1] + ' '
		lines[2] += ascii_lines[2] + ' '

	return lines


def print_header_section(header_section_lines):
	"""Utility function."""
	for l in header_section_lines:
		print(l)


def get_python_comment_header_section(section_name, max_length=120):
	"""Returns an ASCII Python code comment."""
	section_name = section_name.lower()

	lines = _get_ascii_comment(section_name)

	line_one_subtraction = 0
	offset = 3
	print(section_name[0])
	if section_name[0] == 'f':
		offset -= 1
		line_one_subtraction = 1

	spaces = ' ' * offset

	if line_one_subtraction > 0:
		lines[0] = lines[0][line_one_subtraction:]

	# An extra 5 for the ending three quotes and two spaces.
	number_of_underscores = max_length - (len(spaces) + len(lines[2]) + 5)
	underscores           = '_' * number_of_underscores

	lines[0] = "'''" + lines[0]
	lines[1] = spaces + lines[1]
	lines[2] = spaces + lines[2] + underscores + " '''"
	return lines


def get_python_comment_header_sub_section(sub_section_name, max_length=120, start_offset=0):
	"""Returns a single line Python code comment. Used as a sub_section_name."""
	comment = '# '
	i = 0
	while i < start_offset:
		comment = ' ' + comment
		i += 1
	remaining_length = max_length - len(comment)
	# Subtract by two to leave a space on each side of the sub-section name.
	length_for_dashes = int((remaining_length - len(sub_section_name) - 2) / 2)
	dashes = '-' * length_for_dashes
	comment += dashes + ' ' + sub_section_name + ' ' + dashes
	return comment


def get_shell_ascii_comment_as_code_chunk(comment):
	"""Returns an ascii comment for a shell file as a code chunk."""
	single_dashed_line = '# ----------------------------------------------------------------------------'
	lines = _get_ascii_comment(comment)
	lines[0] = '# ' + lines[0]
	lines[1] = '# ' + lines[1]
	lines[2] = '# ' + lines[2]
	lines.insert(0, single_dashed_line)
	lines.append(single_dashed_line)
	return CodeChunk(lines)


'''
file_header = get_python_comment_header_section('FILES')
operations = get_python_comment_header_sub_section('O P E R A T I O N S')
setters = get_python_comment_header_sub_section('S E T T E R S')
getters = get_python_comment_header_sub_section('G E T T E R S')
print_header_section(file_header)
print(operations)
print(setters)
print(getters)
directory_header = get_python_comment_header_section('DIRECTORIES')
print_header_section(directory_header)
'''

'''
operations = get_python_comment_header_sub_section('O P E R A T I O N S', start_offset=4)
setters = get_python_comment_header_sub_section('S E T T E R S', start_offset=4)
getters = get_python_comment_header_sub_section('G E T T E R S', start_offset=4)
print(operations)
print(setters)
print(getters)
'''