# coding=utf-8

"""This module, book_data_logger.py, saves book data and saves it through the C program."""

import requests as r


result = r.get('https://www.southxchange.com/api/book/MSR/BTC')

print(result)
