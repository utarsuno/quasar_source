# coding=utf-8

"""This module, entity_database_status_view.py, is used to see a summary of the current state of the database."""

import sys

arguments = sys.argv[1:]
owner_argument = None
for i, arg in enumerate(arguments):
	if arg == '-o':
		owner_argument = arguments[i + 1]

# Owner dictionary key mappings.
OWNER_KEY_NAME      = 'ep_name'
OWNER_KEY_PASSWORD  = 'ep_password'
OWNER_KEY_EMAIL     = 'ep_email'
OWNER_KEYS_REQUIRED = [OWNER_KEY_PASSWORD, OWNER_KEY_NAME, OWNER_KEY_EMAIL]
OWNER_KEY_ID        = 'ep_id'

from quasar_source_code.entities.database.entity_database import EntityDatabaseAPI
from lazyme.string import color_print

db = EntityDatabaseAPI()
db.connect()

owners = db.get_all_owners()
if owner_argument is None:
	print('Printing all owners and their data.')
	for o in owners:
		color_print('OWNER : {' + str(o.get_owner_name()) + '}', color='yellow')
		print(o.get_entity_manager().get_pretty_print_all_entities())
else:
	print('Printing data on specific owner ' + owner_argument)
	for o in owners:
		if o.get_owner_name() == owner_argument:
			color_print('OWNER : {' + str(o.get_owner_name()) + '}', color='yellow')
			print(o.get_entity_manager().get_pretty_print_all_entities())
