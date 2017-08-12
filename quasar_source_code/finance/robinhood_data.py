# coding=utf-8

"""This module, robinhood_data.py, utilizes a 3rd party un-official Robinhood API."""

# Robinhood API.
from third_party_libraries.Robinhood.Robinhood.Robinhood import Robinhood
# Useful file + directory operations.
from quasar_source_code.universal_code import useful_file_operations as ufo
# Contains useful paths for this project.
from quasar_source_code.universal_code import path_manager as pm


robinhood_scraper = Robinhood()
account           = ufo.get_ini_section_dictionary(path=pm.get_config_ini(), section_name='robinhood')
robinhood_scraper.login(username=account['username'], password=account['password'])

past_orders = get_all_history_orders(rb)
instruments_db = shelve.open('instruments.db')
orders = [order_item_info(order, rb, instruments_db) for order in past_orders]
keys = ['side', 'symbol', 'shares', 'price', 'date', 'state']





