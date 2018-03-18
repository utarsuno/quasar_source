# coding=utf-8

"""This module, massive_simulation_runner.py, simply execute many simulations in parallel."""

from c_processes.c_process import CProcess
from c_processes.c_process_manager import ProcessManager


class MassiveSimulationRunner(object):
	"""Runs many simulations in parallel."""

	def __init__(self):
		self.best_weights = None
		self.best_score   = None

		self.training_flags = [.0001, -.0007, .1, -.4]
		masari_training_process = CProcess('/home/databoi/c_code/m0_net_resistance_testing')

	def one_training_session(self):
		"""Runs a single training session."""
		# A single training session will train each weight 3000 times with varying values.



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