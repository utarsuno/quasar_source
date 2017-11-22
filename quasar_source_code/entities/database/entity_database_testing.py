# coding=utf-8

"""Temporary file while entity_database is being refactored"""

# Owner dictionary key mappings.
OWNER_KEY_NAME      = 'name'
OWNER_KEY_PASSWORD  = 'password'
OWNER_KEY_EMAIL     = 'email'
OWNER_KEYS_REQUIRED = [OWNER_KEY_PASSWORD, OWNER_KEY_NAME, OWNER_KEY_EMAIL]
OWNER_KEY_ID        = '_id'

from quasar_source_code.entities.database.entity_database import EntityDatabaseAPI

db = EntityDatabaseAPI()
db.connect()

#db.create_owner({OWNER_KEY_NAME: 'test4', OWNER_KEY_EMAIL: 'test3@test3.com', OWNER_KEY_PASSWORD: 'test3'})
owner_id = db.get_owner_id_by_name('test4')
print(owner_id)

db.update_owner({OWNER_KEY_ID: owner_id, 'email': 'apple@apple.com', 'no': 'yes'})

owners = db.get_all_owners()
for o in owners:
	print('OWNER : {' + str(o) + '}')

print(db.is_valid_owner('test', 'test'))
print(db.is_valid_owner('test', 'test2'))
print(db.is_valid_owner('test2', 'test2'))
print(db.is_valid_owner('test3', 'test3'))

db.terminate()

