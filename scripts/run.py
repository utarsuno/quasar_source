# coding=utf-8

"""This module, run.py, provides a utility script for running various services from the command line."""

from libraries.universal_code.system_abstraction.bash_interactive import BashInteractive


session = BashInteractive()
session.prompt_user_with_list(
	'Select service to run.',
	['jenkins', 'job scheduler']
)

session.run()




