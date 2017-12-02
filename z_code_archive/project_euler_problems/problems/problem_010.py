# coding=utf-8

"""
This module, problem_010.py, solves the tenth project euler problem.
"""

from project_euler_problems.problem import Problem


'''
The sum of the primes below 10 is 2 + 3 + 5 + 7 = 17.

Find the sum of all the primes below two million.
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

	def get_primes_below_n(self, n):
		primes = [2]
		index = 3
		last_prime = 2
		while last_prime < n:
			if self.is_prime(index):
				primes.append(index)
				last_prime = index
			index += 2
		return primes[:-1]

	def get_solution(self):
		"""Solves the solution for problem 010.
		:return: The solution for problem 010.
		"""
		s = 0
		for p in self.get_primes_below_n(2000000):
			s += p
		return s
