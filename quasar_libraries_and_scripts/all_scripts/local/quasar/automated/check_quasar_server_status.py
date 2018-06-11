# coding=utf-8

"""This module, check_quasar_server_status.py, is used to ensure that Quasar is currently running."""

import requests as r
from universal_code import output_coloring as oc


class QuasarStatusChecker(object):
	"""Utility object to check the status of Quasar."""

	def __init__(self):
		self.number_of_attempts = 0
		self.max_number_of_attempts = 5
		self.last_error_message = None

	def check_status(self):
		"""Checks the status of Quasar."""
		oc.print_data_with_red_dashes_at_start('Checking Quasar status...')
		passed, output = self._run_status_check()
		if not passed:
			if self.number_of_attempts == self.max_number_of_attempts:
				oc.print_ascii_red('build error')
				oc.print_data_with_red_dashes_at_start(output)
			else:
				self.number_of_attempts += 1
				self.check_status()
		else:
			oc.print_ascii_yellow(output)

	def _run_status_check(self):
		"""Runs a status check."""
		try:
			oc.print_data_with_red_dashes_at_start('Checking if Quasar is alive.')
			result = r.get('http://www.quasarsource.com:1337/ping')

			if result.status_code == 200:
				content = result.content.decode('utf-8')
				if content == 'Alive!':
					return True, 'build success'
				else:
					return False, str(content)
			else:
				return False, str('HTTP response code : {' + str(result.status_code) + '}')
		except Exception as e:
			return False, str(e)


quasar_status_checker = QuasarStatusChecker()
quasar_status_checker.check_status()
