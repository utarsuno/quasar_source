# coding=utf-8

"""This module, simple_timer.py, provides a class for a simple timer."""

import time


class SimpleTimer(object):
	"""A simple timer."""

	def __init__(self):
		self._start_time = None
		self._end_time   = None

	def start(self):
		"""Starts the timer."""
		self._start_time = time.time()

	def stop(self):
		"""Ends the timer."""
		self._end_time = time.time()

	def __str__(self):
		delta = self._end_time - self._start_time
		if delta < 0.001:
			return '0s'
		return str(self._end_time - self._start_time) + 's'
