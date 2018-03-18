# coding=utf-8

"""This module, massive_simulation_runner.py, simply execute many simulations in parallel."""

from c_processes.c_process import CProcess
from c_processes.c_process_manager import ProcessManager


PATH_TO_TRAINER = '/home/databoi/c_code/m0_net_resistance_testing'


class MassiveSimulationRunner(object):
	"""Runs many simulations in parallel."""

	def __init__(self):
		self.best_weights = None
		self.best_score   = None

		self.delta = .00001

		self.base_training_flags = [.0001, -.0007, .1, -.4]
		#masari_training_process = CProcess('/home/databoi/c_code/m0_net_resistance_testing')

	def one_training_session(self):
		"""Runs a single training session."""
		# A single training session will train each weight 3000 times with varying values.

		number_of_weights = len(self.base_training_flags)
		#for w in range(number_of_weights):
		self._train_one_weight(0)


	def _train_one_weight(self, weight_index):
		"""Trains a single weight."""
		# Make 3000 processes.
		processes_to_run = []
		for p in range(3000):

			# Calculate the weight delta.
			if p < 1000:
				weight_delta = self.delta * p * -1
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

		print('GOT THE FOLLOWING RESULTS')
		for r in results:
			#print(r)
			print(str(r[0].flags) + ' --- ' + str(r[1]))




simulation_runner = MassiveSimulationRunner()
simulation_runner.one_training_session()

'''


		data_instances = []
		c_processes = []
		for f in files:
			c_processes.append(CProcess(self._simulation_data_fetcher.executable_file_path, [f]))
		simulation_runner = ProcessManager(c_processes)
		results = simulation_runner.run_all_c_processes()
		for r in results:
			data_instances.append(DataInstance(r))
		return data_instances

'''