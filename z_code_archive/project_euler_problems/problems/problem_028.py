# coding=utf-8

"""This module, problem_025.py, solves the twenty-eighth euler problem."""

from project_euler_problems.problem import Problem

'''
Starting with the number 1 and moving to the right in a clockwise direction a 5 by 5 spiral is formed as follows:

21 22 23 24 25
20  7  8  9 10
19  6  1  2 11
18  5  4  3 12
17 16 15 14 13

It can be verified that the sum of the numbers on the diagonals is 101.

What is the sum of the numbers on the diagonals in a 1001 by 1001 spiral formed in the same way?
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation."""

	def get_solution(self):
		"""Solves the solution for problem 028.
		:return: The solution for problem 028."""

		spiral_size        = 1001
		number_of_elements = spiral_size ** 2

		diagonals   = [1]
		index       = 2
		skip_size   = 1
		num_skipped = 0
		skips       = 0
		while index < number_of_elements + 1:
			if num_skipped != skip_size:
				num_skipped += 1
			else:
				if skips == 3:
					num_skipped = 0
					skips       = 0
					skip_size   += 2
				else:
					num_skipped = 0
					skips       += 1
				diagonals.append(index)
			index += 1

		return sum(diagonals)
