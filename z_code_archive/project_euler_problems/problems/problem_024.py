# coding=utf-8

"""
This module, problem_020.py, solves the twenty-second euler problem.
"""

from project_euler_problems.problem import Problem

# Used to help the IDE with auto-complete.
from typing import List

'''
A permutation is an ordered arrangement of objects. For example, 3124 is one possible permutation of the digits 1, 2, 3 and 4. If all of the permutations are listed numerically or alphabetically, we call it lexicographic order. The lexicographic permutations of 0, 1 and 2 are:

012   021   102   120   201   210

What is the millionth lexicographic permutation of the digits 0, 1, 2, 3, 4, 5, 6, 7, 8 and 9?
'''


# Great resource about lexicographic permutations : https://www.nayuki.io/page/next-lexicographical-permutation-algorithm


class ImplementedProblem(Problem):
	"""This specific problem's implementation.
	"""

	# Original algorithim from : https://www.nayuki.io/page/next-lexicographical-permutation-algorithm
	def set_next_lexicographic_permutation(self, sequence: List[int]):
		"""Returns the next lexicographical ordering of the sequence provided, if there is one.
		:param sequence : The sequence to get the next lexicographic ordering of.
		:return: The a new sequence that is the next lexicographic permutation of the sequence provided, or the same sequence if that is already the last permutation step."""

		# First find the longest non-increasing suffix.
		i = len(sequence) - 1
		while i > 0 and sequence[i - 1] >= sequence[i]:
			i -= 1
		# i is now at the head index of the suffix.

		# Make sure this isn't already the last permutation.
		if i <= 0:
			return False

		# We at least have 1 more digit to the left, it will be the pivot. Find the rightmost element that exceeds the pivot.
		j = len(sequence) - 1
		while sequence[j] <= sequence[j - 1]:
			j -= 1

		# Swap the pivot with j.
		sequence[i - 1], sequence[j] = sequence[j], sequence[i - 1]

		# Reverse the suffix.
		sequence[i:] = sequence[len(sequence) - 1:i - 1:-1]

		# The next permutation was successfully generated.
		return True

	def get_solution(self):
		"""Solves the solution for problem 024.
		:return: The solution for problem 024.
		"""

		sequence = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

		i = 0
		while i < 1000000 - 1:
			self.set_next_lexicographic_permutation(sequence)
			print(sequence)
			i += 1

		print(str(sequence))

		return 1
