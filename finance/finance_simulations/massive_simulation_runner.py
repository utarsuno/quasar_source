# coding=utf-8

"""This module, massive_simulation_runner.py, simply execute many simulations in parallel."""

from c_processes.c_process import CProcess
from c_processes.c_process_manager import ProcessManager


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
		# Make 3000 processes.
		processes_to_run = []
		for p in range(3000):

			# Calculate the weight delta.
			if p < 1000:
				weight_delta = self.delta * p * -2
			elif p < 2000:
				weight_delta = self.delta * p
			else:
				weight_delta = self.delta * p * 2

			weights_to_use = []
			for i, w in enumerate(self.base_training_flags):
				if i == weight_index:
					weights_to_use.append(w + weight_delta)
				else:
					weights_to_use.append(w)

			for i in range(len(weights_to_use)):
				weights_to_use[i] = str(weights_to_use[i])

			processes_to_run.append(CProcess(PATH_TO_TRAINER, weights_to_use))

		simulation_runner = ProcessManager(processes_to_run)
		results = simulation_runner.run_all_c_processes()

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
