# coding=utf-8

"""This module, code_project.py, provides an abstraction to discrete code projects."""


class CodeProject(object):
	"""An abstraction to a code project."""

	def __init__(self, project_name):
		self._project_name = project_name
		self._project_components = []

	def add_project_component(self, project_component):
		"""Adds a project component to this code project."""
		self._project_components.append(project_component)

	@property
	def components(self):
		"""Returns a list of all the project components."""
		return self._project_components
