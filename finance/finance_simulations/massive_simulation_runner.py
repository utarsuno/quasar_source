# coding=utf-8

"""This module, massive_simulation_runner.py, simply execute many simulations in parallel."""

from c_processes.c_process import CProcess
from c_processes.c_process_manager import ProcessManager
import random

PATH_TO_TRAINER = '/home/databoi/c_code/m0_net_resistance_testing'


class MassiveSimulationRunner(object):
	"""Runs many simulations in parallel."""

	def __init__(self):
		self.best_weights = None
		self.best_score   = 1000

		self.delta = .1

		self.base_training_flags = [.0001, -.0007, .1, -.4]

	def one_training_session(self):
		"""Runs a single training session."""
		number_of_weights = len(self.base_training_flags)
		for w in range(number_of_weights):
			self._train_one_weight(w)

	def _train_one_weight(self, weight_index):
		"""Trains a single weight."""
		processes_to_run = []
		for p in range(3000):
			if p < 1000:
				weights = self._get_weights_to_use(weight_index, self.delta * p * -2)
			elif p < 2000:
				weights = self._get_weights_to_use(weight_index, self.delta * p)
			else:
				weights = self._get_weights_to_use(weight_index, self.delta * p * 2)
			processes_to_run.append(CProcess(PATH_TO_TRAINER, weights))
		self._run_simulations(processes_to_run)

	def one_random_training_session(self):
		"""Runs a single training session with random deltas."""
		processes_to_run = []
		for p in range(3000):
			weights = self._get_weights_to_use(random.randint(0, 3), random.uniform(-10, 10))
			processes_to_run.append(CProcess(PATH_TO_TRAINER, weights))
		self._run_simulations(processes_to_run)

	def _get_weights_to_use(self, index_to_modify, amount_to_modify):
		"""Returns a set of weights to use."""
		weights = [0] * 4
		for i, w in enumerate(self.base_training_flags):
			if i == index_to_modify:
				weights[i] = str(self.base_training_flags[i] + amount_to_modify)
			else:
				weights[i] = str(self.base_training_flags[i])
		return weights

	def _run_simulations(self, processes_to_run):
		"""Runs a list of processes."""
		process_runner = ProcessManager(processes_to_run)
		results = process_runner.run_all_c_processes()
		for r in results:
			net_score = float(r[1])
			flags = r[0].flags
			if net_score > self.best_score:
				self.best_score = net_score
				new_weights = []
				for w in flags:
					new_weights.append(float(w))
				print('Better settings found! {' + str(new_weights) + '} ==> {' + str(self.best_score) + '}')
				self.base_training_flags = new_weights


# Run the simulation.
simulation_runner = MassiveSimulationRunner()
simulation_runner.one_training_session()
simulation_runner.one_random_training_session()
simulation_runner.one_random_training_session()
simulation_runner.one_random_training_session()
simulation_runner.one_random_training_session()

