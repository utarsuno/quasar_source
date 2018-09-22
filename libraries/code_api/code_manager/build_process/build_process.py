# coding=utf-8

"""This module, build_process.py, provides an abstraction to running a Build-Process."""

from libraries.universal_code import output_coloring as oc
from libraries.code_api.code_manager.build_process.build_step import BuildProcessStep


class BuildProcess(object):
	"""Base abstraction for creating discrete project build-processes."""

	def __init__(self, name, db_domain):
		self.name        = name
		self.db_domain   = db_domain

		self.build_steps = []

		# Stores verbose logging (created during the build-process).
		self.logs = {}

		# Build flags will determine the needed exit code.
		self.flags = []

	def run_build_process(self):
		"""Runs this build process."""
		oc.print_ascii_yellow('building ' + self.name)
		self.db_domain.load()

		projects = self.db_domain.projects

		for p in projects:
			print(p)

