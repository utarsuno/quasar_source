# coding=utf-8

"""This module, interactive_prompt.py, provides a basic prompt for connecting to a container."""

from quasar_libraries_and_scripts.universal_code.system_abstraction import bash_interactive as bi


class NexusLocalPrompt(bi.BashInteractive):
	"""Provides interactive shell session to connect to a running container."""

	def __init__(self):
		super().__init__()

		self._nexus_local_running = self.check_container('quasarsource_nexus_local')

		container_list = bi.BashPromptListSelection('container_choice', 'choose a running container to ssh into')
		if self._nexus_local_running is not None:
			container_list.add_selection_choice('nexus_local', 'the local container')

		if len(container_list) > 0:
			selection = container_list.run()
			exit(selection + 100)
		else:
			self.raise_exception('no containers currently running')
			exit(0)

	def check_container(self, container_name):
		"""Checks if a container is currently running."""
		o = self.get_bash_output(['docker', 'ps', '--no-trunc'])

		lines = o.split('\n')
		for l in lines:
			if container_name in l:
				return l.split()[0]
		return None


session = NexusLocalPrompt()
