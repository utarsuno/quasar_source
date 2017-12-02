# coding=utf-8

"""
This module, problem.py, will define an outline for all problems.
"""
# Needed for timing how long the problem took.
import time
from universal_code import debugging as dbg
from project_euler_problems.math_utilities import math_utilities as mu


class Problem:
	"""
	Represents a single project euler problem.
	"""

	def __init__(self):
		self._solution = None
		self.mu        = mu

	def get_solution(self):
		"""Run the problem and return the solution.
		:return:
		"""
		dbg.raise_exception(dbg.AbstractMethodNotImplementedException, 'get_solution should be abstracted.')

	def __str__(self):
		start_time = time.time()
		self._solution = self.get_solution()
		return str(float(str('{0:2f}'.format(time.time() - start_time)))) + ' | ' + str(self._solution)
