# coding=utf-8

"""
This module, problem_001.py, solves the fifteenth project euler problem.
"""

from project_euler_problems.problem import Problem


'''
If the numbers 1 to 5 are written out in words: one, two, three, four, five, then there are 3 + 3 + 5 + 4 + 4 = 19 letters used in total.

If all the numbers from 1 to 1000 (one thousand) inclusive were written out in words, how many letters would be used?


NOTE: Do not count spaces or hyphens. For example, 342 (three hundred and forty-two) contains 23 letters and 115 (one hundred and fifteen) contains 20 letters. The use of "and" when writing out numbers is in compliance with British usage.
'''

numbers_to_letters = {
0    : len('AND'),
1    : len('ONE'),
2    : len('TWO'),
3    : len('THREE'),
4    : len('FOUR'),
5    : len('FIVE'),
6    : len('SIX'),
7    : len('SEVEN'),
8    : len('EIGHT'),
9    : len('NINE'),
10   : len('TEN'),
11   : len('ELEVEN'),
12   : len('TWELVE'),
13   : len('THIRTEEN'),
14   : len('FOURTEEN'),
15   : len('FIFTEEN'),
16   : len('SIXTEEN'),
17   : len('SEVENTEEN'),
18   : len('EIGHTEEN'),
19   : len('NINETEEN'),
20   : len('TWENTY'),
30   : len('THIRTY'),
40   : len('FORTY'),
50   : len('FIFTY'),
60   : len('SIXTY'),
70   : len('SEVENTY'),
80   : len('EIGHTY'),
90   : len('NINETY'),
100  : len('HUNDRED'),
1000 : len('THOUSAND'),
}


class ImplementedProblem(Problem):
	"""This specific problem's implementation.
	"""

	def sum_of_number_of_letters_for_numbers_up_to_n(self, n):
		"""Returns the sum of number of letters needed for numbers up to n.
		:param n: The max number to go to.
		:return: The sum of letters for numbers up to the number n provided.
		"""
		i = 1
		local_sum = 0
		while i < n + 1:
			if i < 20:
				local_sum += numbers_to_letters[i]
			elif i % 10 == 0 and i < 100:
				local_sum += numbers_to_letters[i]
			elif i < 100:
				local_sum += numbers_to_letters[int(str(i)[0] + '0')] + numbers_to_letters[int(str(i)[1])]
			elif i == 1000:
				local_sum += numbers_to_letters[1] + numbers_to_letters[i]
			elif i % 100 == 0:
				local_sum += numbers_to_letters[int(i / 100)] + numbers_to_letters[100]
			else:
				local_sum += numbers_to_letters[int(i / 100)] + numbers_to_letters[100] + numbers_to_letters[0]
				smaller_sum = str(i)[1:]
				if int(smaller_sum[0]) < 2:
					local_sum += numbers_to_letters[int(smaller_sum)]
				elif int(smaller_sum[1]) == 0:
					local_sum += numbers_to_letters[int(smaller_sum)]
				else:
					local_sum += numbers_to_letters[int(smaller_sum[0] + '0')] + numbers_to_letters[int(smaller_sum[1])]
			i += 1
		return local_sum

	def get_solution(self):
		"""Solves the solution for problem 014.
		:return: The solution for problem 014.
		"""
		return self.sum_of_number_of_letters_for_numbers_up_to_n(1000)
