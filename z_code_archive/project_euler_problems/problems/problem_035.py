# coding=utf-8

"""This module, problem_035.py, solves the thirty-fifth euler problem."""

from project_euler_problems.problem import Problem

from project_euler_problems.math_utilities import math_utilities as mu

'''
The number, 197, is called a circular prime because all rotations of the digits: 197, 971, and 719, are themselves prime.

There are thirteen such primes below 100: 2, 3, 5, 7, 11, 13, 17, 31, 37, 71, 73, 79, and 97.

How many circular primes are there below one million?
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation."""

	def rotate(self, l, n):
		return l[-n:] + l[:-n]

	def get_solution(self):
		"""Solves the solution for problem 035.
		:return: The solution for problem 035."""

		primes          = mu.get_primes_below_n_as_set(1000000)
		primes.remove(2)
		primes.remove(3)
		primes.remove(5)
		primes.remove(7)
		circular_primes = [2, 3, 5, 7]

		for p in primes:
			temp  = str(p)
			i     = 0

			# We can skip based off certain conditions to speed up the program.
			if '0' not in temp and '2' not in temp and '4' not in temp and '6' not in temp and '5' not in temp and '6' not in temp and '8' not in temp:

				match = True
				while i < len(temp):
					current = int(self.rotate(temp, i))
					if current not in primes:
						match = False
						break
					i += 1
				if match:
					circular_primes.append(p)

		return len(circular_primes)
