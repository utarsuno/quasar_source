# coding=utf-8

"""This module, run.py, provides a utility script for running various services from the command line."""

'''
Created     : 2019.04.19
Environments: {DEV}
'''

'''
from libraries.universal_code.system_abstraction.bash_interactive import BashInteractive

session = BashInteractive()
session.prompt_user_with_list(
	'Select service to run.',
	['jenkins', 'job scheduler']
)
session.run()
'''

from libraries.universal_code.scripting.interactive_script import InteractiveScript
from libraries.universal_code.config_auto_mapper import Developer


class ServiceRunner(InteractiveScript):
	"""Script to run a service."""

	def _run(self, developer: Developer):
		pass

	def __init__(self):
		super().__init__('Service Runner')



