# coding=utf-8

"""This module, c_process_manager.py, executes and handles multiple C processes."""

import threading
import queue


class ProcessManager(object):
	"""Manages a group of c_processes and waits for their collection finish before returning data."""

	def __init__(self, list_of_c_processes_to_run: list):
		self._c_processes_to_run = list_of_c_processes_to_run
		self._c_threads          = []
		self._results_queue      = queue.Queue()
		self._results            = {}


	# Code initially based from : https://stackoverflow.com/questions/6893968/how-to-get-the-return-value-from-a-thread-in-python
	def run_all_c_processes(self):
		"""Runs all the c_processes."""
		for c_process in self._c_processes_to_run:
			self._c_threads.append(threading.Thread(target=self._run_simulation, args=(c_process, self._results_queue)))
			#self._c_threads.append(threading.Thread(target=self._run_simulation, args=(c_process, self._results_queue)))
			self._c_threads[-1].start()
		for c_thread in self._c_threads:
			c_thread.join()
		while not self._results_queue.empty():
			print('RESULT')
			result = self._results_queue.get()
			print(result)
			self._results[result[0]] = result[1]
		print('PRINTING THE RESULTS!')
		print(self._results)
		print('@@@@@@@@@@@@@@@@@@@@@@@@@@@')
		for r in self._results:
			print(r)
			print(self._results[r])
			print()

	def _run_simulation(self, c_process, results_queue):
		"""Runs a simulation for a single c_process."""
		c_process.run_process_and_only_get_output()
		results_queue.put([self._c_executable_path, c_process.output_stdout + '::::::' + c_process.output_stderr])


