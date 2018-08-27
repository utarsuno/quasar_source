# coding=utf-8

"""This module, build_step.py, represents a single build step in a build process."""

from libraries.universal_code.time_abstraction.simple_timer import SimpleTimer
from libraries.universal_code import output_coloring as oc


class BuildStep(object):
	"""Represents a single build step."""

	def __init__(self, name, function, last_step=False):
		self.name      = name
		self.function  = function
		self.last_step = last_step

	def run_step(self):
		"""Runs this build step."""
		oc.print_data_with_red_dashes_at_start('building {' + self.name + '}')
		timer = SimpleTimer()
		timer.start()
		output = self.function()
		#oc.print_pink('\t' + html_prod.compression_statistics)
		timer.stop()
		oc.print_green('{' + self.name + '} finished in ' + str(timer))
		return output
