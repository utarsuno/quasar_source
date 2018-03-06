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

	for i in data[ORDER_TYPE_BUY]:
		print(i)
		amount = data[ORDER_TYPE_BUY][KEY_AMOUNT]
		print(str(amount) + '\t' + type(amount))
		price = data[ORDER_TYPE_BUY][KEY_AMOUNT]
		print(str(price) + '\t' + type(price))

else:
	print('TODO : Log an error!')
