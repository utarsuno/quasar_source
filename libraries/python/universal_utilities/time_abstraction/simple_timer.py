# coding=utf-8

"""This module, simple_timer.py, provides a class for a simple timer."""

import time


class SimpleTimer(object):
	"""A simple timer."""

	def __init__(self, auto_start=False):
		self._running          = False
		self._time_start       = None
		self._time_end         = None
		self._time_accumulated = 0.0
		if auto_start:
			self.start()

	def start(self):
		"""Starts the timer."""
		assert not self._running
		self._time_start = time.time()
		self._running    = True

	def stop(self):
		"""Ends the timer."""
		assert self._running
		self._time_end = time.time()
		self._running  = False

	def pause(self):
		"""Pause the timer."""
		if self._running:
			if self._time_end is None:
				self.stop()
			self._time_accumulated += self._time_end - self._time_start
			self._running           = False

	def __str__(self):
		self.pause()
		if self._time_accumulated < 0.0001:
			return '0s'
		return str(self._time_accumulated) + 's'



