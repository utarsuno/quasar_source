# coding=utf-8

"""This module, time_abstraction.py, serves as a light abstraction to Python's datetime."""

from datetime import datetime, timedelta
from enum import Enum
from typing import List
from quasar_source_code.universal_code import debugging as dbg

'''  ___                  __  
	|__  |\ | |  |  |\/| /__` 
	|___ | \| \__/  |  | .__/ 
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

	def __int__(self):
		"""int(day_obj) will return the day of week number (relative to a generic week)."""
		return self.value


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

	def __int__(self):
		"""int(month_obj) will return the month's number."""
		return self.value[0]


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
	if type(var) == Month:
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
		elif l == 'n' or l == 'no' or l == 'nov' or l == 'nove' or l == 'novem' or l == 'novemb' or l == 'novembe' or l == 'november':
			return Month.NOVEMBER
		elif l == 'd' or l == 'de' or l == 'dec' or l == 'dece' or l == 'decem' or l == 'decemb' or l == 'decembe' or l == 'december':
			return Month.DECEMBER
		else:
			raise RuntimeError('No month match found for string{' + var + '}')
	else:
		raise RuntimeError('\'get_month\' does not support the provided variable type{' + str(type(var)) + '} currently only integers, strings, and enums are supported.')


def get_current_day_of_the_week_number() -> int:
	"""Returns today's day as an integer."""
	return datetime.now().weekday()


def get_day_of_the_week_number_from_datetime(datetime_obj) -> int:
	"""Does what the function title states."""
	return datetime_obj.weekday()


def get_specific_day(year, month, day) -> datetime.date:
	"""Returns a Date object of the provided values."""
	if type(month) == int:
		return datetime(year=year, month=month, day=day).date()
	else:
		return datetime(year=year, month=get_month(month).number, day=day).date()


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


def zero_front_padding(n):
	if len(str(n)) == 1:
		return '0' + str(n)
	else:
		return str(n)


def zero_back_padding(n):
	if len(str(n)) == 1:
		return str(n) + '0'
	else:
		return str(n)


def is_relevant_for_today(self) -> bool:
	"""Returns a boolean indicating if today's date falls within this time blocks range."""
	start_day = self._generic_day_time_start.day
	end_day   = self._generic_day_time_start.day
	if start_day < end_day:
		if start_day <= get_current_day_of_the_week_number() <= end_day:
			return True
	elif end_day < start_day:
		if end_day <= get_current_day_of_the_week_number() <= start_day:
			return True
	else:
		if start_day == end_day == get_current_day_of_the_week_number():
			return True
	return False

'''  __             __   __   ___  __
	/  ` |     /\  /__` /__` |__  /__`
	\__, |___ /~~\ .__/ .__/ |___ .__/
'''


class TimeValues(object):
	"""Handles the math for time operations."""

	def __init__(self, minutes=0, hours=0, days=0, years=0):
		self._minutes = minutes
		self._hours   = hours
		self._days    = days
		self._years   = years
		self._check_numbers()

	def _check_numbers(self):
		"""Ensures the values are properly set."""
		if type(self._minutes) != str:
			dbg.raise_type_exception(method_name='check_numbers', expected_type=str, val=self._minutes)
		if type(self._hours) != str:
			dbg.raise_type_exception(method_name='check_numbers', expected_type=str, val=self._hours)
		if type(self._days) != str:
			dbg.raise_type_exception(method_name='check_numbers', expected_type=str, val=self._days)
		# Positive minute.
		if self._minutes >= 60:
			self._hours += self._minutes // 60
			self._minutes %= 60
		# Negative minute.
		if self._minutes <= -60:
			self._hours += (abs(self._minutes) // 60) * -1
			self._minutes = (abs(self._minutes) % 60) * -1
		# Positive hours.
		if self._hours >= 24:
			self._days += self._hours // 24
			self._hours %= 24
		# Negative hours.
		if self._hours <= -24:
			self._days += (abs(self._hours) // 24) * -1
			self._hours = (abs(self._hours) % 24) * -1
		# Positive days.
		if self._days >= 365:
			self._years += self._days // 365
			self._years %= 365
		# Negative days.
		

	def __add__(self, other):
		return TimeValues()


class Duration(object):
	"""Represents an X duration of time in Y units."""

	def __init__(self, minutes=0, hours=0, days=0):
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

	def __add__(self, other):
		self._minutes += other.minutes
		self._hours   += other.hours
		self._days    += other.days
		return Duration(self._minutes + other.minutes)

	def __repr__(self):
		return 'Duration(minutes=' + str(self.minutes) + ', hours=' + str(self.hours) + ', days=' + str(self.days) + ')'


class TimeInstance(object):
	"""Represents a particular singular instance of time."""




# OLDER BELOW
# OLDER BELOW
# OLDER BELOW

class GenericDayTime(object):
	"""Representation of possible dates without being attached to specific values."""

	def __init__(self, day, hour, minute, duration_offset=None):
		self._day    = int(day)
		self._hour   = int(hour)
		self._minute = int(minute)
		if duration_offset is None:
			self._duration_offset = Duration()
		else:
			self._duration_offset = duration_offset

	def __add__(self, other):
		if type(other) == GenericDayTime:
			return GenericDayTime(self._day, self._hour, self._minute, self._duration_offset + other.duration_offset)
		elif type(other) == Duration:
			return GenericDayTime(self._day, self._hour, self._minute, self._duration_offset + other)

		# Assumes type other is a Duration object.
		'''
		minute_total = self._minute + other.minutes
		hour_total   = self._hour + other.hours
		day_total    = self._day + other.days
		if minute_total >= 60:
			hour_total += minute_total // 60
			minute_total %= 60
		if hour_total >= 24:
			day_total += hour_total // 24
			hour_total %= 24
		self._minute = minute_total
		self._hour   = hour_total
		self._day    = day_total
		'''

	def get_day_name(self):
		"""Gets the name of this day."""
		d = Day((self._day + self._duration_offset.days) % 7)
		return d.name

	def get_time_str_without_day(self) -> str:
		"""Returns this generic day time as string without the day1 field attached."""
		return zero_front_padding(self.hour) + ':' + zero_back_padding(self.minute)

	def get_time_str_with_day(self) -> str:
		"""Returns this generic day time as string."""
		return Day(self._day).name + '[' + self.get_time_str_without_day() + ']'

	@property
	def duration_offset(self):
		"""Returns the duration offset of this GenericDayTime object."""
		return self._duration_offset

	@property
	def day(self) -> int:
		"""Returns the integer representation of this generic day time's day."""
		return self._day + self._duration_offset.days

	@property
	def hour(self) -> int:
		"""Returns the integer representation of this generic day time's hour."""
		return self._hour + self._duration_offset.hours

	@property
	def minute(self) -> int:
		"""Returns the integer representation of this generic day time's minute."""
		return self._minute + self._duration_offset.minutes

	def __str__(self):
		return 'GenericDayTime(day=' + str(self.day) + ', hour=' + str(self.hour) + ', minute=' + str(self.minute) + ')'


class DateRange(object):
	"""Represents a range of dates between two dates."""

	def __init__(self, generic_day_time_start, generic_day_time_end_or_duration):
		self._generic_day_time_start = generic_day_time_start
		print('Generic Day Time Start : ' + str(self._generic_day_time_start))

		if type(generic_day_time_end_or_duration) == Duration:
			self._generic_day_time_end = self._generic_day_time_start + generic_day_time_end_or_duration
		elif type(generic_day_time_end_or_duration) == GenericDayTime:
			self._generic_day_time_end = generic_day_time_end_or_duration
		else:
			dbg.raise_type_exception('DateRange', 'GenericDateTime or Duration object', generic_day_time_end_or_duration)
		print('Generic Day Time Start : ' + str(self._generic_day_time_start))
		print('Generic Day Time End : ' + str(self._generic_day_time_end))
		print()

	@property
	def start_time(self) -> str:
		"""Returns a string representation of the start time."""
		return self._generic_day_time_start.get_time_str_without_day()

	@property
	def end_time(self) -> str:
		"""Returns a string representation of the end time."""
		return self._generic_day_time_end.get_time_str_without_day()

	def is_relevant_for_today(self) -> bool:
		"""Returns a boolean indicating if today's date falls within this time blocks range."""
		start_day = self._generic_day_time_start.day
		end_day   = self._generic_day_time_start.day
		if start_day < end_day:
			if start_day <= get_current_day_of_the_week_number() <= end_day:
				return True
		elif end_day < start_day:
			if end_day <= get_current_day_of_the_week_number() <= start_day:
				return True
		else:
			if start_day == end_day == get_current_day_of_the_week_number():
				return True
		return False

	def __str__(self):
		# TODO : Code for day offsets.
		if self._generic_day_time_start.day == self._generic_day_time_end.day:
			return Day(self._generic_day_time_start.day).name + '[' + self._generic_day_time_start.get_time_str_without_day() + ' - ' + self._generic_day_time_end.get_time_str_without_day() + ']'
		else:
			return self._generic_day_time_start.get_time_str_with_day() + ' -- ' + self._generic_day_time_end.get_time_str_with_day()
