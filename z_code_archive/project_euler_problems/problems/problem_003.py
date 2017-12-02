# coding=utf-8

"""
This module, problem_003.py, solves the second project euler problem.
"""

from project_euler_problems.problem import Problem

'''
The prime factors of 13195 are 5, 7, 13 and 29.

What is the largest prime factor of the number 600851475143 ?
'''


# Code from http://stackoverflow.com/questions/14138053/project-euler-3-with-python-most-efficient-method.


class ImplementedProblem(Problem):
	"""This specific problem's implementation.
	"""
	def get_solution(self):
		"""Solves the solution for problem 003.
		:return: The solution for problem 003.
		"""

		number = 600851475143
		i = 2
		while i * i < number:
			# Factors to the number.
			while number % i == 0:
				# Once we find a prime factor then divide the number by it.
				number //= i
			i += 1
		return number
