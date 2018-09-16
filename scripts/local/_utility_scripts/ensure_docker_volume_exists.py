# coding=utf-8

"""This module, ensure_docker_network_exists.py, creates the host_connection Docker network if it does not exist."""

from libraries.universal_code.system_abstraction.shell_command_runner import BashCommandRunner
from libraries.universal_code import output_coloring as oc


class DockerVolumeChecker(object):
	"""Utility object."""

	def __init__(self):
		self.volume_name   = 'host_connection'
		self.volume_exists = self.does_volume_exist()
		if not self.volume_exists:
			self.create_volume()
		else:
			oc.print_data_with_red_dashes_at_start('The network{' + self.volume_name + '} exists!')

	def does_volume_exist(self):
		"""Returns a boolean indicating if the network exists."""
		success, details = BashCommandRunner('docker network inspect ' + self.volume_name, require_input=True).run()
		return success

	def create_volume(self):
		"""Creates the network."""
		oc.print_data_with_red_dashes_at_start('Created network{' + self.volume_name + '}!')
		BashCommandRunner('docker network create -d bridge --subnet 192.168.0.0/24 --gateway 192.168.0.1 ' + self.volume_name).run()


check = DockerVolumeChecker()




