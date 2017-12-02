# coding=utf-8

"""This module, problem_025.py, solves the forty-eighth euler problem."""

from project_euler_problems.problem import Problem

'''
The series, 11 + 22 + 33 + ... + 1010 = 10405071317.

Find the last ten digits of the series, 11 + 22 + 33 + ... + 10001000.
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation."""

	def get_solution(self):
		"""Solves the solution for problem 048.
		:return: The solution for problem 048."""

		index     = 1
		local_sum = 0
		while index != 1001:
			value = index ** index
			print(str(index) + ' : ' + str(value))
			local_sum += value
			index += 1

		return str(local_sum)[len(str(local_sum)) - 10:]
