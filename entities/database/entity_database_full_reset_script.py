# coding=utf-8

"""This module, entity_database_full_reset_script.py.py, is used to run a full database reset."""
from entities.database import entity_database as e_db

db = e_db.EntityDatabaseAPI(debug=True)
db._full_reset()
db.terminate()
print('Entity database reset!')
