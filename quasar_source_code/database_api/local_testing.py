


from quasar_source_code.database_api import postgresql_api as db_api

api = db_api.PostgreSQLAPI()
api.connect()

table = api.get_master_table()

print(table.get_rows())
