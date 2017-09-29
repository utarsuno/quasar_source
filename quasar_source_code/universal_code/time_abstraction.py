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
	EVERYDAY  = -2

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
	def number(self) -> int:
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
	print('GET DAY OF THE WEEK NUMBER : ' + str(datetime_obj) + '\t' + str(datetime_obj.weekday()))
	"""Does what the function title states."""
	return datetime_obj.weekday()


def get_specific_day(year, month, day) -> datetime.date:
	"""Returns a Date object of the provided values."""
	if type(month) == int:
		return datetime(year=year, month=month, day=day).date()
	else:
		return datetime(year=year, month=get_month(month).number, day=day).date()


def get_day_object_from_current_weeks_day(day: Day):
	"""Returns a Date object that's the date of the day of this week that the Day is."""
	today = get_today()
	offset = get_current_day_of_the_week_number()
	if offset == int(day):
		return today
	elif offset > int(day):
		return today - timedelta(days=offset - int(day))
	else:
		return today + timedelta(days=int(day) - offset)


def get_specific_daytime(year, month, day, hour, minute) -> datetime:
	"""Returns a Datetime object of the provided values."""
	if type(month) == Month:
		m = month.number
	else:
		m = month
	if type(day) == Day:
		d = day.number
	else:
		d = day
	return datetime(year=year, month=m, day=d, hour=hour, minute=minute)


def get_datetime_with_duration_offset(datetime_obj, duration_obj) -> datetime:
	"""Returns a datetime object that has the duration object offset applied to it."""
	return datetime_obj + timedelta(hours=duration_obj.time_values.hours, minutes=duration_obj.time_values.minutes, days=duration_obj.time_values.days)


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

	@property
	def minute(self) -> int:
		"""Returns the minute value. Sames as 'minutes' but both versions are there to help with code flow."""
		return self._minutes

	@property
	def minutes(self) -> int:
		"""Returns the minutes value. Same as 'minute' but both versions are there to help with code flow."""
		return self._minutes

	@property
	def hour(self) -> int:
		"""Returns the hour value. Same as 'hours' but both versions are there to help with code flow."""
		return self._hours

	@property
	def hours(self) -> int:
		"""Returns the hours value. Same as 'hour' but both versions are there to help with code flow."""
		return self._hours

	@property
	def day(self) -> int:
		"""Returns the day value. Same as 'days' but both versions are there to help with code flow."""
		return self._days

	@property
	def days(self) -> int:
		"""Returns the days value. Same as 'day' but both versions are there to help with code flow."""
		return self._days

	def _check_numbers(self):
		"""Ensures the values are properly set."""
		if type(self._minutes) != int:
			dbg.raise_type_exception(method_name='check_numbers', expected_type=int, val=self._minutes)
		if type(self._hours) != int:
			dbg.raise_type_exception(method_name='check_numbers', expected_type=int, val=self._hours)
		if type(self._days) != int:
			dbg.raise_type_exception(method_name='check_numbers', expected_type=int, val=self._days)
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
		if self._days <= -354:
			self._years += (abs(self._days) // 365) * -1
			self._days = (abs(self._days) % 365) * -1

	def __add__(self, other):
		return TimeValues(minutes=self._minutes + other.minutes, hours=self._hours + other.hours, days=self._days + other.days)

	def __repr__(self):
		return 'TimeValues(minutes=' + str(self._minutes) + ', hours=' + str(self._hours) + ', days=' + str(self._days) + ')'


class Duration(object):
	"""Represents an X duration of time in Y units."""

	def __init__(self, minutes=0, hours=0, days=0):
		self.time_values = TimeValues(minutes=minutes, hours=hours, days=days)

	def __add__(self, other):
		tv = TimeValues(minutes=self.time_values.minutes + other.time_values.minutes,
		                hours=self.time_values.hours + other.time_values.hours,
		                days=self.time_values.days + other.time_values.days)
		return Duration(minutes=tv.minutes, hours=tv.hours, days=tv.days)

	def __repr__(self):
		return 'Duration(minutes=' + str(self.time_values.minutes) + ', hours=' + str(self.time_values.hours) + ', days=' + str(self.time_values.days) + ')'


class Weekday(object):
	"""Represents a specific time for a day in the week."""

	def __init__(self, day_of_the_week, hour, minute, all_day_event=False):
		if type(day_of_the_week) == Day:
			self._day_of_the_week = int(day_of_the_week)
		else:
			self._day_of_the_week = day_of_the_week
		self._hour            = hour
		self._minute          = minute
		self._number_of_days_offset = 0
		self._all_day_event   = all_day_event

	@property
	def day_of_the_week(self) -> int:
		"""Returns the day of the week that is Weekday is representing."""
		return self._day_of_the_week

	def __add__(self, other: Duration):
		tv = TimeValues(minutes=self._minute + other.time_values.minute, hours=self._hour + other.time_values.hours, days=other.time_values.days)
		if abs(tv.days) >= 7:
			# TODO : Eventually add this functionality in through the use of the '_number_of_days_offset' variable.
			raise RuntimeError('A weekday object can\'t be more than 6 days ahead or behind in days.')
		day_of_week = Day(self._day_of_the_week + tv.days).value
		return Weekday(day_of_the_week=day_of_week, hour=tv.hour, minute=tv.minute)

	def __repr__(self):
		return 'Weekday(day_of_the_week=' + str(self._day_of_the_week) + ', hour=' + str(self._hour) + ', minute=' + str(self._minute) + ', all_day_event=' + str(self._all_day_event) + ')'


class TimeRange(object):
	"""Represents a start and stop time range."""

	def __init__(self, object_one, object_two):
		datetime_string = "<class 'datetime.date'>"
		if str(type(object_one)) == datetime_string and str(type(object_two)) == datetime_string:
			self._start_date = object_one
			self._end_date   = object_two
		elif type(object_one) == Weekday and type(object_two) == Weekday:
			self._weekday_start = object_one
			self._weekday_end   = object_two
		elif type(object_one) == Weekday and type(object_two) == Duration:
			self._weekday_start = object_one
			self._weekday_end   = object_one + object_two
		elif type(object_one) == datetime and type(object_two) == Duration:
			self._start_date = object_one
			self._end_date = get_datetime_with_duration_offset(datetime_obj=object_one, duration_obj=object_two)
		else:
			raise RuntimeError('TimeRange only accepts one of the following {2 datetime objs, 2 weekday objs, weekday start obj + duration obj}. You passed in the following types : {' + str(type(object_one)) + ', ' + str(type(object_two)) + '}.')

	def is_date_within_range(self, date) -> bool:
		"""Returns a boolean indicating if the date passed is within the date range."""
		print('Checking if ' + str(date) + ' is within : ' + str(self))
		if hasattr(self, '_start_date'):
			if type(self._start_date) == datetime:
				return self._end_date.date() >= date >= self._start_date.date()
			else:
				return self._end_date >= date >= self._start_date
		else:
			print()
			print('AAAA')
			print(self._weekday_end.day_of_the_week)
			print(get_day_of_the_week_number_from_datetime(date))
			print(self._weekday_start.day_of_the_week)
			print()
			return self._weekday_end.day_of_the_week >= get_day_of_the_week_number_from_datetime(date) >= self._weekday_start.day_of_the_week

		return False

	def __str__(self):
		if not hasattr(self, '_end_date'):
			return str(self._weekday_start) + '--' + str(self._weekday_end)
		else:
			return str(self._start_date) + '--' + str(self._end_date)
