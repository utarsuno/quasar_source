# coding=utf-8

"""This module, _operations_docker.py, is used to run health checks on Docker features such as networks and volumes."""

from libraries.universal_code.system_abstraction import bash_interactive as bi
from libraries.universal_code.system_abstraction.python_shell_script import PythonShellScript
from libraries.universal_code.system_abstraction.shell_command_runner import BashCommandRunner
from libraries.universal_code import output_coloring as oc
import sys

ARG_OPERATION_ENSURE_NETWORK       = 'n'
ARG_OPERATION_ENSURE_VOLUME        = 'v'
ARG_OPERATION_CONNECT_TO_CONTAINER = 'c'


class DockerFeature(object):
	"""Represents the state of a Docker feature (such as networks and volumes)."""

	def __init__(self, name, feature_type):
		self.name         = name
		self.feature_type = feature_type
		self.alive        = None

	def run(self):
		"""Runs the health check on this Docker feature."""
		#print('TODO: Docker feature check on {' + self.name + '}')
		self.alive = self.is_feature_alive()
		if self.alive:
			oc.print_data_with_red_dashes_at_start('The ' + self.feature_type + '{' + self.name + '} exists!')
		else:
			oc.print_data_with_red_dashes_at_start('Created ' + self.feature_type + '{' + self.name + '}!')
			self.create_new_feature_instance()

	def is_feature_alive(self):
		"""Checks if the feature is alive."""
		success, details = BashCommandRunner('docker ' + self.feature_type + ' inspect ' + self.name, require_input=True).run()
		return success

	def create_new_feature_instance(self):
		"""Implemented by discrete object types."""
		pass


class DockerFeatureNetwork(DockerFeature):
	"""Checks the Docker network."""

	def __init__(self, name):
		super().__init__(name, 'network')

	def create_new_feature_instance(self):
		"""Creates this particular feature."""
		BashCommandRunner('docker network create -d bridge --subnet 192.168.0.0/24 --gateway 192.168.0.1 ' + self.name).run()


class DockerFeatureVolume(DockerFeature):
	"""Checks the Docker volume."""

	def __init__(self, name):
		super().__init__(name, 'volume')

	def create_new_feature_instance(self):
		"""Creates this particular feature."""
		BashCommandRunner('docker volume create --name ' + self.name).run()
		#BashCommandRunner('docker volume create --driver bridge --name ' + self.name).run()


class DockerConnectToRunningContainer(object):
	"""Connects to a Docker container. Does not actually use SSH."""

	def __init__(self):
		self._running_containers           = []
		self._image_names_to_container_ids = {}

	def _get_start_positions_of_cols(self, line):
		"""Utility function."""
		start_positions = [0]
		in_word  = True
		index    = 0
		for c in line:
			if c != ' ':
				if not in_word:
					in_word = True
					start_positions.append(index)
			else:
				if in_word:
					in_word = False
			index += 1
		# TODO: FIX THIS REALLY BAD SOLUTION! ('CONTAINER ID has a space').
		start_positions.remove(10)
		return start_positions

	def _parse_output(self, o):
		"""Utility function."""
		cols = []
		col_starts = self._get_start_positions_of_cols(o[0])

		lines = o[1:]
		for l in lines:
			elements = []
			for i, p in enumerate(col_starts):
				if i == len(col_starts) - 1:
					elements.append((l[col_starts[i]:len(l)]).rstrip())
				else:
					elements.append((l[col_starts[i]:col_starts[i + 1]]).rstrip())
			cols.append(elements)

		return cols

	def run(self):
		"""TODO:"""
		output = BashCommandRunner(['docker', 'ps', '--no-trunc']).run(cwd=None, raise_exception=True, get_as_lines=True)

		cols = self._parse_output(output)
		if len(cols) == 0:
			oc.print_data_with_red_dashes_at_start('There are currently no Docker containers running.')
		else:
			sys.stdout.flush()
			container_list = bi.BashPromptListSelection('container_choice', 'choose a running container to ssh into')
			sys.stdout.flush()

			for c in cols:
				container_id = c[0]
				image_name   = c[1]
				#self._prompt_choices.append([image_name, container_id])
				self._image_names_to_container_ids[image_name] = container_id

				container_list.add_selection_choice(image_name, 'connect')

			selection = container_list.run()
			image_name = selection[0]
			#print('CHOSEN IMAGE {' + image_name + '}')
			#print('CHOSEN CONTAINER ID {' + self._image_names_to_container_ids[image_name] + '}')

			#sys.stdout.flush()
			#sys.stderr.write(self._image_names_to_container_ids[image_name])
			# docker exec -it ${CONTAINER_ID} /bin/bash
			sys.stderr.write('docker exec -it ' + self._image_names_to_container_ids[image_name] + ' /bin/bash')


class DockerFeatureChecker(PythonShellScript):
	"""Used to ensure a specific Docker feature is up and running."""

	def __init__(self):
		super().__init__()
		network = DockerFeatureNetwork('nexus_network')
		volume  = DockerFeatureVolume('nexus_volume')
		connect = DockerConnectToRunningContainer()
		self.add_argument_and_respective_procedure(ARG_OPERATION_ENSURE_NETWORK, 'Ensure default external network exists.', False, network.run)
		self.add_argument_and_respective_procedure(ARG_OPERATION_ENSURE_VOLUME, 'Ensure default external volume exists.', False, volume.run)
		self.add_argument_and_respective_procedure(ARG_OPERATION_CONNECT_TO_CONTAINER, 'Connect to a running Docker container.', False, connect.run)
		self.at_least_one_argument_required = True

if __name__ == "__main__":
	script = DockerFeatureChecker()
	script.run()
