# coding=utf-8

"""This module, book_data_logger.py, saves book data and saves it through the C program."""

import requests as r


result = r.get('https://www.southxchange.com/api/book/MSR/BTC')

if result.status_code == 200:
	data = result.content.decode("utf-8")
	print(data)
	print()
	data = eval(data)
	print(data)
	print(type(data))
else:
	print('TODO : Log an error!')
