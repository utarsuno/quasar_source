# coding=utf-8

"""This module, base_entity.py, defines the base object for all Entity objects as well as Entity constants."""


# All the current possible Entity types.
ENTITY_TYPE_BASE          = 'Entity'
ENTITY_TYPE_TASK          = 'EntityTask'
ENTITY_TYPE_TIME          = 'EntityTime'
ENTITY_TYPE_WALL          = 'EntityWall'
ENTITY_TYPE_OWNER         = 'EntityOwner'
ENTITY_TYPE_TEXT_REMINDER = 'EntityTextReminder'
ENTITY_TYPE_ALL   = [ENTITY_TYPE_BASE, ENTITY_TYPE_TASK, ENTITY_TYPE_TIME, ENTITY_TYPE_WALL, ENTITY_TYPE_OWNER, ENTITY_TYPE_TEXT_REMINDER]

# TODO : track this
ENTITY_TYPE_TO_ABBREVIATION_DICT = {ENTITY_TYPE_BASE         : 'E',
                                    ENTITY_TYPE_TASK         : 'ETASK',
                                    ENTITY_TYPE_TIME         : 'ETIME',
                                    ENTITY_TYPE_WALL         : 'EW',
                                    ENTITY_TYPE_OWNER        : 'EO',
                                    ENTITY_TYPE_TEXT_REMINDER: 'ETR'}

# Identifies a property as an entity property.
ENTITY_PROPERTY_START_TOKEN = 'ep_'

# The default entity properties.
ENTITY_DEFAULT_PROPERTY_TYPE        = ENTITY_PROPERTY_START_TOKEN + 'type'
ENTITY_DEFAULT_PROPERTY_CHILD_IDS   = ENTITY_PROPERTY_START_TOKEN + 'child_ids'
ENTITY_DEFAULT_PROPERTY_PARENT_IDS  = ENTITY_PROPERTY_START_TOKEN + 'parent_ids'
ENTITY_DEFAULT_PROPERTY_RELATIVE_ID = ENTITY_PROPERTY_START_TOKEN + 'relative_id'
ENTITY_DEFAULT_PROPERTY_ALL         = [ENTITY_DEFAULT_PROPERTY_TYPE, ENTITY_DEFAULT_PROPERTY_CHILD_IDS, ENTITY_DEFAULT_PROPERTY_PARENT_IDS, ENTITY_DEFAULT_PROPERTY_RELATIVE_ID]

# Optional (reserved) entity properties.
ENTITY_PROPERTY_PUBLIC                 = ENTITY_PROPERTY_START_TOKEN + 'public'
ENTITY_PROPERTY_OWNER                  = ENTITY_PROPERTY_START_TOKEN + 'owner'
ENTITY_PROPERTY_PASSWORD               = ENTITY_PROPERTY_START_TOKEN + 'password'
ENTITY_PROPERTY_USERNAME               = ENTITY_PROPERTY_START_TOKEN + 'username'
ENTITY_PROPERTY_EMAIL                  = ENTITY_PROPERTY_START_TOKEN + 'email'
ENTITY_PROPERTY_NAME                   = ENTITY_PROPERTY_START_TOKEN + 'name'
ENTITY_PROPERTY_POSITION               = ENTITY_PROPERTY_START_TOKEN + 'position'
ENTITY_PROPERTY_LOOK_AT                = ENTITY_PROPERTY_START_TOKEN + 'look_at'
ENTITY_PROPERTY_COMPLETED              = ENTITY_PROPERTY_START_TOKEN + 'completed'
ENTITY_PROPERTY_PHONE_NUMBER           = ENTITY_PROPERTY_START_TOKEN + 'phone_number'
ENTITY_PROPERTY_PHONE_CARRIER          = ENTITY_PROPERTY_START_TOKEN + 'phone_carrier'
ENTITY_PROPERTY_CREATED_AT_DATE        = ENTITY_PROPERTY_START_TOKEN + 'created_at_date'
ENTITY_PROPERTY_DUE_DATE               = ENTITY_PROPERTY_START_TOKEN + 'due_date'
ENTITY_PROPERTY_SERVER_ID              = ENTITY_PROPERTY_START_TOKEN + 'server_id'


class Entity(object):
	"""Defines properties of all entities."""

	def __init__(self):
		self._relative_id     = -1
		self._parent_entities = []
		self._child_entities  = []
		# Holds all other data attached to this entity.
		self._information     = {}
		self._class_name      = ENTITY_TYPE_BASE

	def set_property_and_value(self, key, value):
		"""Sets a specific key{also called entity property} and its value."""
		if key == ENTITY_DEFAULT_PROPERTY_RELATIVE_ID:
			self._relative_id = value
		elif key == ENTITY_DEFAULT_PROPERTY_PARENT_IDS:
			self._parent_entities = value
		elif key == ENTITY_DEFAULT_PROPERTY_CHILD_IDS:
			self._child_entities = value
		elif key == ENTITY_DEFAULT_PROPERTY_TYPE:
			self._class_name = value
		else:
			self._information[key] = value

	'''__   ___ ___ ___  ___  __   __  
	  / _` |__   |   |  |__  |__) /__` 
	  \__> |___  |   |  |___ |  \ .__/ '''
    def has_property(self, key) -> bool:
    	"""Returns True if this entity has the property."""
    	if key == ENTITY_DEFAULT_PROPERTY_RELATIVE_ID:
    		if self._relative_id == -1:
    			return False
    	return key in self._information:


	@property
	def relative_id(self) -> int:
		"""Returns the global ID of this Entity."""
		return self._relative_id

	# TODO : REFORMAT EVERYTHING BELOW
	# TODO : REFORMAT EVERYTHING BELOW
	# TODO : REFORMAT EVERYTHING BELOW

	def get_additional_json_data(self) -> dict:
		"""To be implemented by child classes."""
		return {}

	def get_json_data(self) -> dict:
		"""Returns a dictionary of all the data contained in this Entity."""
		json_data = {ENTITY_DEFAULT_PROPERTY_TYPE: self._class_name,
		             ENTITY_DEFAULT_PROPERTY_PARENT_IDS: str(self._parent_entities),
		             ENTITY_DEFAULT_PROPERTY_CHILD_IDS: str(self._child_entities),
		             ENTITY_DEFAULT_PROPERTY_RELATIVE_ID: self._relative_id}

		for key in self._information:
			json_data[key] = self._information[key]

		return {**json_data, **self.get_additional_json_data()}

	@property
	def is_child(self) -> bool:
		"""Returns a boolean indicating if this entity has parent entities and no child entities."""
		return len(self._child_entities) == 0 and len(self._parent_entities) > 0

	@property
	def is_parent(self) -> bool:
		"""Returns a boolean indicating if this entity has any child entities."""
		return len(self._child_entities) > 0

	@property
	def parents(self) -> list:
		"""Returns a list of parent entities relative to this entity."""
		return self._parent_entities

	@property
	def all_parents(self) -> list:
		"""Returns a list of ALL parent entities relative to this entity."""
		if len(self._parent_entities) == 0:
			return [self]
		parent_entities = []
		for pe in self._parent_entities:
			parent_entities += pe.all_parents
		return parent_entities

	@property
	def children(self) -> list:
		"""Returns a list of child entities relative to this entity."""
		return self._child_entities

	@property
	def all_children(self) -> list:
		"""Returns a list of ALL child entities relative to this entity."""
		if len(self._child_entities) == 0:
			return []
		child_entities = [] + self._child_entities
		for ce in self._child_entities:
			child_entities += ce.all_children
		return child_entities

	def print_info(self):
		"""Used only for debugging."""
		print(self)
		json_data = self.get_json_data()
		for key in json_data:
			print(str(key) + ' - ' + str(json_data[key]))

	def get_full_info(self):
		"""Debugging"""
		raw_data = self.get_json_data()
		slim_data = {}
		for key in raw_data:
			value = raw_data[key]
			slim_data[key] = value
		return '[' + str(self._relative_id) + '] - ' + ENTITY_TYPE_TO_ABBREVIATION_DICT[self._class_name] + '{' + str(slim_data) + '}\n'

	def get_pretty_print(self):
		"""Debugging"""
		raw_data = self.get_json_data()
		slim_data = {}
		for key in raw_data:
			value = raw_data[key]
			if str(value) != '[]':
				if key not in ENTITY_DEFAULT_PROPERTY_ALL:
					slim_data[key] = value
		return '[' + str(self._relative_id) + '] - ' + ENTITY_TYPE_TO_ABBREVIATION_DICT[self._class_name] + '{' + str(slim_data) + '}'

	def __str__(self):
		raw_data = self.get_json_data()
		slim_data = {}
		for key in raw_data:
			value = raw_data[key]
			if str(value) != '[]':
				if key != ENTITY_DEFAULT_PROPERTY_RELATIVE_ID:
					slim_data[key] = value

		return '[' + str(self._relative_id) + '] - ' + ENTITY_TYPE_TO_ABBREVIATION_DICT[self._class_name] + '{' + str(slim_data) + '}'

	'''  __               __       /     __        __   ___      ___     __   __   ___  __       ___    __        __
		/  ` |__| | |    |  \     /     |__)  /\  |__) |__  |\ |  |     /  \ |__) |__  |__)  /\   |  | /  \ |\ | /__`    .
		\__, |  | | |___ |__/    /      |    /~~\ |  \ |___ | \|  |     \__/ |    |___ |  \ /~~\  |  | \__/ | \| .__/    .'''

	# Private utility functions.
	def _add_child(self, entity):
		"""Adds a single child entity to this entity."""

		if type(entity) == int:
			print(entity)
			raise Exception('YO ENTITY WAS AN INT')

		if entity not in self._child_entities:
			self._child_entities.append(entity)
			# Make sure the child entity has a parent pointer to self.
			if self not in entity.parents:
				entity.add_parents(self)

	def _add_parent(self, entity):
		"""Adds a single parent entity to this entity."""

		if type(entity) == int:
			print(entity)
			raise Exception('YO ENTITY WAS AN INT')

		if entity not in self._parent_entities:
			self._parent_entities.append(entity)
			# Make sure this parent has this entity as a child.
			if self not in entity.children:
				entity.add_children(self)

	def _remove_child(self, entity):
		"""Removes a single child entity from this entity."""

		if type(entity) == int:
			print(entity)
			raise Exception('YO ENTITY WAS AN INT')

		if self in entity.parents:
			entity.remove_parent(self)
		if entity in self.children:
			self._child_entities.remove(entity)

	def _remove_parent(self, entity):
		"""Removes a single parent entity from this entity."""

		if type(entity) == int:
			print(entity)
			raise Exception('YO ENTITY WAS AN INT')

		if self in entity.children:
			entity.remove_child(self)
		if entity in self.parents:
			self._parent_entities.remove(entity)

	# Public functions.

	def remove_parent(self, obj):
		"""Removes the provided parent entity from this entity."""
		if type(obj) == list or type(obj) == tuple:
			for e in obj:
				self._remove_parent(e)
		else:
			self._remove_parent(obj)

	def remove_children(self, obj) -> None:
		"""Removes n child entities from this entity."""
		if type(obj) == list or type(obj) == tuple:
			for e in obj:
				self._remove_child(e)
		else:
			self._remove_child(obj)

	def add_children(self, obj) -> None:
		"""Adds n child entities to this entity."""
		if type(obj) == list or type(obj) == tuple:
			for e in obj:
				self._add_child(e)
		else:
			self._add_child(obj)

	def add_parents(self, obj) -> None:
		"""Adds n parent entities to this entity."""
		if type(obj) == list or type(obj) == tuple:
			for e in obj:
				self._add_parent(e)
		else:
			self._add_parent(obj)
