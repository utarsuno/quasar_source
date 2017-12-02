# coding=utf-8

"""
This module, problem_007.py, solves the seventh project euler problem.
"""

from project_euler_problems.problem import Problem

'''
By listing the first six prime numbers: 2, 3, 5, 7, 11, and 13, we can see that the 6th prime is 13.

What is the 10 001st prime number?
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation.
	"""

	# Gotten from : http://stackoverflow.com/questions/15285534/isprime-function-for-python-language
	def is_prime(self, n):
		if n == 2 or n == 3:
			return True
		if n < 2 or n % 2 == 0:
			return False
		if n < 9:
			return True
		if n % 3 == 0:
			return False
		r = int(n ** 0.5)
		f = 5
		while f <= r:
			if n % f == 0:
				return False
			if n % (f + 2) == 0:
				return False
			f += 6
		return True

	def get_nth_prime(self, n):
		primes = 1 # The first prime is the number 2 which we will skip.
		index = 3
		last_prime = 2
		while primes < n:
			if self.is_prime(index):
				primes += 1
				last_prime = index
			index += 2
		return last_prime

	def get_solution(self):
		"""Solves the solution for problem 006.
		:return: The solution for problem 006.
		"""
		return self.get_nth_prime(10001)



