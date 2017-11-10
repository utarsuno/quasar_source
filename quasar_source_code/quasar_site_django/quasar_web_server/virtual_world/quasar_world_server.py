# coding=utf-8

"""This module, quasar_world_server.py, defines the class and operations for running the QuasarWorldServer."""

import threading


# TODO : Check if this class is used
class QuasarWorldServer(object):
	"""Handles the server and game logic for the Quasar World environment that users interact in."""

	# TODO : The initial tick rate probably doesn't need to be so high
	TICK_RATE = 20 # Server sends clients updates 20 times a second.

	def __init__(self):
		self._clients = []
		self._running = False

	def add_connection(self, message):
		"""This method is called when a client establishes a new connection. This might just be a disconnected player re-joining so a new object may not be needed to be created."""
		y = 2
		print('Connection just occurred!')
		print(message)
		print('----@@@-----')
		# TODO :

	def disconnect_message(self, message):
		"""Mark a client as disconnected."""
		print('Disconnect just occurred!')
		print(message)
		print('----@@@-----')

	#def

	#def _run_server(self):
	#	if self.running

	def run_server(self):
		"""Runs the server."""
		if not self._running:
			self._running = True

		else:
			raise RuntimeError('Can\'t start running a server that\'s already running.')

# NOTES TO FOLLOW :

# http://www.gabrielgambetta.com/entity-interpolation.html
'''
"Say you receive position data at t = 1000. You already had received data at t = 900,
so you know where the player was at t = 900 and t = 1000. So, from t = 1000 and t = 1100,
you show what the other player did from t = 900 to t = 1000.
This way you’re always showing the user actual movement data, except you’re showing it 100 ms 'late'."
'''
