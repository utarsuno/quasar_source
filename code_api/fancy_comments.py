# coding=utf-8

"""This module, fancy_comments.py, is used just to generate fancy ASCII comments."""

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


def _get_characters_to_print(string):
	"""Utility function."""
	characters_to_print = []
	for char in string:
		if char is ' ':
			characters_to_print.append(space)
		else:
			characters_to_print.append(letters[ord(char) - ord('a')])
	return characters_to_print


def get_fancy_shell_comment(string_to_print):
	"""Gets ascii text for a shell script."""
	characters_to_print = _get_characters_to_print(string_to_print)

	line_one = '# '
	line_two = '# '
	line_three = '# '
	line_four = '# ----------------------------------------------------------------------------'

	for character in characters_to_print:
		line_one += character.split('\n')[0] + ' '
		line_two += character.split('\n')[1] + ' '
		line_three += character.split('\n')[2] + ' '

	return [line_one + '\n', line_two + '\n', line_three + '\n', line_four + '\n']


def get_fancy_python_comment(string_to_print):
	"""A utility function to get a single ling comment with text in the middle as a string.
	:param string_to_print: The text to place in the center.
	:return: The python comment as a string.
	"""
	characters_to_print = _get_characters_to_print(string_to_print)

	line_one = '\'\'\''
	line_two = '   '
	line_three = '   '

	for character in characters_to_print:
		line_one += character.split('\n')[0] + ' '
		line_two += character.split('\n')[1] + ' '
		line_three += character.split('\n')[2] + ' '

	return line_one + '\n' + line_two + '\n' + line_three + '\'\'\'\n'

