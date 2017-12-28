# coding=utf-8

"""This module, sell_strategy.py, provides an abstraction to sell strategies."""

from finance.monte_carlo_simulator.strategies import strategy as s


class StrategySell(s.Strategy):
	"""Base class for a sell strategy."""
	def __init__(self, name):
		super().__init__(name)
		self._type = s.STRATEGY_TYPE_SELL

ss_0 = StrategySell('simple_moving_average_streak')
ss_0.description = 'Returns a 0-1 confidence rating on selling a stock based off how consistent the moving average has been positive.'

all_strategies = [ss_0]
