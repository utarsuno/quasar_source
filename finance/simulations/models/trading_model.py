# coding=utf-8

"""This module, trading_model.py, describes the base abstraction for a basic trading model."""


class TrainingModel(object):
	"""An abstraction to all things common amongst training models."""

	def __init__(self, weights):
		self._weights = {}