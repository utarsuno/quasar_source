# coding=utf-8

"""This module, entity_database_status_view.py, is used to see a summary of the current state of the database."""
from quasar_source_code.entities.database import entity_database as e_db

db = e_db.EntityDatabaseAPI(debug=True)

print('Printing data :\n')
owners = db.get_all_owners()
for e in owners:
	print(e)
	manager = db.get_entity_manager(e[4])
	entities = manager.get_all_entities()
	for ee in entities:
		print(ee)
	print('-----------------------------------')

db.terminate()

#print(e._api.execute_query_and_get_all_results('SELECT * FROM entity_managers'))
#print(e._api.get_all_table_names())
#print(e.get_all_owners())
#e._full_reset()


#print(e._owners.get_row_values())
#print(e._entity_managers.get_row_values())
