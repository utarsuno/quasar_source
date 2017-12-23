# coding=utf-8

"""This module, output_coloring.py, is an abstraction to providing color and other syntax to debug/output statements."""

from lazyme import color_print
from quasar_source_code.universal_code import string_utilities as su


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
