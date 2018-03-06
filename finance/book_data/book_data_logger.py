# coding=utf-8

"""This module, book_data_logger.py, saves book data and saves it through the C program."""

import requests as r

from datetime import datetime
import calendar

from subprocess import Popen, PIPE

d = datetime.now()
unixtime = calendar.timegm(d.utctimetuple())
print(unixtime)


ORDER_TYPE_SELL = 'SellOrders'
ORDER_TYPE_BUY  = 'BuyOrders'

KEY_AMOUNT      = 'Amount'
KEY_PRICE       = 'Price'
KEY_INDEX       = 'Index'


class BookOrders(object):
	"""Utility objects to parse data raw data into C data."""

	def __init__(self, order_type, data):
		self.order_type = order_type
		self.number_of_rows = len(data)
		for row in data:
			amount = row[KEY_AMOUNT]
			price = int(('{:.8f}'.format(row[KEY_PRICE])).replace('0.', ''))

		c_process = Popen


result = r.get('https://www.southxchange.com/api/book/MSR/BTC')

if result.status_code == 200:
	data = eval(result.content.decode("utf-8"))

	buy_orders  = BookOrders(ORDER_TYPE_BUY,  data[ORDER_TYPE_BUY])
	#sell_orders = BookOrders(ORDER_TYPE_SELL, data[ORDER_TYPE_SELL])


else:
	print('TODO : Log an error!')

