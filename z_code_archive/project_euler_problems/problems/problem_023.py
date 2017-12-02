# coding=utf-8

"""
This module, problem_020.py, solves the twenty-second euler problem.
"""

from project_euler_problems.problem import Problem
import math
'''
A perfect number is a number for which the sum of its proper divisors is exactly equal to the number. For example, the sum of the proper divisors of 28 would be 1 + 2 + 4 + 7 + 14 = 28, which means that 28 is a perfect number.

A number n is called deficient if the sum of its proper divisors is less than n and it is called abundant if this sum exceeds n.

As 12 is the smallest abundant number, 1 + 2 + 3 + 4 + 6 = 16, the smallest number that can be written as the sum of two abundant numbers is 24. By mathematical analysis, it can be shown that all integers greater than 28123 can be written as the sum of two abundant numbers. However, this upper limit cannot be reduced any further by analysis even though it is known that the greatest number that cannot be expressed as the sum of two abundant numbers is less than this limit.

Find the sum of all the positive integers which cannot be written as the sum of two abundant numbers.
'''


# Got help from this link : https://codereview.stackexchange.com/questions/39946/optimizing-solution-for-project-euler-problem-23-non-abundant-sums


class ImplementedProblem(Problem):
	"""This specific problem's implementation.
	"""

	def get_divisors(self, n):
		"""Returns divisors of an integer, no guarantee on order."""
		yield 1
		largest = int(math.sqrt(n))
		# This is a special-case square number used to avoid yeild the same divisor twice.
		if largest * largest == n:
			yield largest
		else:
			largest += 1

		for i in range(2, largest):
			if n % i == 0:
				yield i
				yield n / i

	def is_abundant(self, n):
		return sum(self.get_divisors(n)) > n

	def can_n_be_made_from_abundant_numbers(self, n, abundant_numbers):
		for abundant in abundant_numbers:
			if abundant > n:
				return False
			if n - abundant in abundant_numbers:
				return True
		return False

	def get_solution(self):
		"""Solves the solution for problem 023.
		:return: The solution for problem 023.
		"""
		abundant_numbers = set()

		i = 11
		while i < 28123 + 1:
			if self.is_abundant(i):
				abundant_numbers.add(i)
			i += 1

		the_sum = 0

		i = 1
		while i < 28123 + 1:
			if not self.can_n_be_made_from_abundant_numbers(i, abundant_numbers):
				the_sum += i
			i += 1
		return the_sum
