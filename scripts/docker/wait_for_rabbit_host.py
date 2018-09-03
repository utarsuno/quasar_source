# coding=utf-8

"""
This module, wait_for_rabbit_host.py, will wait for the RabbitMQ-cluster host to finish loading.
Program exits with code(13) if the max connection attempts have been made.
"""

from libraries.universal_code.system_abstraction.shell_command_runner import BashCommandRunner
from libraries.universal_code import output_coloring as oc
import requests as r
from time import sleep


class WaitForRabbitMQHost(object):
	"""Utility class."""

	def __init__(self):
		self.url                        = 'http://192.168.0.1:15672/#/'
		self.max_attempts               = 25
		self.retry_wait_time            = .5
		self.retry_wait_time_multiplier = 1.5

	def wait_for_connection(self):
		"""Waits for the RabbitMQ connection."""
		current_attempt = 0
		while current_attempt < self.max_attempts:
			if self.check_connection() == '':
				return
			else:
				oc.print_data('...trying connection to rabbit_manager, current attempt{' + str(current_attempt) + '/' + str(self.max_attempts) + '}')
				sleep(self.retry_wait_time)
				self.retry_wait_time *= self.retry_wait_time_multiplier
			current_attempt += 1

	def check_connection(self):
		"""Checks if RabbitMQ is running."""
		success = False
		error_message = ''
		try:
			result = r.get(self.url)
			if result.status_code == 200:
				success = True
			else:
				error_message = 'Status code {' + str(result.status_code) + '}'
		except r.exceptions.RequestException as e:  # This is the correct syntax
			error_message = e

		if not success:
			return error_message
		return ''

if __name__ == "__main__":
	wait = WaitForRabbitMQHost()
	wait.wait_for_connection()
