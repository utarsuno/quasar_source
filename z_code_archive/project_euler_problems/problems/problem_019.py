# coding=utf-8

"""
This module, problem_019.py, solves the nineteenth project euler problem.
"""

from project_euler_problems.problem import Problem

from datetime import date

'''
You are given the following information, but you may prefer to do some research for yourself.

1 Jan 1900 was a Monday.
Thirty days has September,
April, June and November.
All the rest have thirty-one,
Saving February alone,
Which has twenty-eight, rain or shine.
And on leap years, twenty-nine.
A leap year occurs on any year evenly divisible by 4, but not on a century unless it is divisible by 400.
How many Sundays fell on the first of the month during the twentieth century (1 Jan 1901 to 31 Dec 2000)?
'''

# Solution from captainsafia, thanks! Link : https://gist.github.com/captainsafia/3390092


class ImplementedProblem(Problem):
	"""This specific problem's implementation.
	"""

	def get_solution(self):
		"""Solves the solution for problem 019.
		:return: The solution for problem 019.
		"""
		number_of_sundays = 0
		for year in range(1901, 2001):
			for month in range(1, 13):
				# date(...) will create a Date() instance.
				# weekday() gets the current day as an integer between 0-6.
				if date(year, month, 1).weekday() == 6:
					number_of_sundays += 1
		return number_of_sundays
