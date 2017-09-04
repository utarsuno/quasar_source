# coding=utf-8

"""This module, time_abstraction.py, serves as a light abstraction to Python's datetime."""

from datetime import datetime, timedelta
from enum import Enum
from typing import List
from quasar_source_code.universal_code import debugging as dbg
''' __             __   __   ___  __
	/  ` |     /\  /__` /__` |__  /__`
	\__, |___ /~~\ .__/ .__/ |___ .__/
'''


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

class GenericDayTime(object):
	"""Representation of possible dates without being attached to specific values."""

	def __init__(self, day, hour, minute):
		self._day    = int(day)
		self._hour   = int(hour)
		self._minute = int(minute)

		# The final time of this generic day time is the 3 time fields added with the minute offset.
		# Any movement pass 24 hours in either direction allows for time roll-overs where the final output is a specific time + number of days offset.
		self._minute_offset = None

	def __add__(self, other):
		# Assumes type other is a Duration object.
		self.minute_total = self._minute + other.minutes
		self.hour_total   = self._hour + other.hours
		self.day_total    = self._day + other.days
		if self.minute_total >= 60:


	@property
	def day(self) -> int:
		"""Returns the integer representation of this generic day time's day."""
		return self._day

	@property
	def hour(self) -> int:
		"""Returns the integer representation of this generic day time's hour."""
		return self._hour

	@property
	def minute(self) -> int:
		"""Returns the integer representation of this generic day time's minute."""
		return self._minute

class Duration(object):
	"""Represents an X duration of time in Y units."""

	def __init__(self, minutes, hours, days):
		self._minutes = minutes
		self._hours   = hours
		self._days    = days

	@property
	def days(self) -> int:
		"""Returns the integer representation of this duration's number of days."""
		return self._days

	@property
	def hours(self) -> int:
		"""Returns the integer representation of this duration's number of hours."""
		return self._hours

	@property
	def minutes(self) -> int:
		"""Returns the integer representation of this duration's number of minutes."""
		return self._minutes


class DateRange(object):
	"""Represents a range of dates between two dates."""

	def __init__(self, generic_day_time_start, generic_day_time_end_or_duration):
		self._generic_day_time_start = generic_day_time_start
		if type(generic_day_time_end_or_duration) == Duration:
			self._duration             = generic_day_time_end_or_duration
			self._generic_day_time_end = None
		elif type(generic_day_time_end_or_duration) == GenericDayTime:
			self._generic_day_time_end = generic_day_time_end_or_duration
			self._duration             = None
		else:
			dbg.raise_type_exception('DateRange', 'GenericDateTime or Duration object', generic_day_time_end_or_duration)

	def _zero_front_padding(self, n):
		if len(str(n)) == 1:
			return '0' + str(n)
		else:
			return str(n)

	def _zero_back_padding(self, n):
		if len(str(n)) == 1:
			return str(n) + '0'
		else:
			return str(n)

	@property
	def start_time(self) -> str:
		"""Returns a string representation of the start time."""
		return self._zero_front_padding(self._generic_day_time_start.hour) + ':' + self._zero_back_padding(self._generic_day_time_start.minute)

	@property
	def end_time(self) -> str:
		"""Returns a string representation of the end time."""
		if self._duration is None:
			self._zero_front_padding(self._generic_day_time_end.hour) + ':' + self._zero_back_padding(self._generic_day_time_end.minute)
		else:


class TimeBlock(object):
	"""Represents a block of time with a state and end time."""

	def __init__(self, start_generic_date: DateRange, end_generic_date_or_duration):
		self._start_generic_date = start_generic_date
		if self._end
		self._end_generic_date   = end_generic_date

	def __init__(self, x):
		self._start_day    =
		self._end_day      = end_day
		self._end_hour     = end_hour
		self._end_minute   = end_minute

		self.parent_entity = None

	@property
	def end_time(self) -> str:
		"""Returns the end time as a human readable string."""
		return self._zero_front_padding(self._end_hour) + ':' + self._zero_back_padding(self._end_minute)

	def __str__(self):
		if self._start_day == self._end_day:
			return self._start_day.name + '[' + self.start_time + ' - ' + self.end_time + '] for super entity : ' + self.parent_entity.name
		else:
			return self._start_day.name + '[' + self.start_time + '] to ' + self._end_day.name + '[' + self.end_time + '] for super entity : ' + self.parent_entity.name

	def is_relevant_for_today(self) -> bool:
		"""Returns a boolean indicating if today's date falls within this time blocks range."""
		start_day = self._start_day.value
		end_day   = self._end_day.value
		if start_day < end_day:
			if start_day <= ta.get_current_day_of_the_week_number() <= end_day:
				return True
		elif end_day < start_day:
			if end_day <= ta.get_current_day_of_the_week_number() <= start_day:
				return True
		else:
			if start_day == end_day == ta.get_current_day_of_the_week_number():
				return True
		return False

	def is_relevant_for_now(self) -> bool:
		"""Returns a boolean indicating if the current time falls within this time blocks range."""
		y = 2
		# TODO :

	# TODO : is relevant for datetime object

	def set_start(self, day: ta.Day, hour: int, minute: int):
		"""Sets all the start attributes for this TimeBlock."""
		self._start_day    = day
		self._start_hour   = hour
		self._start_minute = minute

	def set_end(self, day: ta.Day, hour: int, minute: int):
		"""Sets all the end attributes for this TimeBlock."""
		self._end_day    = day
		self._end_hour   = hour
		self._end_minute = minute

	def set_start_day(self, day: ta.Day):
		"""Sets the start day for this time block."""
		self._start_day = day

	def set_end_day(self, day: ta.Day):
		"""Sets the end day for this time block."""
		self._end_day = day

	def set_start_time(self, start_time: str):
		"""Sets the start time for this block of time."""
		self._start_hour   = int(start_time.split(':')[0])
		self._start_minute = int(start_time.split(':')[1])

	def set_end_time(self, end_time: str):
		"""Sets the end time for this block of time."""
		self._end_hour   = int(end_time.split(':')[0])
		self._end_minute = int(end_time.split(':')[1])

'''
class DateRange(object)

'''
'''  ___            __  ___    __        __
	|__  |  | |\ | /  `  |  | /  \ |\ | /__`
	|    \__/ | \| \__,  |  | \__/ | \| .__/
'''


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
