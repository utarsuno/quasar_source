# coding=utf-8

"""This module, output_coloring.py, is an abstraction to providing color and other syntax to debug/output statements."""

from lazyme import color_print
from libraries.code_api.code_abstraction.code_comments import _get_ascii_comment
from libraries.universal_code.common_traits.trait_doubly_linked_lists import DoublyLinkedList
from libraries.universal_code.common_traits.trait_doubly_linked_lists import Node

_COLOR_YELLOW = 'yellow'
_COLOR_RED    = 'red'


class ColorPrint(Node):
	"""Provides ability to print in multiple colors through chained calls."""

	def __init__(self):
		super().__init__()
		self._segments = []
		self.consumed  = False

	def __len__(self):
		total = 0
		if self.has_prev():
			node = self.get_head()
			while node is not self:
				total += node.get_length()
				node = node.get_next()
		total += self.get_length()
		if self.has_next():
			node = self.get_next()
			while node is not None:
				total += node.get_length()
				node = node.get_next()
		return total

	def get_length(self) -> int:
		"""Gets the length of just this text."""
		length = 0
		for s in self._segments:
			length += len(s[1])
		return length

	def add(self, node, return_self=True):
		"""Add the next node to print."""
		if self.has_next():
			next_node = self.get_next()
			next_node.add(node)
		else:
			self.set_next(node)
		if return_self:
			return self
		else:
			return node

	def end_line(self):
		"""Ends the line."""
		self._segments.append(['red', '\n', False, False])
		return self

	def is_consumed(self) -> bool:
		"""Returns a boolean indicating if this text has already been printed."""
		for s in self._segments:
			if not s[3]:
				return False
		return True

	def print(self, all_bold=False):
		"""Print the created multi-color text."""
		#if self.has_prev():
		#	prev = self.get_prev()
		#	if not prev.is_consumed():

		for s in self._segments:
			if not s[3]:
				bold = s[2] or all_bold
				color_print(s[1], color=s[0], bold=bold, end='')
				s[3] = True

		if self.has_next():
			self.get_next().print()
		else:
			# Print the new line character.
			print('')

	def yellow(self, text, bold=False):
		"""Add yellow text to print."""
		self._segments.append(['yellow', text.replace('\t', '    '), bold, False])
		return self

	def green(self, text, bold=False):
		"""Add green text to print."""
		self._segments.append(['green', text.replace('\t', '    '), bold, False])
		return self

	def blue(self, text, bold=False):
		"""Adds blue text to print."""
		self._segments.append(['blue', text.replace('\t', '    '), bold, False])
		return self

	def red(self, text, bold=False):
		"""Adds red text to print."""
		self._segments.append(['red', text.replace('\t', '    '), bold, False])
		return self


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


def print_red(text, bold=False, end='\n'):
	"""Prints text in red color."""
	color_print(text, color='red', bold=bold, end=end)


def print_green(text, bold=False, end='\n'):
	"""Prints text in green color."""
	color_print(text, color='green', bold=bold, end=end)


def print_blue(text, bold=False, end='\n'):
	"""Prints text in blue color."""
	color_print(text, color='blue', bold=bold, end=end)


def print_pink(text):
	"""Prints text in white color."""
	color_print(text, color='pink')


def print_yellow(text, bold=False, end='\n'):
	"""Prints to stdout in yellow."""
	color_print(text, color='yellow', bold=bold, end=end)
