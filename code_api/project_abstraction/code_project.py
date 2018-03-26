# coding=utf-8

"""This module, code_project.py, provides an abstraction to discrete code projects."""


from universal_code import debugging as dbg


class CodeProject(object):
	"""An abstraction to a code project."""

	def __init__(self, project_name):
		self._project_name = project_name
		self._project_components = []

	def add_project_component(self, project_component):
		"""Adds a project component to this code project."""
		self._project_components.append(project_component)

	def get_component_with_tags(self, list_of_tags):
		"""Returns the component with the matched tags. Raises an exception if more than one component was found."""
		components = self.get_all_components_that_have_tags(list_of_tags)
		if len(components) > 1:
			dbg.raise_exception('More than one component found!')
		elif len(components) == 0:
			dbg.raise_exception('No components found!')
		return components[0]

	def get_all_components_that_have_tags(self, list_of_tags):
		"""Returns a list of all project component that have all the designated tags."""
		components = []
		for c in self._project_components:
			if c.has_tags(list_of_tags):
				components.append(c)
		return components

	@property
	def components(self):
		"""Returns a list of all the project components."""
		return self._project_components
