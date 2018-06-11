# coding=utf-8

"""This module, fancy_comments.py, is used just to generate fancy ASCII comments."""

from code_api.code_abstraction.code_chunk import CodeChunk

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
	characters_to_print = _get_characters_to_print(string_to_print)

	lines = ['', '', '']

	for character in characters_to_print:
		ascii_lines = character.split('\n')
		lines[0] += ascii_lines[0] + ' '
		lines[1] += ascii_lines[1] + ' '
		lines[2] += ascii_lines[2] + ' '

	return lines


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
