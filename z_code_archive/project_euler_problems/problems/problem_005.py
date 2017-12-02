# coding=utf-8

"""
This module, problem_005.py, solves the second project euler problem.
"""

from project_euler_problems.problem import Problem

'''
2520 is the smallest number that can be divided by each of the numbers from 1 to 10 without any remainder.

What is the smallest positive number that is evenly divisible by all of the numbers from 1 to 20?
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation.
	"""

	def divisible_by_numbers_1_through_20(self, number):
		if number % 2 != 0 or number % 3 != 0 or number % 5 != 0 or number % 7 != 0 or number % 9 != 0 or number % 11 != 0 or number % 13 != 0 or number % 16 != 0 or number % 17 != 0 or number % 19 != 0:
			return False
		return True

	def get_solution(self):
		"""Solves the solution for problem 005.
		:return: The solution for problem 005.
		"""
		n = 20
		while 1:
			if self.divisible_by_numbers_1_through_20(n):
				return n
			n += 20

