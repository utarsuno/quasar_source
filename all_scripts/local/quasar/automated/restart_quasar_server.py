# coding=utf-8

"""This module, restart_quasar_server.py, restarts the Quasar server and then ensures that it is running."""

from universal_code.shell_abstraction.shell_command_runner import run_shell_command_and_get_results as run_command
from universal_code.shell_abstraction.shell_command_runner import run_and_get_output_no_input as cmd
from universal_code import output_coloring as oc

SERVER_QUASAR = 'quasar'
SERVER_ENTITY = 'entity'


class ServerUtilities(object):
	"""Utility class to perform operations on a specified server."""

	def __init__(self, server):
		self.server = server
		self.status_check_script = '/Users/utarsuno/git_repos/quasar_source/all_scripts/local/quasar/automated/entity_server_status.sh'

		#print(cmd(['ls']))

	#def _get_output_of_command(self, script):
	#	"""Utility function."""
	#	#return cmd(['bash', script])
	#	return cmd([script])

	def _get_output_of_command(self, script):
		"""Utility function."""
		results = run_command(['bash', script])
		output = results[0].decode('utf-8').split('\n')
		error = results[1].decode('utf-8')
		#if len(error) > 0:
		#	oc.print_data_with_red_dashes_at_start('Error! {\n' + str(error) + '}')
		#	exit()
		return output

	def restart_server(self):
		"""Restarts the server."""
		print('Restarting server!')
		results = self._get_output_of_command(self.restart_server_script)
		print(results)

	def check_server_status(self):
		"""Checks the server status."""
		print('Checking server status!')
		results = self._get_output_of_command(self.status_check_script)
		print('Finished results are')
		print(results)
		for l in results:
			l = str(l)
			print('LINE : ' + str(l))
			if 'entity server' in l:
				oc.print_data_with_red_dashes_at_start(l)
				if 'not' in l:
					print('Entity server is not running!')
				else:
					print('Entity server is running!')
				#break



entity_server = ServerUtilities(SERVER_ENTITY)

entity_server.check_server_status()
#entity_server.restart_server()
#entity_server.check_server_status()
