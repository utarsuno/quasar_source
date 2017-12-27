# coding=utf-8

"""This module, finance_server.py, provides a clean way to run multiple C programs at the same time."""

# Allows Python to run sub-processes 'enabling' a form of Python con-currency.
import multiprocessing as mp
# Allows Python to a process and obtain the output.
import subprocess as sp
# OS level related.
import os

import time

from quasar_source_code.universal_code import output_coloring as oc

from quasar_source_code.universal_code import debugging as dbg

from database_api.nosql_databases import mongodb_api as mongo


def run_terminal_command(arguments):
	"""Runs the provided arguments as a regular terminal command."""
	try:
		return (sp.check_output(arguments, shell=True)).decode()
	except sp.CalledProcessError:
		return 'Error in process running \'' + arguments + '\'!'


class Worker(object):
	"""A single 'thread' running a C program."""

	def __init__(self, output_queue):
		self.worker = mp.Process(target=self.work)
		self.output_queue = output_queue

	def run(self):
		"""Runs this worker."""
		self.worker.start()

	def work(self):
		"""Performs the work that needs to be done."""
		result = run_terminal_command('./a.out')
		if len(result) != 0:
			self.output_queue.put('Error running a.out! - ' + str(result))
			print('Error running a.out! - ' + str(result))
		else:
			self.output_queue.put(result)


class FinanceServer(object):
	"""An API to running C programs."""

	def __init__(self):
		self._db_connection = mongo.MongoDBAPI()
		self._db_connection.connect()

		# Output queue.
		self.output = mp.Queue()

		# Setup all the workers.
		self.workers = []

		self.output_history = []

		#for x in range(4):
		#	self.workers.append(mp.Process(target=self.worker(x)))

	def setup(self):
		"""Compiles all the C programs."""
		result = run_terminal_command('gcc -O3 finance.c')
		if len(result) != 0:
			print('Error compiling finance.c!')
		else:
			if len(result) > 0:
				print(result)

	def run_worker(self):
		self.workers.append(Worker(self.output))

	def run(self):
		oc.print_title('Running the finance server!')
		old_size = 0
		while True:
			if self.output.empty():
				continue
			self.output_history.append(self.output.get_nowait())
			if len(self.output_history) > old_size:
				print('New output!')
				old_size += 1

			print('sleeping for 1 second')
			time.sleep(1)

		#self._db_connection.print_database_names()
		self._db_connection.terminate()

fs = FinanceServer()
fs.setup()
fs.run_worker()
fs.run_worker()
fs.run_worker()
fs.run_worker()
fs.run_worker()
fs.run()
