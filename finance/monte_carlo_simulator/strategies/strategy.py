# coding=utf-8

"""This module, strategy.py, provides an abstraction to buy, sell, and hold strategies."""

import itertools

STRATEGY_TYPE_BUY  = 'buy'
STRATEGY_TYPE_SELL = 'sell'
STRATEGY_TYPE_HOLD = 'hold'


class Strategy(object):
	"""Base class for buy, sell, and hold strategies."""
	def __init__(self, name):
		self._name        = name
		self._description = None

	@property
	def name(self) -> str:
		"""Returns the name of this strategy."""
		return self._name

	@property
	def description(self) -> str:
		"""Returns the description of this strategy."""
		return self._description

	@description.setter
	def description(self, d) -> None:
		"""Sets the description of this strategy."""
		self._description = d


class StrategySetGenerator(object):
	"""Generates all the possible strategy sets."""

	def __init__(self, all_buy_strategies, all_sell_strategies, all_hold_strategies):
		self._buy_strategies    = all_buy_strategies
		self._sell_strategies   = all_sell_strategies
		self._hold_strategies   = all_hold_strategies
		self._all_strategy_sets = []

	def _get_combinations(self, strategies):
		"""Utility function to get a combination of a list."""
		i = 1
		combinations = []
		while i < len(strategies) + 1:
			sub_combinations = list(itertools.combinations(strategies, i))
			for c in sub_combinations:
				combinations.append(list(c))
			i += 1
		return list(combinations)

	def get_all_strategy_sets(self):
		"""Returns a list of all the strategy sets."""
		if len(self._all_strategy_sets) == 0:
			all_sets = set()

			buy_combinations  = self._get_combinations(self._buy_strategies)
			sell_combinations = self._get_combinations(self._sell_strategies)
			hold_combinations = self._get_combinations(self._hold_strategies)

			for bc in buy_combinations:
				for sc in sell_combinations:
					for hc in hold_combinations:
						all_sets.add(str(bc + sc + hc))

			self._all_strategy_sets = list(all_sets)

		return self._all_strategy_sets