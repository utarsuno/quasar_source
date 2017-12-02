# coding=utf-8

"""
This module, problem_001.py, solves the fifteenth project euler problem.
"""

from project_euler_problems.problem import Problem


'''
Starting in the top left corner of a 2×2 grid, and only being able to move to the right and down, there are exactly 6 routes to the bottom right corner.

How many such routes are there through a 20×20 grid?
'''


# Lots of help from this link : http://code.jasonbhill.com/python/project-euler-problem-15/


class ImplementedProblem(Problem):
	"""This specific problem's implementation.
	"""

	def solve_grid_for_square(self, size):
		"""Solve for the specified grid size.
		:param size: The lengths of the square's sides.
		:return: The number of paths that can be traversed.
		"""
		total_size = (size + 1) * (size + 1)
		size_plus  = size + 1
		values = [0] * total_size

		i = 0
		while i < total_size:
			#print(i % size)
			if i % size_plus != 0 and i > size_plus:
				values[i] = values[i - 1] + values[i - size_plus]
			else:
				values[i] = 1
			i += 1

		section = 0
		while section < total_size / size_plus:
			i = section * size_plus
			while i < (total_size / size_plus) + section * size_plus:
				#print(str(values[i]) + ', ', end = '')
				i += 1
			section += 1

		return values[-1]

	def get_solution(self):
		"""Solves the solution for problem 014.
		:return: The solution for problem 014.
		"""
		return self.solve_grid_for_square(20)
