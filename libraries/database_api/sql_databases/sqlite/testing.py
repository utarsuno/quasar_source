from sqlite.sqlite_db import SQLiteDB
from sqlite import column_abstraction as col
from sqlite import data_types as dt
from sqlite import table_abstraction as table


#http://www.sqlitetutorial.net/sqlite-create-table/
#https://stackoverflow.com/questions/1601151/how-do-i-check-in-sqlite-whether-a-table-exists
#https://docs.python.org/2/library/sqlite3.html

#apple = 'SELECT * FROM {}'.format('apple')
#print(apple)
#exit()

# testing

print('SET THE PATH!!!!!')
db = SQLiteDB('PATH_TO_DB')
db.connect()

# table
test_table = table.TableAbstraction('my_table')
test_table.add_column(col.ColumnAbstraction('my_int_col',  dt.SQLiteDataTypeINTEGER(is_primary_key=False,
                                                                                    is_nullable=False,
                                                                                    is_unique=False)))
db.add_table(test_table)



print(test_table.exists)
print('hi')


