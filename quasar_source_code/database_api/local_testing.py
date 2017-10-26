

from quasar_source_code.database_api import postgresql_api as db_api
from quasar_source_code.finance import finance_database as fdb
from quasar_source_code.universal_code import time_abstraction as time
from quasar_source_code.finance.finance_classes import FinancePortfolio
import datetime


'''
api = db_api.PostgreSQLAPI()
api.connect()
#api.create_database('nexus_db')

print(api.get_all_table_names())

query = """SELECT *
FROM information_schema.character_sets
;"""

print(api.execute_query_and_get_all_results(query))

api.terminate()
'''







db = fdb.FinanceDatabase()

db.database_api._master_table.create_if_does_not_exist()


divs = db.get_dividends()

total_amount = 0.0

for d in divs:
	total_amount += float(d['amount'])
	#print(d['amount'])

print('Total dividends received :' + str(total_amount))

#db.run_health_checks_and_grab_trade_data()

#trade_portfolio = db.trade_portfolio
#trade_portfolio.parse_trade_data()


finance = FinancePortfolio()

#rows = db.finance_table.get_row_values()
#finance.set_trades_from_database_rows(rows)


#for r in rows:
#	print(r)
