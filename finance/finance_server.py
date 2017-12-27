# coding=utf-8

"""This module, finance_server.py, provides a clean way to run multiple C programs at the same time."""

# Allows Python to run sub-processes 'enabling' a form of Python con-currency.
import multiprocessing as mp
# Allows Python to a process and obtain the output.
import subprocess as sp
# OS level related.
import os

from quasar_source_code.universal_code import debugging as dbg

from database_api.nosql_databases import mongodb_api as mongo


def _terminal_command(arguments):
	"""Runs the provided arguments as a regular terminal command."""
	try:
		return (sp.check_output(arguments, shell=True)).decode()
	except sp.CalledProcessError:
		return 'Error in process running \'' + arguments + '\'!'


class FinanceServer(object):
	"""An API to running C programs."""

	def __init__(self):
		self._db_connection = mongo.MongoDBAPI()
		self._db_connection.connect()

		# Output queue.
		self.output = mp.Queue()

		# Setup all the workers.
		self.workers = []
		for x in range(4):
			self.workers.append(mp.Process(target=self.worker(x)))

	def _run_bash_command2(self, arguments):
		"""Runs the provided bash command."""
		if type(arguments) == str:
			p = sp.Popen(args=[arguments], stdout=sp.PIPE, stderr=sp.PIPE)
		else:
			p = sp.Popen(args=arguments, stdout=sp.PIPE, stderr=sp.PIPE)
		p.wait()
		output = p.stdout.read().decode()
		errors = p.stderr.read().decode()
		if len(errors) != 0:
			return 'E:<<' + str(errors) + '>>'
		elif len(output) != 0:
			return str(output)
		else:
			return str(p.returncode)

	def setup(self):
		"""Compiles all the C programs."""
		result = _terminal_command('ls')
		print(result)
		result = _terminal_command('gcc -O3 finance.c')
		print(result)

	def worker(self, id):
		self.output.put('Hello World ' + str(id))

	def run(self):
		for p in self.workers:
			p.start()
		for p in self.workers:
			p.join()
		r = []
		for p in self.workers:
			r.append(self.output.get())
		self._db_connection.print_database_names()
		self._db_connection.terminate()
		return r

fs = FinanceServer()
fs.setup()
