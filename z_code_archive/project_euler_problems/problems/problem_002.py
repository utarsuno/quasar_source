# coding=utf-8

"""
This module, problem_002.py, solves the second project euler problem.
"""

from project_euler_problems.problem import Problem


class ImplementedProblem(Problem):
	"""This specific problem's implementation.
	"""

	def get_solution(self):
		"""Solves the solution for problem 002.
		:return: The solution for problem 002.
		"""
		terms = [1, 2]
		first_term = 1
		second_term = 2
		while first_term + second_term < 4000000:
			terms.append(first_term + second_term)
			temp        = first_term
			first_term  = second_term
			second_term = temp + first_term

		sum = 0
		for num in terms:
			if num % 2 == 0:
				sum += num

		return sum
