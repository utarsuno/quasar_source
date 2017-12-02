# coding=utf-8

"""This module, problem_053.py, solves the fifty-third euler problem."""

from project_euler_problems.problem import Problem

'''
There are exactly ten ways of selecting three from five, 12345:

123, 124, 125, 134, 135, 145, 234, 235, 245, and 345

In combinatorics, we use the notation, 5C3 = 10.

In general,

nCr = n! / r!(n−r)!, where r ≤ n, n! = n×(n−1)×...×3×2×1, and 0! = 1.
It is not until n = 23, that a value exceeds one-million: 23C10 = 1144066.

How many, not necessarily distinct, values of  nCr, for 1 ≤ n ≤ 100, are greater than one-million?
'''

# Got help from this link : http://csharphelper.com/blog/2014/08/calculate-the-binomial-coefficient-n-choose-k-efficiently-in-c/

'''
(n choose k) = n! / (k!(n-k)!)

(n choose k) = (n(n-1)!) / (k(k-1)!((n-1)-(k-1))!)

(n choose k) = n/k * (n - 1 choose k - 1)


This lets the equation be written this way :

(n choose k) = (n / k) * (n - 1 / k - 1) * (n - 2 / k - 2) * ... * ((n - (k - 1)) / (k - (k - 1)))


"If you group the terms from the right and work backwards, you can successively calculate :
(n - (k - 1) choose 1)
(n - (k - 2) choose 2)
...
(n choose k)
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation."""

	def n_choose_k(self, n, k):
		result = 1
		i = 1
		while i <= k:
			result *= n - (k - i)
			result /= i
			i += 1

	def get_solution(self):
		"""Solves the solution for problem 053.
		:return: The solution for problem 053."""



		return 1
