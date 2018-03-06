# coding=utf-8

"""This module, book_data_logger.py, saves book data and saves it through the C program."""

import requests as r

ORDER_TYPE_SELL = 'SellOrders'
ORDER_TYPE_BUY  = 'BuyOrders'

KEY_AMOUNT      = 'Amount'
KEY_PRICE       = 'Price'
KEY_INDEX       = 'Index'


# Function from : https://stackoverflow.com/questions/38847690/convert-float-to-string-without-scientific-notation-and-false-precision/38847691
def float_to_str(f):
	"""Returns a pure string representation of the float provided."""
	float_string = repr(f)
	if 'e' in float_string:  # detect scientific notation
		digits, exp = float_string.split('e')
		digits = digits.replace('.', '').replace('-', '')
		exp = int(exp)
		zero_padding = '0' * (abs(int(exp)) - 1)  # minus 1 for decimal point in the sci notation
		sign = '-' if f < 0 else ''
		if exp > 0:
			float_string = '{}{}{}.0'.format(sign, digits, zero_padding)
		else:
			float_string = '{}0.{}{}'.format(sign, zero_padding, digits)
	return float_string


class BookOrders(object):
	"""Utility objects to parse data raw data into C data."""

	def __init__(self, order_type, data):
		self.order_type = order_type
		for row in data:
			amount = row[KEY_AMOUNT]
			price = row[KEY_PRICE]
			print(amount)
			print(type(amount))
			print(price)
			print(type(price))
			print()
			#print(str(amount) + ' {' + str(type(amount)) + '}\t' + str(price) + ' {' + str(type(price)) + '}')


result = r.get('https://www.southxchange.com/api/book/MSR/BTC')

if result.status_code == 200:
	data = eval(result.content.decode("utf-8"))

	buy_orders  = BookOrders(ORDER_TYPE_BUY,  data[ORDER_TYPE_BUY])
	#sell_orders = BookOrders(ORDER_TYPE_SELL, data[ORDER_TYPE_SELL])


else:
	print('TODO : Log an error!')

