# coding=utf-8

"""
This module, problem_009.py, solves the ninth project euler problem.
"""

from project_euler_problems.problem import Problem


'''
A Pythagorean triplet is a set of three natural numbers, a < b < c, for which,

a^2 + b^2 = c^2
For example, 3^2 + 4^2 = 9 + 16 = 25 = 5^2.

There exists exactly one Pythagorean triplet for which a + b + c = 1000.
Find the product abc.
'''

# TODO : There is a MUCH better solution for this.


class ImplementedProblem(Problem):
	"""This specific problem's implementation.
	"""

	def get_solution(self):
		"""Solves the solution for problem 009.
		:return: The solution for problem 009.
		"""

		c = 3
		while c < 1001:
			b = 2
			while b < c:
				a = 1
				while a < b:

					if a + b + c == 1000:
						if a ** 2 + b ** 2 == c ** 2:
							return a * b * c

					a += 1
				b += 1
			c += 1

		return 0
