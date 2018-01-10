# coding=utf-8

"""This module, binance_api.py, defines an API for accessing Binance cryptocurrency information."""

import requests as r
from universal_code import path_manager as pm
import datetime
from universal_code import useful_file_operations as ufo
from hashlib import sha1
import hmac
from universal_code import debugging as dbg
import base64
import hashlib
from servers import utility_servers as us
import time
import logging


# Base from : https://stackoverflow.com/questions/5998245/get-current-time-in-milliseconds-in-python/14978116
def get_current_time_in_milliseconds():
	"""Utility function to get the current """
	return int(round(time.time() * 1000))

# Utility variables.
UTF_8 = 'utf-8'
_URL_API = 'https://api.binance.com'
_URL_GET_ACCOUNT_INFORMATION = '/api/v3/account'
_URL_GET_ACCOUNT_TRADES      = '/api/v3/myTrades'
_URL_POST_CONNECT            = '/api/v1/userDataStream'

POST_KEY_LISTEN    = 'listenKey'
POST_KEY_RECEIVE_WINDOW = 'recvWindow'
POST_KEY_SIGNATURE = 'signature'
POST_KEY_TIMESTAMP = 'timestamp'
POST_KEY_SYMBOL    = 'symbol'


#Utility class.
class POSTKey(object):
	"""Represents a single unique POST key."""
	def __init__(self, key, value):
		self.key = key
		self.value = value

	@property
	def json(self):
		"""Returns a json format of this POST key data."""
		return {self.key: self.value}

	def to_tuple(self):
		"""Returns a tuple format of this POST key data."""
		return ((self.key, self.value),)


class BinancePOST(object):
	"""Represent a unique POST that is able to made against Binance."""
	def __init__(self, url, secret_key):
		self._url = url
		self._secret_key = secret_key
		self.args = {}
		self.is_post = True
		if self._url == _URL_GET_ACCOUNT_TRADES or self._url == _URL_GET_ACCOUNT_INFORMATION:
			self.is_post = False

	@property
	def full_url(self) -> str:
		"""Returns the full URL of this BinancePost."""
		return _URL_API + self.url

	@property
	def url(self) -> str:
		"""Returns just the unique portion of this URL."""
		return self._url

	def add_parameter(self, key, value=None):
		"""Adds a key and value to be sent as a parameter."""
		if key == POST_KEY_SIGNATURE:
			# Base code from : https://www.jokecamp.com/blog/examples-of-creating-base64-hashes-using-hmac-sha256-in-different-languages/
			message = self.get_query_string().encode('utf-8')
			#message = bytes(self.get_query_string(), UTF_8)
			secret = self._secret_key.encode('utf-8')
			#secret = bytes(self._secret_key, UTF_8)
			#self.args[key] = base64.b64encode(hmac.new(secret, message, digestmod=hashlib.sha256).digest()).decode('UTF-8')
			self.args[key] = hmac.new(secret, message, hashlib.sha256).hexdigest()
			#self.args[key] = hmac.new(secret, message, digestmod=hashlib.sha256).digest()
		elif key == POST_KEY_TIMESTAMP:
			self.args[key] = get_current_time_in_milliseconds()
		else:
			self.args[key] = value

	def get_query_string(self):
		"""Returns the query string of this BinancePost."""
		query_string = ''
		number_of_added_args = 0

		keys_list = []
		for a in self.args:
			if a != POST_KEY_SIGNATURE:
				keys_list.append(a)

		keys_list = reversed(keys_list)

		for key in keys_list:
			number_of_added_args += 1
			query_string += key + '=' + str(self.args[key]) + '&'
		if number_of_added_args > 0:
			query_string = query_string[:-1]

		return query_string

	def get_ordered_arguments_as_tuple(self):
		"""Returns a tuple containing all the arguments in a specified order."""
		arguments = []
		require_signature = False
		for a in self.args:
			if a == POST_KEY_SIGNATURE:
				require_signature = True
			else:
				arguments.append(POSTKey(a, self.args[a]))

		# Sort the list of arguments in place. From : https://stackoverflow.com/questions/403421/how-to-sort-a-list-of-objects-based-on-an-attribute-of-the-objects
		arguments.sort(key=lambda x: x.key, reverse=False)

		args_as_tuple = ()
		for a in arguments:
			t = a.to_tuple()
			args_as_tuple += t

		if require_signature:
			args_as_tuple += ((POST_KEY_SIGNATURE, self.args[POST_KEY_SIGNATURE]),)

		return args_as_tuple

	def __str__(self):
		return self.url + '\t' + str(self.get_query_string()) + '\t' + str(self.args)


class BinanceAPI(object):
	"""API for using obtaining crypto data."""

	SESSION_HEADER_0_KEY    = 'Accept'
	SESSION_HEADER_1_KEY    = 'User-Agent'
	SESSION_HEADER_1_VALUE  = 'binance/python'
	SESSION_HEADER_2_KEY    = 'X-MBX-APIKEY'

	_INI_SECTION_NAME       = 'binance_api'
	_INI_KEY_API            = 'api_key'
	_INI_KEY_SECRET_API     = 'secret_key'

	def __init__(self):
		self._data_dictionary = ufo.get_ini_section_dictionary(path=pm.get_config_ini(), section_name=BinanceAPI._INI_SECTION_NAME)
		self._api_key    = self._data_dictionary[BinanceAPI._INI_KEY_API]
		self._secret_key = self._data_dictionary[BinanceAPI._INI_KEY_SECRET_API]
		self._session    = None
		self._listen_key = None

		#logging.basicConfig(level=logging.DEBUG)

		self._POST_connect = BinancePOST(_URL_POST_CONNECT, self._secret_key)

	def connect(self):
		"""Creates a session."""
		self._session = r.Session()
		self._session.headers.update({BinanceAPI.SESSION_HEADER_0_KEY: 'application/json',
		                              BinanceAPI.SESSION_HEADER_2_KEY: self._api_key,
		                              BinanceAPI.SESSION_HEADER_1_KEY: BinanceAPI.SESSION_HEADER_1_VALUE})

		self._listen_key = self.run_POST(self._POST_connect)
		if self._listen_key.status_code == us.HTTP_SUCCESS:
			self._listen_key = eval(self._listen_key.text)[POST_KEY_LISTEN]
		else:
			dbg.raise_exception('Failed to obtain listen key!')

	def _eval_response(self, raw_data):
		"""Converts the server reply into a Python data type."""
		if type(raw_data) != str:
			dbg.raise_exception('A non string was passed to _eval_response {' + str(raw_data))

		raw_data = raw_data.replace('true', 'True').replace('false', 'False')
		return eval(raw_data)

	def get_account_information(self):
		"""Returns information on this account."""
		bp = BinancePOST(_URL_GET_ACCOUNT_INFORMATION, self._secret_key)
		result = self.run_POST(bp)
		if result.status_code == us.HTTP_SUCCESS:
			data = self._eval_response(result.text)
			return data
		return result

	def get_account_trades(self):
		"""Returns all trades made by this account."""
		bp = BinancePOST(_URL_GET_ACCOUNT_TRADES, self._secret_key)
		result = self.run_POST(bp)
		if result.status_code == us.HTTP_SUCCESS:
			d = self._eval_response(result.text)
			return d
		print('Get account trades failed! : {' + result.text + '}')
		return result

	def run_POST(self, binance_post):
		"""Runs the provided POST method."""

		if binance_post.url == _URL_GET_ACCOUNT_INFORMATION:
			binance_post.add_parameter(POST_KEY_TIMESTAMP)
			binance_post.add_parameter(POST_KEY_SIGNATURE)
		elif binance_post.url == _URL_GET_ACCOUNT_TRADES:
			binance_post.add_parameter(POST_KEY_SYMBOL, 'IOTABTC')
			binance_post.add_parameter(POST_KEY_RECEIVE_WINDOW, 6000000)
			binance_post.add_parameter(POST_KEY_TIMESTAMP)
			binance_post.add_parameter(POST_KEY_SIGNATURE)


		#if binance_post.is_post:
		#	self._session.headers.update({BinanceAPI.SESSION_HEADER_0_KEY: 'application/x-www-form-urlencoded'})
		#else:
		#	self._session.headers.update({BinanceAPI.SESSION_HEADER_0_KEY: 'application/json'})

		#print('Making a call on : {' + str(binance_post) + '}')

		if len(binance_post.args) > 0:

			#print(binance_post.get_ordered_arguments_as_tuple())

			if binance_post.is_post:

				#print(binance_post.full_url)
				#print(binance_post.get_ordered_arguments_as_tuple())

				response = self._session.post(binance_post.full_url, params=binance_post.get_ordered_arguments_as_tuple())
			else:
				response = self._session.get(binance_post.full_url, params=binance_post.get_ordered_arguments_as_tuple())


			#print(response.url)
			#print(response.headers)

		else:
			if binance_post.is_post:
				response = self._session.post(binance_post.full_url)
			else:
				response = self._session.get(binance_post.full_url)
		return response

api = BinanceAPI()
api.connect()

#r = api.get_account_information()

#api.get_test()

#trades = api.run_POST(API_GET_ACCOUNT_TRADES, {'symbol': 'IOTABTC'})


trades = api.get_account_trades()

for t in trades:
	print(t)

#print(trades)