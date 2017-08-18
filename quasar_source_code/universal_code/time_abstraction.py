# coding=utf-8

"""This module, time_abstraction.py, serves as a light abstraction to Python's datetime."""

from datetime import datetime, timedelta


def get_today() -> datetime.date:
	"""Gets a Date object representing today."""
	return datetime.today().date()


def get_yesterday() -> datetime.date:
	"""Gets a Date object representing yesterday."""
	return get_today() - timedelta(days=1)


def get_n_days_ago(n: int) -> datetime.date:
	"""Gets a Date object representing n days ago."""
	return get_today() - timedelta(days=n)
