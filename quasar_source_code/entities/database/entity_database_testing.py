# coding=utf-8

"""Temporary file while entity_database is being refactored"""


from quasar_source_code.entities.database.entity_database import EntityDatabaseAPI

db = EntityDatabaseAPI()
db.connect()

owners = db.get_all_owners()
for o in owners:
	print('OWNER : {' + str(o) + '}')

print(db.is_valid_owner('test', 'test'))
print(db.is_valid_owner('test', 'test2'))
print(db.is_valid_owner('test2', 'test2'))
print(db.is_valid_owner('test3', 'test3'))

db.terminate()

