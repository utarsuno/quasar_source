# coding=utf-8

"""This file, config_auto_mapper.py, reads the local configuration
settings and grabs particular values based off this machine's mac address."""

from uuid import getnode as get_mac
from libraries.universal_code import useful_file_operations as ufo
from libraries.universal_code import debugging as dbg
from libraries.universal_code.common_traits.trait_name import TraitName

import os
os.path.dirname(os.path.abspath(__file__))


class Developer(TraitName):
	"""Represents the loaded configurations of a developer."""

	def __init__(self, dev_name: str, configs: dict):
		TraitName.__init__(self, dev_name)
		self._mac       = configs['mac']
		self._path      = configs['path']

	def matches_mac(self, mac_address: int) -> bool:
		"""Returns a boolean indicating if the provided mac address matches this dev."""
		return self._mac == mac_address

	def get_path_git(self) -> str:
		"""Returns the path to the git file."""
		return self._path + '/.git'

	def get_base_path(self) -> str:
		"""Returns the base path of the project."""
		return self._path


class LocalConfigurations(object):
	"""Fetches and stores in memory, all locally needed setting values."""

	def __init__(self):
		local_mac        = get_mac()
		settings_path    = os.path.abspath(__file__)
		settings_path    = settings_path[:settings_path.index('libraries/')] + 'documentation_and_settings/quasar_source.yml'
		settings_content = ufo.file_get_yaml_contents(settings_path)
		devs             = []
		self.local_dev   = None

		for dev in settings_content['developers']:
			devs.append(Developer(dev, settings_content['developers'][dev]))

		for dev in devs:
			if dev.matches_mac(local_mac):
				self.local_dev = dev
				break

		if self.local_dev is None:
			dbg.raise_exception('Local dev settings not found!')


