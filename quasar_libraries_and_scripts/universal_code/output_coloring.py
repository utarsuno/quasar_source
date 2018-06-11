# coding=utf-8

"""This module, output_coloring.py, is an abstraction to providing color and other syntax to debug/output statements."""

from lazyme import color_print
from code_api.code_abstraction.ascii_comments import _get_ascii_comment


_COLOR_YELLOW = 'yellow'
_COLOR_RED    = 'red'


def _print_ascii(text, color):
	"""Utility function."""
	t = _get_ascii_comment(text)
	for l in t:
		color_print(l, color=color, bold=True)


def print_ascii_yellow(text):
	"""Prints a green ascii comment."""
	_print_ascii(text, _COLOR_YELLOW)


def print_ascii_red(text):
	"""Prints a red ascii comment."""
	_print_ascii(text, _COLOR_RED)


def print_data_with_red_dashes_at_start(text):
	"""Prints data with red dashes at the start."""
	color_print('-> ', color='red', end='')
	color_print(text, color='blue', bold=True)


def print_title(text):
	"""Prints a title text."""
	color_print(text, color='yellow', underline=True, bold=True)


def print_error(text):
	"""Prints error text."""
	color_print(text, color='red', bold=True)


def print_success(text):
	"""Prints success text."""
	color_print(text, color='green')


def print_data(text):
	"""Prints data text. All numbers automatically get made bold."""
	for c in text:
		if c.isdigit():
			color_print(c, color='blue', bold=True, end='')
		else:
			color_print(c, color='blue', end='')
	print()


def print_green(text):
	"""Prints text in green color."""
	color_print(text, color='green')


def print_pink(text):
	"""Prints text in white color."""
	color_print(text, color='pink')
