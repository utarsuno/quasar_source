

from quasar_source_code.database_api import postgresql_api as db_api
from quasar_source_code.finance import finance_database as fdb
from quasar_source_code.universal_code import time_abstraction as time
from quasar_source_code.finance.finance_classes import FinancePortfolio
import datetime


api = db_api.PostgreSQLAPI()
api.connect()
#api.create_database('nexus_db')

print(api.get_all_table_names())

api.terminate()

#db = fdb.FinanceDatabase()
#db.run_health_checks_and_grab_trade_data()

#trade_portfolio = db.trade_portfolio
#trade_portfolio.parse_trade_data()


#finance = FinancePortfolio()

#rows = db.finance_table.get_row_values()
#finance.set_trades_from_database_rows(rows)


