# coding=utf-8

"""This module, problem_052.py, solves the fifty-second euler problem."""

from project_euler_problems.problem import Problem

'''
It can be seen that the number, 125874, and its double, 251748, contain exactly the same digits, but in a different order.

Find the smallest positive integer, x, such that 2x, 3x, 4x, 5x, and 6x, contain the same digits.
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation."""

	def get_values_to_check(self, n):
		yield 2 * n
		yield 3 * n
		yield 4 * n
		yield 5 * n
		yield 6 * n

	def contains_same_digits(self, n0, n1):
		digits_0 = [0] * 10
		digits_1 = [0] * 10
		for d in str(n0):
			digits_0[int(d)] += 1
		for d in str(n1):
			digits_1[int(d)] += 1
		for x, y in zip(digits_0, digits_1):
			if x != y:
				return False
		return True

	def get_solution(self):
		"""Solves the solution for problem 052.
		:return: The solution for problem 052."""

		#print(self.get_values_to_check(5))
		i = 1
		while 1 == 1:
			match = True
			for n in self.get_values_to_check(i):
				if not self.contains_same_digits(i, n):
					match = False
					break
			if match:
				break
			i += 1

		return i
