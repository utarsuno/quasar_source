# coding=utf-8

"""This module, problem_031.py, solves the thirtieth euler problem."""

from project_euler_problems.problem import Problem

'''
It is possible to write five as a sum in exactly six different ways:

4 + 1
3 + 2
3 + 1 + 1
2 + 2 + 1
2 + 1 + 1 + 1
1 + 1 + 1 + 1 + 1

How many different ways can one hundred be written as a sum of at least two positive integers?
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation."""

	def get_solution(self):
		"""Solves the solution for problem 076.
		:return: The solution for problem 076."""

		integers  = []
		solutions = [0] * 100
		for i in range(1, 100):
			integers.append(i)
			

		print(integers)

		return 1
