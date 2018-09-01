# coding=utf-8

"""This module, interactive_prompt.py, provides a basic prompt for connecting to a container."""

from libraries.universal_code.system_abstraction import bash_interactive as bi


class NexusLocalPrompt(bi.BashInteractive):
	"""Provides interactive shell session to connect to a running container."""

	def __init__(self):
		super().__init__()

		self._containers = []
		self._selectable = []

		self._add_container('quasar_source_nexus_local', 'nexus local', 100)
		self._add_container('quasar_source_redis', 'redis', 101)
		self._add_container('quasar_source_nginx', 'nginx', 102)
		self._add_container('quasar_source_websocket', 'websocket', 103)
		self._add_container('quasar_source_code_manager', 'code_manager', 104)


		container_list = bi.BashPromptListSelection('container_choice', 'choose a running container to ssh into')

		index = 0
		for c in self._containers:
			if c[0] is not None:
				container_list.add_selection_choice(c[1], c[2])
				self._selectable.append(index)
			index += 1

		if len(container_list) > 0:
			selection = container_list.run()
			exit(self._containers[self._selectable[selection]][3])
		else:
			self.raise_exception('no containers currently running')
			exit(0)

	def _add_container(self, container_name, description, exit_code):
		"""Adds a container."""
		self._containers.append([self.check_container(container_name), container_name, description, exit_code])

	def check_container(self, container_name):
		"""Checks if a container is currently running."""
		o = self.get_bash_output(['docker', 'ps', '--no-trunc'])

		lines = o.split('\n')
		for l in lines:
			if container_name in l:
				return l.split()[0]
		return None


session = NexusLocalPrompt()
