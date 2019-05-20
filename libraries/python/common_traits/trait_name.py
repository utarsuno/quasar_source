# coding=utf-8

"""This file, trait_name.py, provides a simple trait for having a string field for a name,"""


class TraitName(object):
	"""Simple code re-use for having a string name."""

	def __init__(self, name: str):
		self.name = name

	def __str__(self) -> str:
		return '{' + self.name + '}'


