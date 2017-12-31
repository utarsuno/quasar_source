# coding=utf-8

"""This module, test_network.py, is a quick test file."""

from finance.data_related import finance_database as fdb
from finance.data_related import data_scraper as ds

'''__       ___
  |  \  /\   |   /\
  |__/ /~~\  |  /~~\ '''
db = fdb.FinanceDatabase()
db.health_check()
all_data = db.get_all_day_data_for(ds.CRYPTO_CURRENCY_IOTA)


'''     ___ ___       __   __
  |\ | |__   |  |  | /  \ |__) |__/
  | \| |___  |  |/\| \__/ |  \ |  \ '''
NEURON_TYPE_LTG = 'linear threshold gate'
NEURON_TYPE_QTG = 'quadratic threshold gate'


class NetworkLayer(object):
	"""Represents a single layer in a neural network."""

	def __init__(self, number_of_nodes, neuron_type):
		self._neuron_type = neuron_type


class NeuralNetwork(object):
	"""Represents a single unique neural network."""

	def __init__(self):
		self._network_layers = []

	def add_network_layer(self, number_of_nodes, node_type):
		"""Adds a layer to the neural network."""
		self._network_layers.append(NetworkLayer(number_of_nodes, node_type))

'''__                         ___    __
  /__` |  |\/| |  | |     /\   |  | /  \ |\ |
  .__/ |  |  | \__/ |___ /~~\  |  | \__/ | \| '''


class Simulation(object):
	"""A basic simulation runner."""

	def __init__(self, days_to_test, network_to_test):
		self._days_data = days_to_test
		self._network   = network_to_test

	def run_simulation(self):
		"""Runs the simulation."""
		for day in self._days_data:
			self._run_day(day)

	def _run_day(self, day):
		"""Runs this specific day."""
		print('GET DATA FOR DAY : ')
		print(day)


n = NeuralNetwork()
n.add_network_layer(4, NEURON_TYPE_LTG)
n.add_network_layer(3, NEURON_TYPE_LTG)

s = Simulation(all_data, n)
s.run_simulation()
