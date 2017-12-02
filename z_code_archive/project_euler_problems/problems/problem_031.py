# coding=utf-8

"""This module, problem_031.py, solves the thirtieth euler problem."""

from project_euler_problems.problem import Problem

'''
In England the currency is made up of pound, £, and pence, p, and there are eight coins in general circulation:

1p, 2p, 5p, 10p, 20p, 50p, £1 (100p) and £2 (200p).
It is possible to make £2 in the following way:

1×£1 + 1×50p + 2×20p + 1×5p + 1×2p + 3×1p
How many different ways can £2 be made using any number of coins?
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation."""

	# This solution is from : https://blog.dreamshire.com/project-euler-31-solution/
	def get_solution(self):
		"""Solves the solution for problem 031.
		:return: The solution for problem 031."""

		max_number = 200
		coins      = [1, 2, 5, 10, 20, 50, 100, 200]
		solutions  = [1] + [0] * max_number

		for coin in coins:
			for i in range(coin, max_number + 1):
				solutions[i] += solutions[i - coin]

		return solutions[-1]
