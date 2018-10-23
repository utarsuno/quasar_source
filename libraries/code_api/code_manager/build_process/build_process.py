# coding=utf-8

"""This module, build_process.py, provides an abstraction to running a Build-Process."""

from libraries.universal_code import output_coloring as oc
from libraries.universal_code.time_abstraction.simple_timer import SimpleTimer


class BuildProcess(object):
	"""Base abstraction for creating discrete project build-processes."""

	def __init__(self, name, db_domain):
		self.name        = name
		self.db_domain   = db_domain

		self.build_steps = []

		# Stores verbose logging (created during the build-process).
		self.logs        = {}

		# Build flags will determine the needed exit code.
		# TODO: Is this used?
		#self.flags       = []

	@property
	def build_type(self) -> str:
		"""Returns the build type for this domain."""
		return self.db_domain.flag_get('BUILD_TYPE')

	def run_setup(self):
		"""Runs the setup steps needed for this build process. (Called after domain is loaded)."""
		pass

	def build_completed_successfully(self):
		"""Gets called once the build completes without errors."""
		pass

	def add_step(self, build_process_step):
		"""Adds a step to perform for this BuildProcess."""
		self.build_steps.append(build_process_step)

	def run_build_process(self):
		"""Runs this build process."""
		build_time = SimpleTimer(auto_start=True)
		oc.print_ascii_yellow('building ' + self.name)

		self.db_domain.load()
		self.run_setup()

		all_build_steps_passed = True

		for bs in self.build_steps:
			bs.run()
			if bs.failed:
				all_build_steps_passed = False
				if bs.output is not None:
					oc.print_error('build step failed! {' + bs.output + '}')
				else:
					oc.print_error('build step failed! {}')
				break
			else:
				if bs.output is not None:
					oc.print_data_with_red_dashes_at_start(bs.output)

		oc.print_data_with_red_dashes_at_start('all_build_steps_passed {' + str(all_build_steps_passed) + '}')

		build_time.stop()
		if not all_build_steps_passed:
			oc.print_error('Building {' + self.name + '} failed in {' + str(build_time) + '}')
			exit(199)
		else:
			oc.print_pink('Building {' + self.name + '} finished in {' + str(build_time) + '}')
			self.build_completed_successfully()
