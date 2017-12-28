# coding=utf-8

"""This module, finance_server.py, provides a clean way to run multiple C programs at the same time."""

# Allows Python to run sub-processes 'enabling' a form of Python con-currency.
import multiprocessing as mp
import subprocess as sp
import time

import binascii

from universal_code import output_coloring as oc
from finance.data_related import finance_database as f_db
from finance.data_related import data_scraper as ds

from finance.monte_carlo_simulator.strategies import strategy as s
from finance.monte_carlo_simulator.strategies.buy import buy_strategy as bs
from finance.monte_carlo_simulator.strategies.sell import sell_strategy as ss
from finance.monte_carlo_simulator.strategies.hold import hold_strategy as hs

from finance import finance_code_generator as fcg


def run_terminal_command(arguments):
	"""Runs the provided arguments as a regular terminal command."""
	try:
		return (sp.check_output(arguments, shell=True)).decode()
	except sp.CalledProcessError as e:
		return 'Error in process running \'' + arguments + '\'! + - {' + str(e) + '}'


class Worker(object):
	"""A single 'thread' that runs a C program and returns the output to the FinanceServer."""

	def __init__(self, lock, output_dictionary, worker_id, floats_binary_data, strategy_set):
		self._worker_id = worker_id
		self.worker = mp.Process(target=self.work, args=(lock, output_dictionary, floats_binary_data, strategy_set))

	def run(self):
		"""Runs this worker."""
		self.worker.start()

	def work(self, lock, output_dictionary, floats_binary_data, strategy_set):
		"""Performs the work that needs to be done."""
		oc.print_data('Running a worker!')

		# TODO : Generate the needed file here.
		#print('Need to make a strategy set for :')
		#for s in strategy_set:
		#	print(s)
		#print(strategy_set)

		result = run_terminal_command('./a.out ' + floats_binary_data)
		lock.acquire()
		output_dictionary[self._worker_id] = str(result)
		lock.release()
		oc.print_data('Worked finished!')


class MonteCarloSimulator(object):
	"""Runs monte carlo simulations."""

	def __init__(self):
		self.all_strategy_sets = []
		self._current_index = 0

		self._code_generator = fcg.FinanceCodeGenerator()

	def _generate_c_files(self, strategy_set):
		"""Generates the required c files for this strategy set."""
		name = ''
		for s_s in strategy_set:
		self._code_generator.generate_file(s_s.name + '_')

	def generate_strategy_sets(self):
		"""Generates the strategy sets to test."""
		ssg = s.StrategySetGenerator(bs.all_strategies, ss.all_strategies, hs.all_strategies)
		self.all_strategy_sets = ssg.get_all_strategy_sets()

		for strategy_set in self.all_strategy_sets:
			self._generate_c_files(strategy_set)

	def __len__(self):
		return len(self.all_strategy_sets)


class FinanceServer(object):
	"""An API to running C programs."""

	def __init__(self):
		self._db = f_db.FinanceDatabase(True)
		self._db.health_check()

		self._data_scraper = ds.DataScraper()
		self._iota_day_data = self._data_scraper.get_all_day_data_for(ds.CRYPTO_CURRENCY_IOTA)
		self._iota_open_binary_data_for_c = self.get_all_day_data_as_binary_for_field(self._iota_day_data, ds.KEY_OPEN)

		# The manager allows for shared access to data between processes.
		self.manager = mp.Manager()
		self.output_dictionary = self.manager.dict({})
		# The lock allows for safe con-current writes to the dictionary.
		self.lock = mp.Lock()

		# Setup all the workers.
		self._worker_id = 0
		self.workers = []

		self._monte_carlo_simulator = MonteCarloSimulator()

	def get_all_day_data_as_binary_for_field(self, all_day_data, field):
		"""Returns a bytearray of all the floats from the field of all the day data."""
		combined = None
		for dd in all_day_data:
			if combined is None:
				combined = dd.field_to_c_binary(field)
			else:
				combined = dd.field_to_c_binary(field) + combined
		combined = binascii.b2a_base64(combined).decode('ascii').replace('\n', '')
		return combined

	def setup(self):
		"""Compiles all the C programs."""
		result = run_terminal_command('gcc -O3 finance.c')
		if len(result) != 0:
			oc.print_error('Error compiling finance.c!')
		else:
			oc.print_data('Compiled finance.c!')

		oc.print_data_with_red_dashes_at_start('Generating all strategy sets!')
		self._monte_carlo_simulator.generate_strategy_sets()
		oc.print_data_with_red_dashes_at_start('finished!')

		oc.print_data_with_red_dashes_at_start('Spawning workers!')
		for strategy_set in self._monte_carlo_simulator.all_strategy_sets:
			self.run_worker(strategy_set)

	def run_worker(self, strategy_set):
		"""Runs a new worker."""
		worker = Worker(self.lock, self.output_dictionary, self._worker_id, self._iota_open_binary_data_for_c, strategy_set)
		self._worker_id += 1
		worker.run()
		self.workers.append(worker)

	def run(self):
		oc.print_title('Running the finance simulations!')

		old_size = 0
		while True:

			if len(self.output_dictionary) > old_size:
				old_size = len(self.output_dictionary)
				if old_size == len(self._monte_carlo_simulator):
					break
				print('New data!')
				print(self.output_dictionary)
			else:
				print('Waiting for output...')
				time.sleep(2)

		oc.print_success('Finished running simulations!')

		#self._db_connection.print_database_names()
		self._db.terminate()





fs = FinanceServer()
fs.setup()
'''
fs.run_worker()
fs.run_worker()
fs.run_worker()
fs.run_worker()
fs.run_worker()
'''
fs.run()
