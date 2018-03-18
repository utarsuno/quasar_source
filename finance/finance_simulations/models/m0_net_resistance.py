# coding=utf-8

"""This module, m0_net_resistance.py, represents the M0 trading model."""

from finance.finance_simulations.models.trading_model import FinanceModel
from finance.finance_simulations.data_instance import DataInstance


class FinanceModel_M0(FinanceModel):
	"""Represents a specific finance model."""

	def __init__(self):
		super().__init__(DataInstance.DATA_REQUIREMENT_FULL_BOOK_ORDER)
