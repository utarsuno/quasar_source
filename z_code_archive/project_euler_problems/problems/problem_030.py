# coding=utf-8

"""This module, problem_030.py, solves the thirtieth euler problem."""

from project_euler_problems.problem import Problem

'''
Surprisingly there are only three numbers that can be written as the sum of fourth powers of their digits:

1634 = 1^4 + 6^4 + 3^4 + 4^4
8208 = 8^4 + 2^4 + 0^4 + 8^4
9474 = 9^4 + 4^4 + 7^4 + 4^4
As 1 = 1^ 4 is not a sum it is not included.

The sum of these numbers is 1634 + 8208 + 9474 = 19316.

Find the sum of all the numbers that can be written as the sum of fifth powers of their digits.
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation."""


	def get_solution(self):
		"""Solves the solution for problem 030.
		:return: The solution for problem 030."""

		index = 1
		while index < 100:
			print(str(index) + ' : ' + str(self._sum_of_fourth_power_of_(index)))
			index += 1

		return 1
