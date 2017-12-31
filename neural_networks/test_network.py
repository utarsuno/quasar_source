# coding=utf-8

"""This module, test_network.py, is a quick test file."""

from finance.data_related import finance_database as fdb
from finance.data_related import data_scraper as ds
from universal_code import debugging as dbg
from universal_code import output_coloring as oc

'''__       ___
  |  \  /\   |   /\
  |__/ /~~\  |  /~~\ '''
db = fdb.FinanceDatabase()
db.health_check()
all_data = db.get_all_vector_day_data_for(ds.CRYPTO_CURRENCY_IOTA)


'''     ___ ___       __   __
  |\ | |__   |  |  | /  \ |__) |__/
  | \| |___  |  |/\| \__/ |  \ |  \ '''
NEURON_TYPE_LTG = 'linear threshold gate'
NEURON_TYPE_QTG = 'quadratic threshold gate'


class NetworkLayer(object):
	"""Represents a single layer in a neural network."""

	def __init__(self, number_of_nodes, neuron_type, parent_network):
		self._neuron_type         = neuron_type
		self._network             = parent_network
		self._all_neuron_weights  = []
		self._all_neuron_triggers = []
		i = 0
		while i < number_of_nodes:
			self._all_neuron_weights.append([1] * self._network.number_of_data_elements)
			self._all_neuron_triggers.append(1)
			i += 1

	def run(self, day_vector_data):
		"""Performs the calculations of each of the node."""
		if self._neuron_type == NEURON_TYPE_LTG:

			for n in self._all

		else:
			dbg.raise_exception('Not valid neuron type set')


class NeuralNetwork(object):
	"""Represents a single unique neural network."""

	def __init__(self):
		self._network_layers = []

		# for testing purposes each vector data has the following
		# open, high, low, close, volume, market_cap

		# TODO : Dynamic later
		self._number_of_data_vector_elements = 6

	@property
	def number_of_data_elements(self):
		"""Returns the number of data elements."""
		return self._number_of_data_vector_elements

	def add_network_layer(self, number_of_nodes, node_type):
		"""Adds a layer to the neural network."""
		self._network_layers.append(NetworkLayer(number_of_nodes, node_type, self))

	def run_forward_step(self):
		"""Runs a single run step forward through of the neural network."""
		for network_layer in self._network_layers:
			network_layer.run()

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
		oc.print_title('Running simulation!')
		for day in self._days_data:
			self._run_day(day)
		oc.print_title('Simulation complete!')

	def _run_day(self, day_data):
		"""Runs this specific day."""
		print(day_data)


n = NeuralNetwork()
n.add_network_layer(4, NEURON_TYPE_LTG)

s = Simulation(all_data, n)
s.run_simulation()

