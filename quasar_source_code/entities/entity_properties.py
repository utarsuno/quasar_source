# coding=utf-8

"""This module, entity_importance.py, is used for adding the 'importance' attribute to an entity."""

from quasar_source_code.entities import entity as e
from quasar_source_code.universal_code import debugging as dbg


class EntityProperty(e.EntityManager):
	"""Represents an entity property."""

	def __init__(self, property_name):
		super().__init__()
		self.name = property_name


class NumericalProperty(EntityProperty):
	"""Defines a numerical entity property."""

	def __init__(self, property_name, value):
		super().__init__(property_name)
		self._value = value

	@property
	def minimum_value(self):
		"""Returns the minimum value of this numerical property."""
		dbg.raise_abstract_method_call_exception('minimum_value')
		return

	@property
	def maximum_value(self):
		"""Returns the maximum value of this numerical property."""
		dbg.raise_abstract_method_call_exception('maximum_value')
		return

	@property
	def value(self):
		"""Returns the value of this numerical property."""
		return self._value

	def __lt__(self, other):
		return self._value < other.value

	def __le__(self, other):
		return self._value <= other.value

	def __eq__(self, other):
		return self._value == other.value

	def __ne__(self, other):
		return self._value != other.value

	def __gt__(self, other):
		return self._value > other.value

	def __ge__(self, other):
		return self._value >= other.value

	@property
	def value(self) -> int:
		"""Returns the importance property value."""
		return self._value

	@value.setter
	def value(self, val) -> None:
		"""Sets the importance value. Must be an integer value between 0-9."""
		if type(val) != int:
			dbg.raise_type_exception('value.setter', int, val)
		else:
			if val not in getattr(self, ''):
				dbg.raise_value_exception('value_setter', str(self.minimum_value) + '-' + str(self.maximum_value), val)
			else:
				self._value = val


class Importance(NumericalProperty):
	"""Defines the importance entity property."""

	ALLOWED_VALUES = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)

	def __init__(self, value):
		super().__init__('importance', value=value)

	@property
	def minimum_value(self) -> int:
		"""Returns the minimum value allowed for an importance property."""
		return Importance.ALLOWED_VALUES[0]

	@property
	def maximum_value(self) -> int:
		"""Returns the maximum value allowed for an importance property."""
		return Importance.ALLOWED_VALUES[-1]


class Difficulty(NumericalProperty):
	"""Defines the difficulty entity property."""

	ALLOWED_VALUES = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)

	def __init__(self, value):
		super().__init__('difficulty', value=value)

	@property
	def minimum_value(self) -> int:
		"""Returns the minimum value allowed for an difficulty property."""
		return Importance.ALLOWED_VALUES[0]

	@property
	def maximum_value(self) -> int:
		"""Returns the maximum value allowed for an difficulty property."""
		return Importance.ALLOWED_VALUES[-1]


class TimeNeeded(NumericalProperty):
	"""Defines the time-needed entity property."""

	ALLOWED_VALUES = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)

	def __init__(self, value):
		super().__init__('time_needed', value=value)

	@property
	def minimum_value(self) -> int:
		"""Returns the minimum value allowed for an time-needed property."""
		return Importance.ALLOWED_VALUES[0]

	@property
	def maximum_value(self) -> int:
		"""Returns the maximum value allowed for an time-needed property."""
		return Importance.ALLOWED_VALUES[-1]
