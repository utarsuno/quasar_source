# coding=utf-8

import pika

import json
import time
from scripts.docker.wait_for_rabbit_host import WaitForRabbitMQHost
from libraries.database_abstraction.sql.sqlite import sqlite_db
from libraries.database_abstraction.sql.sqlite import table_abstraction
from libraries.database_abstraction.sql.query_abstraction import sql_query

######################################################################
db = sqlite_db.SQLiteDB('/v/db.sqlite', False, True)
todo_lists = table_abstraction.TableAbstraction('todo_lists')
todo_lists.add_column_string('table_id', nullable=False, unique=True)
todo_lists.add_column_string('px', nullable=False, unique=False)
todo_lists.add_column_string('py', nullable=False, unique=False)
todo_lists.add_column_string('pz', nullable=False, unique=False)
todo_lists.add_column_string('nx', nullable=False, unique=False)
todo_lists.add_column_string('ny', nullable=False, unique=False)
todo_lists.add_column_string('nz', nullable=False, unique=False)
todo_rows = table_abstraction.TableAbstraction('todo_rows')
todo_rows.add_column_string('table_id', nullable=False, unique=False)
todo_rows.add_column_string('row_id', nullable=False, unique=False)
todo_rows.add_column_string('description', nullable=False, unique=False)
todo_rows.add_column_string('time', nullable=False, unique=False)
todo_rows.add_column_string('difficulty', nullable=False, unique=False)
todo_rows.add_column_string('importance', nullable=False, unique=False)
todo_rows.add_column_string('completed', nullable=False, unique=False)
######################################################################


wait = WaitForRabbitMQHost()
wait.wait_for_connection()


print('MAKING A CONNECTION!')
connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbit_manager'))
print('CONNECTION MADE')
channel = connection.channel()

print('CHANNEL MADE!!')

#channel.queue_declare(queue='exchange_nexus_courier', durable=True, auto_delete=True)

print('QUEUE DECLARED')


def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)

    print(body)
    #print(type(body))
    #print(body.decode("utf-8"))

    m = body.decode('utf-8')
    m = eval(m)
    #print(m)
    #print(type(m))

    data = m['d']

    #for table in data

    #message2 = {'TEST_RESPONSE': body.decode("utf-8")}
    message2 = {'m2': 'saved!'}

    channel.basic_publish(exchange = '',
                          routing_key = 'queue_nexus_courier',
                          body = json.dumps(message2),
                          properties = pika.BasicProperties(
                              delivery_mode = 2,  # make message persistent
                          )
                          )

    print(" [x] Sent 'Hello World!'")



channel.basic_consume(callback,
                      queue='queue_nexus_server',
                      no_ack=False)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()






'''

message = {'cmd': 0, 'data': {'rid': 1, 'name': 'mah_entity-test'}, 'u': 'test'}

message2 = {'cmd': 0, 'username': 'test', 'mid': 0}


print('SENDIONG MESSAGES!!!!!!!!!!!!!')
print('SENDIONG MESSAGES!!!!!!!!!!!!!')
print('SENDIONG MESSAGES!!!!!!!!!!!!!')
i = 0
while i < 10:

    print('SENDING A MESSAGE!!!')

    message2 = {'cmdTEST_TEST_TESTSET': i, 'username': 'test', 'mid': 0}


    channel.basic_publish(exchange='exchange_nexus_courier',
                      routing_key='routing_key',
                      body=json.dumps(message2),
                      properties=pika.BasicProperties(
                         delivery_mode = 2, # make message persistent
                      )
                    )



    print(" [x] Sent 'Hello World!'")


    time.sleep(4)
    i += 1



connection.close()

'''