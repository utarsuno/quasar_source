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

DIRECTORY_SAVE_PATH = '/home/databoi/masari_data/'


def get_price_as_int(n):
	"""Utility function."""
	return int(('{:.8f}'.format(n)).replace('0.', ''))


class BookOrdersParser(object):
	"""Utility objects to parse data raw data into C data."""

	def __init__(self, data):
		self.data                  = data
		print(data)
		print(type(data))
		self.buy_orders            = data[ORDER_TYPE_BUY]
		self.sell_orders           = data[ORDER_TYPE_SELL]
		self.number_of_buy_orders  = str(len(self.buy_orders))
		self.number_of_sell_orders = str(len(self.sell_orders))

	def log_data(self, c_process):
		"""Logs all the data to the C process."""
		self.send_data(self.buy_orders, c_process)
		self.send_data(self.sell_orders, c_process)

	def send_data(self, data, c_process):
		"""Sends the specific data to the C process."""
		# First send the amounts.
		for row in data:
			amount = row[KEY_AMOUNT]
			c_process.stdin.write(bytes('%f\n' % amount, 'utf-8'))

		# Then send the prices.
		for row in data:
			price = int(('{:.8f}'.format(row[KEY_PRICE])).replace('0.', ''))
			c_process.stdin.write(bytes('%d\n' % price, 'utf-8'))


class DataLogger(object):
	"""Logs data every minute."""

	def __init__(self):
		self.url_book_orders = 'https://www.southxchange.com/api/book/MSR/BTC'
		self.url_price       = 'https://www.southxchange.com/api/price/MSR/BTC'

		self.book_orders_parser = None
		self.last_price         = None
		self.price_variation    = None
		self.volume             = None
		self.save_path          = None
		self.c_process          = None

	def create_new_data_log(self):
		"""Creates a new data instance file."""
		self.set_save_path()

		# TODO : Add formal error handling!
		if self.get_non_book_data() and self.get_book_data():
			# Open the C process.
			self.c_process = Popen('./a.out ' + self.save_path + ' ' + str(self.book_orders_parser.number_of_buy_orders) + ' ' + str(self.book_orders_parser.number_of_sell_orders), shell=True, stdin=PIPE)

			self.c_process.stdin.write(bytes('%d\n' % self.last_price, 'utf-8'))
			self.c_process.stdin.write(bytes('%f\n' % self.price_variation, 'utf-8'))
			self.c_process.stdin.write(bytes('%f\n' % self.volume, 'utf-8'))

			self.book_orders_parser.log_data(self.c_process)

			# Close the C process.
			self.c_process.stdin.close()
			self.c_process.wait()
		else:
			print('Error!')

	def set_save_path(self):
		"""Returns the path to save the data to."""
		d = datetime.now()
		# calendar.timegm(d.utctimetuple()) returns the unix timestamp
		self.save_path = DIRECTORY_SAVE_PATH + str(calendar.timegm(d.utctimetuple()))

	def get_book_data(self):
		"""Gets the book data needed."""
		result = r.get(self.url_price)
		if result.status_code == 200:
			self.book_orders_parser = BookOrdersParser(eval(result.content.decode("utf-8")))
			return True
		else:
			return False

	def get_non_book_data(self):
		"""Gets the non-book data needed."""
		result = r.get(self.url_price)
		if result.status_code == 200:
			data = eval(result.content.decode('utf-8'))
			self.last_price      = get_price_as_int(data[KEY_LAST_PRICE])
			self.price_variation = data[KEY_VARIATION_24_HR]
			self.volume          = data[KEY_VOLUME_24_HR]
			return True
		else:
			return False


dl = DataLogger()
dl.create_new_data_log()

