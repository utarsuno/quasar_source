# coding=utf-8

"""
This module, problem_020.py, solves the twentieth project euler problem.
"""

from project_euler_problems.problem import Problem

'''
n! means n × (n − 1) × ... × 3 × 2 × 1

For example, 10! = 10 × 9 × ... × 3 × 2 × 1 = 3628800,
and the sum of the digits in the number 10! is 3 + 6 + 2 + 8 + 8 + 0 + 0 = 27.

Find the sum of the digits in the number 100!
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation.
	"""

	def factorial_digit_sum(self, n):
		local_sum = 1
		i = 1
		while i < n + 1:
			local_sum *= i
			i += 1
		actual_sum = 0
		for c in str(local_sum):
			actual_sum += int(c)
		return actual_sum

	def get_solution(self):
		"""Solves the solution for problem 020.
		:return: The solution for problem 020.
		"""
		return self.factorial_digit_sum(100)
