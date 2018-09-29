# coding=utf-8

"""This module, build_step.py, represents a single build step in a build process."""

from libraries.universal_code.time_abstraction.simple_timer import SimpleTimer
from libraries.universal_code import output_coloring as oc
from libraries.universal_code.system_abstraction.shell_command_runner import BashCommandRunner
import traceback


class BuildProcessStep(object):
	"""Represents a single build step."""

	def __init__(self, domain, function_to_run):
		self.domain                  = domain
		self.function_to_run         = function_to_run
		self.sub_build_process_steps = []
		self.finished                = False
		self.failed                  = False
		self.output                  = None
		self.parent                  = None

	def add_sub_build_process(self, step):
		"""Adds a sub build process step to execute."""
		step.parent = self
		self.sub_build_process_steps.append(step)

	def finish(self, output=None):
		"""Finish this step."""
		self.finished = True
		self.failed   = False
		self.output   = output

	def finish_early(self, output=None):
		"""Finishes this step and stops the parent from completing the rest of the steps."""
		self.finish(output)
		if self.parent is not None:
			self.parent.finished = True

	def fail(self, output=None):
		"""Finishes this step."""
		if self.parent is not None:
			self.parent.finished = True
		self.output   = output
		self.finished = True
		self.failed   = True

	def add_output_line(self, line):
		"""Adds a line of output."""
		if self.output is None:
			self.output = ''
		self.output += line + '\n'

	def run(self):
		"""Runs this build process step."""
		try:
			if self.function_to_run is not None:
				self.function_to_run()
			else:
				for p in self.sub_build_process_steps:
					if self.finished:
						break
					p.run()
					if p.failed:
						self.fail(str(p.output))
		except Exception as e:
			#print(e)
			traceback.print_exc()
			self.fail(e)

	def run_bash_step(self, bash_command, cwd=None):
		"""Runs a bash command."""
		if cwd is not None:
			success, output = BashCommandRunner(bash_command).run(cwd=cwd)
		else:
			success, output = BashCommandRunner(bash_command).run()

		if success:
			return output
		else:
			self.fail(output)
