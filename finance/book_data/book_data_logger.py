# coding=utf-8

"""This module, book_data_logger.py, saves book data and saves it through the C program."""

import requests as r

ORDER_TYPE_SELL = 'SellOrders'
ORDER_TYPE_BUY  = 'BuyOrders'

KEY_AMOUNT      = 'Amount'
KEY_PRICE       = 'Price'
KEY_INDEX       = 'Index'


result = r.get('https://www.southxchange.com/api/book/MSR/BTC')

if result.status_code == 200:
	data = eval(result.content.decode("utf-8"))

	for row in data[ORDER_TYPE_BUY]:
		amount = row[KEY_AMOUNT]
		price  = row[KEY_PRICE]
		print(str(amount) + ' {' + str(type(amount)) + '}\t' + str(price) + ' {' + str(type(price)) + '}')

else:
	print('TODO : Log an error!')
