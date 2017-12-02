# coding=utf-8

"""
This module, problem_004.py, solves the second project euler problem.
"""

from project_euler_problems.problem import Problem


class ImplementedProblem(Problem):
	"""This specific problem's implementation.
	"""

	def is_palindrome(self, number):
		n = str(number)
		if len(n) % 2 == 0:
			return n[0:int(len(n) / 2)] == n[int(len(n) / 2):len(n)][::-1]
		else:
			return n[0:len(n) // 2] == n[len(n) // 2 + 1:len(n)]

	def get_solution(self):
		"""Solves the solution for problem 004.
		:return: The solution for problem 004.
		"""
		largest_n = 0

		n0 = 999
		while n0 > 100:
			n1 = 999
			while n1 > 100:
				#print(str(n0) + ' | ' + str(n1))
				num = n0 * n1
				if self.is_palindrome(num):
					if num > largest_n:
						largest_n = num
				n1 -= 1
			n0 -= 1

		return largest_n
