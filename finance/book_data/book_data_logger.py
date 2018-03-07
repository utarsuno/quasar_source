# coding=utf-8

"""This module, book_data_logger.py, saves book data and saves it through the C program."""

import requests as r

from datetime import datetime
import calendar

from subprocess import Popen, PIPE

#define BOOK_TYPE_BUY_ORDERS  2
#define BOOK_TYPE_SELL_ORDERS 3

ORDER_TYPE_SELL = 'SellOrders'
ORDER_TYPE_BUY  = 'BuyOrders'

KEY_AMOUNT          = 'Amount'
KEY_PRICE           = 'Price'
KEY_INDEX           = 'Index'
KEY_LAST_PRICE      = 'Last'
KEY_VARIATION_24_HR = 'Variation24Hr'
KEY_VOLUME_24_HR    = 'Volume24Hr'

DIRECTORY_SAVE_PATH = '/home/databoi/book_orders/'


class BookOrdersLogger(object):
	"""Utility objects to parse data raw data into C data."""

	def __init__(self, data):
		self.buy_orders  = data[ORDER_TYPE_BUY]
		self.sell_orders = data[ORDER_TYPE_SELL]
		self.number_of_buy_orders = str(len(self.buy_orders))
		self.number_of_sell_orders = str(len(self.sell_orders))

		self.c_process = Popen('./a.out ' + self.get_save_path() + ' ' + str(self.number_of_buy_orders) + ' ' + str(self.number_of_sell_orders), shell=True, stdin=PIPE)

		self.send_data(self.buy_orders)

		for row in data:
			amount = row[KEY_AMOUNT]
			price = int(('{:.8f}'.format(row[KEY_PRICE])).replace('0.', ''))

			self.c_process.stdin.write(bytes('%f\n' % amount, 'utf-8'))
		self.c_process.stdin.close()
		self.c_process.wait()

		#c_process = Popen('a.out', stdin=PIPE, stdout=PIPE)
		#out, err = c_process.communicate()

	def send_data(self, data):
		"""Sends the data to the C process."""
		# First send the amounts.
		for row in data:
			amount = row[KEY_AMOUNT]
			self.c_process.stdin.write(bytes('%f\n' % amount, 'utf-8'))

		# Then send the prices.
		for row in data:
			price = int(('{:.8f}'.format(row[KEY_PRICE])).replace('0.', ''))
			self.c_process.stdin.write(bytes('%d\n' % price, 'utf-8'))

	def get_save_path(self):
		"""Returns the path to save the data to."""
		d = datetime.now()
		# calendar.timegm(d.utctimetuple()) returns the unix timestamp
		return DIRECTORY_SAVE_PATH + str(calendar.timegm(d.utctimetuple()))


class DataLogger(object):
	"""Logs data every minute."""

	def __init__(self):
		self.url_book_orders = 'https://www.southxchange.com/api/book/MSR/BTC'
		self.url_price       = 'https://www.southxchange.com/api/price/MSR/BTC'

		self.get_non_book_data()
		# TODO : Add error handling!

	def create_new_data_log(self):
		"""Creates a new data instance file."""

	def get_non_book_data(self):
		"""Gets the non-book data needed."""
		result = r.get(self.url_price)
		if result.status_code == 200:
			data = eval(result.content.decode("utf-8"))
			print(data)
		else:
			return False

'''
result = r.get('https://www.southxchange.com/api/book/MSR/BTC')

if result.status_code == 200:
	data = eval(result.content.decode("utf-8"))

	book_orders_logger = BookOrdersLogger(data)


else:
	print('TODO : Log an error!')
'''



# TODOS : Organize this file
# TODOS : Create data loader
# TODOS :





# https://www.southxchange.com/api/price/MSR/BTC


dl = DataLogger()