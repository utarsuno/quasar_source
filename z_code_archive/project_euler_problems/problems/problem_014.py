# coding=utf-8

"""
This module, problem_001.py, solves the fourteenth project euler problem.
"""

from project_euler_problems.problem import Problem


'''
The following iterative sequence is defined for the set of positive integers:

n → n/2 (n is even)
n → 3n + 1 (n is odd)

Using the rule above and starting with 13, we generate the following sequence:

13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1
It can be seen that this sequence (starting at 13 and finishing at 1) contains 10 terms. Although it has not been proved yet (Collatz Problem), it is thought that all starting numbers finish at 1.

Which starting number, under one million, produces the longest chain?

NOTE: Once the chain starts the terms are allowed to go above one million.
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation.
	"""

	def get_number_of_terms_from_n(self, n):
		num_terms = 1
		while n != 1:
			#print(n)
			num_terms += 1
			if n % 2 == 0:
				n //= 2
			else:
				n = 3 * n + 1
		return num_terms

	def get_solution(self):
		"""Solves the solution for problem 014.
		:return: The solution for problem 014.
		"""
		largest_number_of_terms = 0
		best_index = 0
		index = 13
		while index < 1000000:
			current = self.get_number_of_terms_from_n(index)
			if current > largest_number_of_terms:
				largest_number_of_terms = current
				best_index = index
				#print(str(index) + '\t' + str(self.get_number_of_terms_from_n(index)))
			index += 1
		return best_index
