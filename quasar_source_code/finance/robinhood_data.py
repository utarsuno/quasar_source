# coding=utf-8

"""This module, robinhood_data.py, utilizes a 3rd party un-official Robinhood API."""

from third_party_libraries.Robinhood.Robinhood.Robinhood import Robinhood

robinhood_scraper = Robinhood()
robinhood_scraper.login()




