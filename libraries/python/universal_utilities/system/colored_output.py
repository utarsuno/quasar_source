# coding=utf-8

"""This file, colored_output.py, provides utility functions to print colored output to stdout."""

from lazyme import color_print
from libraries.python.common_traits.trait_doubly_linked_lists import DoublyLinkedList
from libraries.python.common_traits.trait_doubly_linked_lists import Node


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

	def p(self, all_bold=False):
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
			self.get_next().p()
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


class DashedLineRed(ColorPrint):
	"""Utility abstraction to ColorPrint to start off as red text."""
	def __init__(self, bold: bool=False):
		super().__init__()
		self.red('------------------------------------------------------------------------------------', bold)


class DashedLineBlue(ColorPrint):
	"""Utility abstraction to ColorPrint to start off as red text."""
	def __init__(self, bold: bool=False):
		super().__init__()
		self.blue('------------------------------------------------------------------------------------', bold)


class DashedLineGreen(ColorPrint):
	"""Utility abstraction to ColorPrint to start off as red text."""
	def __init__(self, bold: bool=False):
		super().__init__()
		self.green('------------------------------------------------------------------------------------', bold)


class DashedLineYellow(ColorPrint):
	"""Utility abstraction to ColorPrint to start off as red text."""
	def __init__(self, bold: bool=False):
		super().__init__()
		self.yellow('------------------------------------------------------------------------------------', bold)


class Red(ColorPrint):
	"""Utility abstraction to ColorPrint to start off as red text."""
	def __init__(self, text: str, bold: bool=False):
		super().__init__()
		self.red(text, bold)


class Green(ColorPrint):
	"""Utility abstraction to ColorPrint to start off as red text."""
	def __init__(self, text: str, bold: bool=False):
		super().__init__()
		self.green(text, bold)


class Blue(ColorPrint):
	"""Utility abstraction to ColorPrint to start off as red text."""
	def __init__(self, text: str, bold: bool=False):
		super().__init__()
		self.blue(text, bold)


class Yellow(ColorPrint):
	"""Utility abstraction to ColorPrint to start off as red text."""
	def __init__(self, text: str, bold: bool=False):
		super().__init__()
		self.yellow(text, bold)


