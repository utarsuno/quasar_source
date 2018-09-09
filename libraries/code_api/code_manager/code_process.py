# coding=utf-8

"""This module, build_step.py, represents a single build step in a build process."""

from libraries.universal_code.time_abstraction.simple_timer import SimpleTimer
from libraries.universal_code import output_coloring as oc
from applications.code_manager.layer_domain.entities import entities_business as entities
from libraries.universal_code.system_abstraction.shell_command_runner import BashCommandRunner


class CodeProcess(object):
	"""Represents a single code-process, usually used as a build/cache process."""

	def __init__(self, entity, parent_entity, domain):
		self.entity        = entity
		self.parent_entity = parent_entity
		self.domain        = domain
		self.failed        = False
		self.output        = None
		self.timer         = None
		self.time_ran      = None

	@property
	def passed(self):
		"""Returns a boolean indicating if this CodeProcess didn't fail."""
		return not self.failed

	def run_bash_step(self, bash_command, cwd=None):
		"""Runs a bash command and checks for errors."""
		if cwd is not None:
			success, output = BashCommandRunner(bash_command).run(cwd=cwd)
		else:
			success, output = BashCommandRunner(bash_command).run()

		if success:
			return output
		else:
			self.fail(output)
			return False

	def run(self):
		"""Runs this code-process."""
		#oc.print_data_with_red_dashes_at_start('building {' + self.name + '}')
		self.timer = SimpleTimer()
		self.timer.start()
		#output = self.function()
		self._run()

		#oc.print_green('{' + 'processTODO' + '} finished in ' + str(timer))
		#return 'output'
		#return self._run()

	def stop(self, failed, output):
		"""Completes this code-process."""
		self.failed = failed
		self.output = output
		self.timer.stop()
		self.time_ran = str(self.timer)

	def fail(self, output):
		"""Completes this code-process with error status."""
		self.stop(True, output)

	def _run(self):
		pass
