# coding=utf-8

"""This module, test_network.py, is a quick test file."""

from finance.data_related import finance_database as fdb
from finance.data_related import data_scraper as ds

db = fdb.FinanceDatabase()

all_data = db.get_all_day_data_for(ds.CRYPTO_CURRENCY_IOTA)


for d in all_data:
	print(d)

