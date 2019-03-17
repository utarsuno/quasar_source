# coding=utf-8

"""This file, trait_doubly_linked_lists.py, provides a class abstraction to doubly linked list functionality."""


class Node(object):
	"""Simple code re-use for a doubly linked list node."""

	def __init__(self):
		self._next = None
		self._prev = None

	def get_head(self):
		"""Returns the head of the chain."""
		if self._prev is None:
			return self
		else:
			return self._prev.get_head()

	def get_tail(self):
		"""Returns the tail of the chain."""
		if self._next is None:
			return self
		else:
			return self._next.get_tail()

	def has_next(self) -> bool:
		"""Returns a boolean indicating if there is a next node."""
		return self._next is not None

	def has_prev(self) -> bool:
		"""Returns a boolean indicating if there is a previous node."""
		return self._prev is not None

	def get_prev(self):
		"""Returns the previous node (or None if there is none)."""
		return self._prev

	def get_next(self):
		"""Returns the next node (or None if there is none)."""
		return self._next

	def set_next(self, next_node: object) -> None:
		"""Set the next node."""
		self._next      = next_node
		next_node._prev = self

	def set_prev(self, prev_node: object) -> None:
		"""Set the previous node."""
		self._prev      = prev_node
		prev_node._next = self


class DoublyLinkedList(object):
	"""Simple code re-use for a doubly linked list."""

	def __init__(self):
		self._head = None
		self._tail = None

	def add_tail(self, tail: Node) -> None:
		"""Adds a node as a tail."""
		if self._head is None:
			self._head = tail
			self._tail = tail
			self._head.set_next(self._tail)
