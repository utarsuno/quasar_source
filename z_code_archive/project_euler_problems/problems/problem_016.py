# coding=utf-8

"""
This module, problem_001.py, solves the fifteenth project euler problem.
"""

from project_euler_problems.problem import Problem


'''
215 = 32768 and the sum of its digits is 3 + 2 + 7 + 6 + 8 = 26.

What is the sum of the digits of the number 21000?
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation.
	"""

	def sum_of_digits(self, n):
		"""This sums all the digits in a number and returns the sum.
		:param n: The number to sum each digit up of.
		:return: The sum of the digits as an integer.
		"""
		string = str(n)
		local_sum = 0
		for c in string:
			local_sum += int(c)
		return local_sum

	def get_solution(self):
		"""Solves the solution for problem 014.
		:return: The solution for problem 014.
		"""
		return self.sum_of_digits(2 ** 1000)
