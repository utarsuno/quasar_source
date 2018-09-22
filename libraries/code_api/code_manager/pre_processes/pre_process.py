# coding=utf-8

"""This module, pre_process.py, provides the base abstraction for pre_process steps."""

# #pre-process-replace-style-with{css_nexus_local.min.css}

PRE_PROCESS_MINIFY = '#PRE-PROCESS-MINIFY'


class PreProcess(object):
	"""Represents a PreProcess step."""

	def __init__(self, search_tag):
		self.search_tag = search_tag







