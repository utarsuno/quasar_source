# coding=utf-8

"""This module, problem_025.py, solves the twenty-fifth euler problem."""

from project_euler_problems.problem import Problem

'''
The Fibonacci sequence is defined by the recurrence relation:

Fn = Fn−1 + Fn−2, where F1 = 1 and F2 = 1.
Hence the first 12 terms will be:

F1 = 1
F2 = 1
F3 = 2
F4 = 3
F5 = 5
F6 = 8
F7 = 13
F8 = 21
F9 = 34
F10 = 55
F11 = 89
F12 = 144
The 12th term, F12, is the first term to contain three digits.

What is the index of the first term in the Fibonacci sequence to contain 1000 digits?
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation."""

	def get_solution(self):
		"""Solves the solution for problem 025.
		:return: The solution for problem 025."""
		index        = 3
		old_term     = 1
		current_term = 1
		while True:
			new_value    = current_term + old_term
			old_term     = current_term
			current_term = new_value
			if len(str(current_term)) >= 1000:
				return index
			index += 1
