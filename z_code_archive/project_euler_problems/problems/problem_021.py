# coding=utf-8

"""
This module, problem_020.py, solves the twenty-first euler problem.
"""

from project_euler_problems.problem import Problem

'''
Let d(n) be defined as the sum of proper divisors of n (numbers less than n which divide evenly into n).
If d(a) = b and d(b) = a, where a ≠ b, then a and b are an amicable pair and each of a and b are called amicable numbers.

For example, the proper divisors of 220 are 1, 2, 4, 5, 10, 11, 20, 22, 44, 55 and 110; therefore d(220) = 284. The proper divisors of 284 are 1, 2, 4, 71 and 142; so d(284) = 220.

Evaluate the sum of all the amicable numbers under 10000.
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation.
	"""

	def __init__(self):
		super().__init__()
		self.mapping = {}

	def get_sum_of_proper_divisors_of_n(self, n):
		i = 1
		l = []
		while i < (n + 1) / 2:
			if n % i == 0:
				l.append(i)
			i += 1
		return sum(l)

	def get_solution(self):
		"""Solves the solution for problem 021.
		:return: The solution for problem 021.
		"""
		amicable_numbers = set()

		for i in range(10000):
			self.mapping[i] = self.get_sum_of_proper_divisors_of_n(i)

		for i in range(10000):
			if self.mapping[i] in self.mapping.keys() and self.mapping[self.mapping[i]] == i:
				if self.mapping[i] != i:
					#print(str(self.mapping[i]) + '\t' + str(i))
					amicable_numbers.add(self.mapping[i])
					amicable_numbers.add(i)

		return sum(amicable_numbers)
