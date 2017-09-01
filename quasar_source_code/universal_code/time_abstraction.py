# coding=utf-8

"""This module, time_abstraction.py, serves as a light abstraction to Python's datetime."""

from datetime import datetime, timedelta
from enum import Enum


class Day(Enum):
	"""Day values."""
	MONDAY    = 0
	TUESDAY   = 1
	WEDNESDAY = 2
	THURSDAY  = 3
	FRIDAY    = 4
	SATURDAY  = 5
	SUNDAY    = 6


class Month(Enum):
	"""Month values."""
	JANUARY   = (1, 31)
	FEBRUARY  = (2, (28, 29)) # 29 is for leap years.
	MARCH     = (3, 31)
	APRIL     = (4, 30)
	MAY       = (5, 31)
	JUNE      = (6, 30)
	JULY      = (7, 31)
	AUGUST    = (8, 31)
	SEPTEMBER = (9, 30)
	OCTOBER   = (10, 31)
	NOVEMBER  = (11, 30)
	DECEMBER  = (12, 31)

	@property
	def number(self):
		"""Returns the numerical representation of this month."""
		return self.value[0]

	@property
	def number_of_days(self):
		"""Returns the number of days in this month."""
		return self.value[1]


def get_day(var) -> Day:
	"""Gets the day from the variable provided. The variable can be an integer or string, if no intelligent match is found an exception is thrown."""
	# Not very elegant but good enough for now.
	if type(var) == Day:
		return Day
	elif type(var) == int:
		if 0 <= var <= 6:
			return Day(var)
		else:
			raise RuntimeError('An integer passed to \'get_day\' must fall within the range of 0-6. You provided : ' + str(var))
	elif type(var) == str:
		l = var.lower()
		if l == 'm' or l == 'mo' or l == 'mon' or l == 'mond' or l == 'monda' or l == 'monday':
			return Day(0)
		elif l == 't' or l == 'tu' or l == 'tue' or l == 'tues' or l == 'tuesd' or l == 'tuesda' or l == 'tuesday':
			return Day(1)
		elif l == 'w' or l == 'we' or l == 'wed' or l == 'wedn' or l == 'wedne' or l == 'wednes' or l == 'wednesd' or l == 'wednesda' or l == 'wednesday':
			return Day(2)
		elif l == 'r' or l == 'th' or l == 'thu' or l == 'thur' or l == 'thurs' or l == 'thursd' or l == 'thursda' or l == 'thursday':
			return Day(3)
		elif l == 'f' or l == 'fr' or l == 'fri' or l == 'frid' or l == 'frida' or l == 'friday':
			return Day(4)
		elif l == 'sa' or l == 'sat' or l == 'satu' or l == 'satur' or l == 'saturd' or l == 'saturda' or l == 'saturday':
			return Day(5)
		elif l == 'su' or l == 'sun' or l == 'sund' or l == 'sunda' or l == 'sunday':
			return Day(6)
		else:
			raise RuntimeError('No day match found for string{' + var + '}')
	else:
		raise RuntimeError('\'get_day\' does not support the provided variable type{' + str(type(var)) + '} currently only integers, strings, and enums are supported.')


def get_month(var) -> Month:
	"""Gets the month from the variable provided. The variable can be an integer or string, if not intelligent match is found an exception is thrown."""
	# Not very elegant but good enough for now.
	if type(Month):
		return var
	elif type(var) == int:
		if 1 <= var <= 12:
			return Month(var)
		else:
			raise RuntimeError('An integer passed to \'get_month\' must fall within the range of 1-12. You provided : ' + str(var))
	elif type(var) == str:
		l = var.lower()
		if l == 'ja' or l == 'jan' or l == 'janu' or l == 'janua' or l == 'januar' or l == 'january':
			return Month.JANUARY
		elif l == 'f' or l == 'fe' or l == 'feb' or l == 'febr' or l == 'febru' or l == 'februa' or l == 'februar' or l == 'february':
			return Month.FEBRUARY
		elif l == 'mar' or l == 'marc' or l == 'march':
			return Month.MARCH
		elif l == 'ap' or l == 'apr' or l == 'apri' or l == 'april':
			return Month.APRIL
		elif l == 'may':
			return Month.MAY
		elif l == 'jun' or l == 'june':
			return Month.JUNE
		elif l == 'jul' or l == 'july':
			return Month.JULY
		elif l == 'au' or l == 'aug' or l == 'augu' or l == 'augus' or l == 'august':
			return Month.AUGUST
		elif l == 's' or l == 'se' or l == 'sep' or l == 'sept' or l == 'septe' or l == 'septem' or l == 'septemb' or l == 'septembe' or l == 'september':
			return Month.SEPTEMBER
		elif l == 'o' or l == 'oc' or l == 'oct' or l == 'octo' or l == 'octob' or l == 'octob' or l == 'octobe' or l == 'october':
			return Month.OCTOBER
		elif l == 'd' or l == 'de' or l == 'dec' or l == 'dece' or l == 'decem' or l == 'decemb' or l == 'decembe' or l == 'december':
			return Month.DECEMBER
		else:
			raise RuntimeError('No month match found for string{' + var + '}')
	else:
		raise RuntimeError('\'get_month\' does not support the provided variable type{' + str(type(var)) + '} currently only integers, strings, and enums are supported.')


def get_current_day_of_the_week_number() -> int:
	"""Returns today's day as an integer."""
	return datetime.now().weekday()


def get_specific_day(year, month, day) -> datetime.date:
	"""Returns a Date object of the provided values."""
	return datetime(year=year, month=get_month(month), day=day).date()


def get_now() -> datetime:
	"""Gets the current datetime object representing right now."""
	return datetime.now()


def get_today() -> datetime.date:
	"""Gets a Date object representing today."""
	return datetime.today().date()


def get_yesterday() -> datetime.date:
	"""Gets a Date object representing yesterday."""
	return get_today() - timedelta(days=1)


def get_n_days_ago(n: int) -> datetime.date:
	"""Gets a Date object representing n days ago."""
	return get_today() - timedelta(days=n)
