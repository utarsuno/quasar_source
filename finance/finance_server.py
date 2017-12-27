# coding=utf-8

"""This module, finance_server.py, provides a clean way to run multiple C programs at the same time."""

# Allows Python to run sub-processes 'enabling' a form of Python con-currency.
import multiprocessing as mp
# Allows Python to a process and obtain the output.
import subprocess as sp
# OS level related.
import os
import sys
import time

from quasar_source_code.universal_code import output_coloring as oc

from quasar_source_code.universal_code import debugging as dbg

from database_api.nosql_databases import mongodb_api as mongo


def run_terminal_command(arguments):
	"""Runs the provided arguments as a regular terminal command."""
	try:
		return (sp.check_output(arguments, shell=True)).decode()
	except sp.CalledProcessError as e:
		return 'Error in process running \'' + arguments + '\'! + - {' + str(e) + '}'


class Worker(object):
	"""A single 'thread' running a C program."""

	def __init__(self, lock, output_dictionary, worker_id):
		self._worker_id = worker_id
		self.worker = mp.Process(target=self.work, args=(lock, output_dictionary, worker_id))
		#self.output_queue = output_queue
		#self.output_queue.put(result)

	def run(self):
		"""Runs this worker."""
		self.worker.start()

	def work(self, lock, output_dictionary):
		"""Performs the work that needs to be done."""
		oc.print_data('Running a worker!')
		result = run_terminal_command('./a.out')
		lock.acquire()
		output_dictionary[self._worker_id] = str(result)
		lock.release()
		oc.print_data('Worked finished!')


class FinanceServer(object):
	"""An API to running C programs."""

	def __init__(self):
		self._db_connection = mongo.MongoDBAPI()
		self._db_connection.connect()

		# Output queue.
		self.output = mp.Queue()

		self.manager = mp.Manager()
		self.output_dictionary = self.manager.dict({})
		self.lock = mp.Lock()

		# Setup all the workers.
		self._worker_id = 0
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
			else:
				oc.print_data('Compiled finance.c!')

	def run_worker(self):
		worker = Worker(self.lock, self.output_dictionary, self._worker_id)
		self._worker_id += 1
		worker.run()
		self.workers.append(worker)

	def run(self):
		oc.print_title('Running the finance server!')
		old_size = 0
		while True:

			if len(self.output_dictionary) > old_size:
				old_size = len(self.output_dictionary)
				print('new entries!')
			else:
				print('no output!')
				time.sleep(1)

			continue


			if self.output.empty():
				print('output is empty')
				time.sleep(1)
				continue
			self.output_history.append(self.output.get_nowait())
			if len(self.output_history) > old_size:
				print('New output!')
				old_size += 1

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
