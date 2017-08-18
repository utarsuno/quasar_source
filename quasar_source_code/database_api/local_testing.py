


from quasar_source_code.finance import finance_database as fdb


import datetime

db = fdb.FinanceDatabase()

#db.master_table.set_single_value('last_updated', datetime.date.today(), 'table_name', db.finance_table.table_name)

db.master_table.print_all_data()
print()
#db.finance_table.print_all_data()


db.health_checks()


#db.master_table.print_all_data()
#print()
#db.finance_table.print_all_data()

