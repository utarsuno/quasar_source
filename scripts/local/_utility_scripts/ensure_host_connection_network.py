# coding=utf-8

"""This module, ensure_host_connection_network.py, creates the host_connection Docker network if it does not exist."""

from libraries.universal_code.system_abstraction.shell_command_runner import BashCommandRunner
from libraries.universal_code import output_coloring as oc


class DockerHostConnectionNetworkChecker(object):
	"""Utility object."""

	def __init__(self):
		self.network_name   = 'host_connection'
		self.network_exists = self.does_network_exist()
		if not self.network_exists:
			self.create_network()
		else:
			oc.print_data_with_red_dashes_at_start('The network{' + self.network_name + '} exists!')

	def does_network_exist(self):
		"""Returns a boolean indicating if the network exists."""
		success, details = BashCommandRunner('docker network inspect ' + self.network_name, require_input=True).run()
		return success

	def create_network(self):
		"""Creates the network."""
		oc.print_data_with_red_dashes_at_start('Created network{' + self.network_name + '}!')
		BashCommandRunner('docker network create -d bridge --subnet 192.168.0.0/24 --gateway 192.168.0.1 ' + self.network_name).run()


check = DockerHostConnectionNetworkChecker()




