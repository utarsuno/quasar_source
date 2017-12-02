# coding=utf-8

"""
This module, problem_006.py, solves the second project euler problem.
"""

from project_euler_problems.problem import Problem

'''
The sum of the squares of the first ten natural numbers is,

1^2 + 2^2 + ... + 10^2 = 385
The square of the sum of the first ten natural numbers is,

(1 + 2 + ... + 10)^2 = 552 = 3025
Hence the difference between the sum of the squares of the first ten natural numbers and the square of the sum is 3025 − 385 = 2640.

Find the difference between the sum of the squares of the first one hundred natural numbers and the square of the sum.
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation.
	"""

	def get_sum_of_squares_for_n(self, n):
		index = 1
		sum = 0
		while index < n + 1:
			sum += index ** 2
			index += 1
		return sum

	def get_square_of_sums_for_n(self, n):
		index = 1
		sum = 0
		while index < n + 1:
			sum += index
			index += 1
		return sum ** 2

	def get_solution(self):
		"""Solves the solution for problem 006.
		:return: The solution for problem 006.
		"""
		print(self.get_square_of_sums_for_n(100) - self.get_sum_of_squares_for_n(100))



