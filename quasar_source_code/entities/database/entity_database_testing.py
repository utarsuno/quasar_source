# coding=utf-8

"""Temporary file while entity_database is being refactored"""


from quasar_source_code.entities.database.entity_database import EntityDatabaseAPI

db = EntityDatabaseAPI()
db.connect()

owners = db.get_all_owners()
for o in owners:
	print('OWNER : {' + str(o) + '}')

db.terminate()

