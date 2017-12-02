# coding=utf-8

"""This module, problem_035.py, solves the forty-first euler problem."""

from project_euler_problems.problem import Problem

from project_euler_problems.math_utilities import math_utilities as mu

'''
We shall say that an n-digit number is pandigital if it makes use of all the digits 1 to n exactly once. For example, 2143 is a 4-digit pandigital and is also prime.

What is the largest n-digit pandigital prime that exists?'''


# Optimizations gotten from : http://www.mathblog.dk/project-euler-41-pandigital-prime/

'''
There is a property that if the sum of a numbers digits are divisible by 3 then the number is divisible by 3.
1 + 2 + 3 + 4                     = 10
1 + 2 + 3 + 4 + 5                 = 15
1 + 2 + 3 + 4 + 5 + 6             = 21
1 + 2 + 3 + 4 + 5 + 6 + 7         = 28
1 + 2 + 3 + 4 + 5 + 6 + 7 + 8     = 36
1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 = 45
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation."""

	def get_solution(self):
		"""Solves the solution for problem 041.
		:return: The solution for problem 041."""

		# Start with a 7 digit number as 8 and 9 digit pandigital numbers are divisible by 3 and thus not prime.
		#current_number = 7654321
		current_number = 5000

		while True:

			if mu.has_no_repeating_digits(current_number):
				if mu.is_pandigital(current_number):
					if mu.is_prime(current_number):
						return current_number

			#print(current_number)

			current_number -= 1

		return 1



# 7652413

# 7654319
# 7654319