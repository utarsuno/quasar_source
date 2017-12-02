# coding=utf-8

"""This module, problem_035.py, solves the thirty-fifth euler problem."""

from project_euler_problems.problem import Problem
from project_euler_problems.math_utilities import math_utilities as mu

import copy

'''
The prime 41, can be written as the sum of six consecutive primes:

41 = 2 + 3 + 5 + 7 + 11 + 13
This is the longest sum of consecutive primes that adds to a prime below one-hundred.

The longest sum of consecutive primes below one-thousand that adds to a prime, contains 21 terms, and is equal to 953.

Which prime, below one-million, can be written as the sum of the most consecutive primes?
'''


# [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]


class ImplementedProblem(Problem):
	"""This specific problem's implementation."""

	def get_solution(self):
		"""Solves the solution for problem 050.
		:return: The solution for problem 050."""
		primes            = mu.get_primes_below_n(100)
		dynamic_solutions = []

		for p in reversed(primes):
			solutions_to_add = []
			for ds in dynamic_solutions:
				new_list = copy.copy(ds)
				new_list.append(p)
				solutions_to_add.append(new_list)
			for ds in solutions_to_add:
				dynamic_solutions.append(ds)
			dynamic_solutions.append([p])
			print(p)
			print(dynamic_solutions)

		longest_chain  = -1
		best_prime     = -1

		'''
		while starting_index != len(primes):

			print('Starting index : ' + str(starting_index))

			number_of_remaining_elements = len(primes) - 1 - starting_index
			length_tried = 0
			while length_tried < number_of_remaining_elements + 1:

				if sum(primes[starting_index:starting_index + length_tried + 1]) in primes:

					chain_length = (starting_index + length_tried + 1) - starting_index
					if chain_length > longest_chain:

						longest_chain = chain_length
						best_prime    = sum(primes[starting_index:starting_index + length_tried + 1])

				length_tried += 1
			starting_index += 1
		'''

		print(best_prime)
		print(longest_chain)

		return best_prime



