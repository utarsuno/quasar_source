# coding=utf-8

"""
This module, problem_001.py, solves the first project euler problem.
"""

from project_euler_problems.problem import Problem


class ImplementedProblem(Problem):
	"""This specific problem's implementation.
	"""

	def get_solution(self):
		"""Solves the solution for problem 001.
		:return: The solution for problem 001.
		"""
		local_sum   = 0
		index       = 0
		while index < 1000:
			if index % 3 == 0 or index % 5 == 0:
				local_sum += index
			index += 1
		return local_sum
