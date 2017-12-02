# coding=utf-8

"""This module, problem_025.py, solves the thirty-ninth euler problem."""

from project_euler_problems.problem import Problem

'''
If p is the perimeter of a right angle triangle with integral length sides, {a,b,c}, there are exactly three solutions for p = 120.

{20,48,52}, {24,45,51}, {30,40,50}

For which value of p ≤ 1000, is the number of solutions maximised?
'''

'''
a^2 + b^2 = c^2
a + b + c = p

...

2pa + 2pb = p^2

tips from : http://www.mathblog.dk/project-euler-39-perimeter-right-angle-triangle/

"
if a and b is even so is c and thus p is even

if a or b (but not both) is odd then c is odd and thus p is even

if both a and b is odd then c is even and thus p is even

Therefore we only need to check the numbers where p is even.
"

"
Furthermore we know a < c and b < c and without loss of generality we can assume that a ≤ b (otherwise we could switch them) which gives us that a ≤ b < c.
That implies  a < p/3 and thus we don’t need to check values higher than that.
"
'''


class ImplementedProblem(Problem):
	"""This specific problem's implementation."""

	def get_solution(self):
		"""Solves the solution for problem 039.
		:return: The solution for problem 039."""

		solutions = {}
		i = 0
		while i < 1001:
			solutions[i] = 0
			i += 1

		p = 2
		while p < 1001:
			a = 1
			while a < p / 3:
				if (p * p - 2 * p * a) % (2 * p - 2 * a) == 0:
					solutions[p] += 1
				a += 1
			p += 2

		longest = 0
		best    = 0
		for s in solutions:
			if solutions[s] > longest:
				longest = solutions[s]
				best    = s

		return best

