# coding=utf-8

"""This module, terminal_api.py, is a simple utility for running terminal commands and getting output."""

import subprocess as sp


def run_terminal_command(arguments):
	"""Runs the provided arguments as a regular terminal command."""
	try:
		return (sp.check_output(arguments, shell=True)).decode()
	except sp.CalledProcessError as e:
		return 'Error in process running \'' + arguments + '\'! + - {' + str(e) + '}'
