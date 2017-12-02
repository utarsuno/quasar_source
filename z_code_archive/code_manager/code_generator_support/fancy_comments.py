#!/usr/bin/env python3
# coding=utf-8

"""
This module, fancy_comments.py, is used just to generate fancy ASCII comments.
"""

from universal_code import debugging as dbg

a = ("    \n"
     " /\\ \n"
     "/~~\\")

b = (" __ \n"
     "|__)\n"
     "|__)")

c = (" __ \n"
     "/  `\n"
     "\__,")

d = (" __ \n"
     "|  \\\n"
     "|__/")

e = (" ___\n"
     "|__ \n"
     "|___")

f = (" ___\n"
     "|__ \n"
     "|   ")

g = (" __ \n"
     "/ _`\n"
     "\__>")

h = ("    \n"
     "|__|\n"
     "|  |")

i = ("  \n"
     "| \n"
     "| ")

j = ("    \n"
     "   |\n"
     "\__/")

k = ("    \n"
     "|__/\n"
     "|  \\")

l = ("    \n"
     "|   \n"
     "|___")

m = ("    \n"
     "|\/|\n"
     "|  |")

n = ("    \n"
     "|\ |\n"
     "| \|")

o = (" __ \n"
     "/  \\\n"
     "\__/")

p = (" __ \n"
     "|__)\n"
     "|   ")

q = (" __ \n"
     "/  \\\n"
     "\__X")

r = (" __ \n"
     "|__)\n"
     "|  \\")

s = (" __ \n"
     "/__`\n"
     ".__/")

t = ("___\n"
     " | \n"
     " | ")

u = ("    \n"
     "|  |\n"
     "\__/")

v = ("    \n"
     "\  /\n"
     " \/ ")

w = ("    \n"
     "|  |\n"
     "|/\|")

x = ("   \n"
     "\_/\n"
     "/ \\")

y = ("   \n"
     "\ /\n"
     " | ")

z = ("__\n"
     " /\n"
     "/_")

space = ("  \n"
         "  \n"
         "  \n")

letters = [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z]


def get_fancy_python_comment(string_to_print):
	"""A utility function to get a single ling comment with text in the middle as a string.
	:param string_to_print: The text to place in the center.
	:return: The python comment as a string.
	"""

	characters_to_print = []

	for char in string_to_print:
		if char is ' ':
			characters_to_print.append(space)
		else:
			characters_to_print.append(letters[ord(char) - ord('a')])

	line_one = '\'\'\''
	line_two = '   '
	line_three = '   '
	line_four = '\'\'\'\n'

	for character in characters_to_print:
		line_one += character.split('\n')[0] + ' '
		line_two += character.split('\n')[1] + ' '
		line_three += character.split('\n')[2] + ' '

	return line_one + '\n' + line_two + '\n' + line_three + '\n' + line_four


# Utility variable.
current_comment_divider_number = 0


def get_comment_divider(text_to_place_in_middle, length_of_longest_line, number=None):
	"""A simple function to get a comment line divider.
	:param number: The number place to at the start of this line.
	:param length_of_longest_line: The length of the longest line.
	:param text_to_place_in_middle: The text to place in the middle of this line.
	:return: The comment as a string.
	"""
	if len(text_to_place_in_middle) > length_of_longest_line:
		dbg.raise_exception(dbg.ParameterException, 'The text to print provided is too long. It\'s over 100 characters.')
	if number is None:
		global current_comment_divider_number
		number = current_comment_divider_number
		current_comment_divider_number += 1
	string = '# '
	dashes = (length_of_longest_line - len(text_to_place_in_middle)) / 2
	i = 5
	string += '0x' + str(number) + ': '
	while i < dashes:
		string += '-'
		i += 1
	string += text_to_place_in_middle
	i = 0
	while i < dashes:
		string += '-'
		i += 1
	if len(text_to_place_in_middle) % 2 == 0:
		string += '-'
	return string + '\n'

