# coding=utf-8

"""This module, project_component.py, provides an abstraction to discrete project components."""


class ProjectComponent(object):
	"""Provides an abstraction to a discrete component of a project."""

	def __init__(self, component_name):
		self._component_name 	    = component_name
		self._base_code_directories = []

	def add_base_code_directory(self, code_directory):
		"""Adds a code directory to this project component."""
		self._base_code_directories.append(code_directory)
