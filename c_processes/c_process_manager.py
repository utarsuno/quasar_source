# coding=utf-8

"""This module, c_process_manager.py, executes and handles multiple C processes."""

import threading
import queue
from universal_code import output_coloring as oc


class ProcessManager(object):
	"""Manages a group of c_processes and waits for their collection finish before returning data."""

	def __init__(self, list_of_c_processes_to_run: list):
		self._c_processes_to_run = list_of_c_processes_to_run
		self._c_threads          = []
		self._results_queue      = queue.Queue()
		self._results            = []

	# Code initially based from : https://stackoverflow.com/questions/6893968/how-to-get-the-return-value-from-a-thread-in-python
	def run_all_c_processes(self):
		"""Runs all the c_processes."""
		oc.print_title('Running {' + str(len(self._c_processes_to_run)) + '} threads!')
		for c_process in self._c_processes_to_run:
			self._c_threads.append(threading.Thread(target=self._run_simulation, args=(c_process, self._results_queue)))
			# self._c_threads.append(threading.Thread(target=self._run_simulation, args=(c_process, self._results_queue)))
			self._c_threads[-1].start()
		for c_thread in self._c_threads:
			c_thread.join()
		while not self._results_queue.empty():
			result = self._results_queue.get()
			self._results.append([result[0], result[1]])
		oc.print_success('Finished running threads!')
		return self._results

	def _run_simulation(self, c_process, results_queue):
		"""Runs a simulation for a single c_process."""
		output_stdout, output_stderr = c_process.run_process_and_only_get_output()

		if output_stderr is not None:
			if str(output_stderr) > 0:
				results_queue.put([c_process, 'ERROR {' + str(output_stderr) + '}'])
		else:
			results_queue.put([c_process, str(output_stdout)])
