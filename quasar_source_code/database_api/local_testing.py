


from quasar_source_code.finance import finance_database as fdb
from quasar_source_code.universal_code import time_abstraction as time
from quasar_source_code.finance.finance_classes import TradePortfolio
import datetime

db = fdb.FinanceDatabase()
db.health_checks()

finance = TradePortfolio()

rows = db.finance_table.get_row_values()
finance.set_trades_from_database_rows(rows)

