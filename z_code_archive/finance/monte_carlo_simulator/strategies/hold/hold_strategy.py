# coding=utf-8

"""This module, hold_strategy.py, provides an abstraction to hold strategies."""

from finance.monte_carlo_simulator.strategies import strategy as s


class StrategyHold(s.Strategy):
	"""Base class for a hold strategy."""
	def __init__(self, name):
		super().__init__(name)
		self._type = s.STRATEGY_TYPE_HOLD

hs_0 = StrategyHold('simple_moving_average_streak')
hs_0.description = 'Returns a 0-1 confidence rating on holding a stock based off how consistent the moving average has been positive.'

all_strategies = [hs_0]
