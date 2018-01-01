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

	def __init__(self, number_of_nodes, neuron_type, number_of_weights):
		self._neuron_type         = neuron_type
		self._all_neuron_weights  = []
		self._all_neuron_triggers = []
		i = 0
		while i < number_of_nodes:
			self._all_neuron_weights.append([1] * number_of_weights)
			self._all_neuron_triggers.append(1)
			i += 1
		self._number_of_neurons = len(self._all_neuron_weights)

	def run(self, vector_data):
		"""Performs the calculations of each of the node."""
		output_values = [0] * self._number_of_neurons

		if self._neuron_type == NEURON_TYPE_LTG:

			trigger_values = [0] * self._number_of_neurons

			# 'For each neuron'
			for neuron, weights in enumerate(self._all_neuron_weights):

				# For each weight.
				for i, w in enumerate(weights):
					trigger_values[neuron] += w * vector_data[i]

				if trigger_values[neuron] > self._all_neuron_triggers[neuron]:
					output_values[neuron] = 1

			return output_values

		else:
			dbg.raise_exception('Not valid neuron type set')

	def set_trigger_value_for_each_neuron(self, trigger_value):
		"""Sets a trigger value for every neuron in this layer."""
		tv = 0
		while tv < len(self._all_neuron_triggers):
			self._all_neuron_triggers[tv] = trigger_value
		return tv

	@property
	def number_of_nodes(self) -> int:
		"""Returns the number of nodes that this layer has."""
		return self._number_of_neurons


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
		if len(self._network_layers) == 0:
			self._network_layers.append(NetworkLayer(number_of_nodes, node_type, self._number_of_data_vector_elements))
		else:
			self._network_layers.append(NetworkLayer(number_of_nodes, node_type, self._network_layers[-1].number_of_nodes))

	def run_forward_step(self, day_data):
		"""Runs a single run step forward through of the neural network."""
		oc.print_data_with_red_dashes_at_start('Running forward step!')
		output_vector = self._network_layers[0].run(day_data)
		for i, network_layer in enumerate(self._network_layers):
			if i != 0:
				output_vector = network_layer.run(output_vector)

		oc.print_data(str(output_vector))

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
		self._network.run_forward_step(day_data)


n = NeuralNetwork()
n.add_network_layer(3000, NEURON_TYPE_LTG)
n.add_network_layer(200, NEURON_TYPE_LTG)
n.add_network_layer(2, NEURON_TYPE_LTG)

s = Simulation(all_data, n)
s.run_simulation()

