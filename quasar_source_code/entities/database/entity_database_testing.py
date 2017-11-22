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

'''
db.create_owner({OWNER_KEY_NAME: 'test1', OWNER_KEY_EMAIL: 'test@test.com', OWNER_KEY_PASSWORD: 'test1'})
db.create_owner({OWNER_KEY_NAME: 'test2', OWNER_KEY_EMAIL: 'test@test.com', OWNER_KEY_PASSWORD: 'test2'})
owner_id = db.get_owner_id_by_name('test4')
owner_id2 = db.get_owner_id_by_name('test2')
print(owner_id)

db.update_owner({OWNER_KEY_ID: owner_id, '0': {'entity_name': 'hello'}, '1': {'entity_name': 'hello'}, 'no': 'yes'})
db.update_owner({OWNER_KEY_ID: owner_id2, '0': {'entity_name': 'hell3333o'}, '1': {'entity_name': 'hello22'}, 'no': 'ye222s'})
'''
owner_id = db.get_owner_id_by_name('test4')
owner_id2 = db.get_owner_id_by_name('test2')
db.update_owner({OWNER_KEY_ID: owner_id, '0': {'entity_name': 'hello'}, '1': {'entity_name': 'hello'}, 'no': 'yes'})
db.update_owner({OWNER_KEY_ID: owner_id2, '0': {'entity_name': 'hell3333o'}, '1': {'entity_name': 'hello22'}, 'no': 'ye222s'})

owners = db.get_all_owners()
for o in owners:
	print('OWNER : {' + str(o) + '}')

print(db.is_valid_owner('test', 'test'))
print(db.is_valid_owner('test', 'test2'))
print(db.is_valid_owner('test2', 'test2'))
print(db.is_valid_owner('test3', 'test3'))

db.terminate()

