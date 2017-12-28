# coding=utf-8

"""This module, buy_strategy.py, provides an abstraction to buy strategies."""

from finance.monte_carlo_simulator.strategies import strategy as s


class StrategyBuy(s.Strategy):
	"""Base class for a buy strategy."""
	def __init__(self, name):
		super().__init__(name)

bs_0 = StrategyBuy('simple_moving_average_streak')
bs_0.description = 'Returns a 0-1 confidence rating on buying a stock based off how consistent the moving average has been positive.'

all_strategies = [bs_0]
