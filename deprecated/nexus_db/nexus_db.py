# coding=utf-8

"""This module, nexus_db.py, acts as an API to the NexusDB {MySQL}."""

import pika

import json
import time
from scripts.docker.wait_for_rabbit_host import WaitForRabbitMQHost


import mysql.connector



print('TODO: Run NexusDB!')





wait = WaitForRabbitMQHost()
wait.wait_for_connection()


print('MAKING A CONNECTION DB!')
connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbit_manager'))
print('CONNECTION MADE DB')
channel = connection.channel()

print('CHANNEL MADE!! DB')

#channel.queue_declare(queue='exchange_nexus_courier', durable=True, auto_delete=True)

print('QUEUE DECLARED DB')


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
                          routing_key = 'queue_nexus_db',
                          body = json.dumps(message2),
                          properties = pika.BasicProperties(
                              delivery_mode = 2,  # make message persistent
                          )
                          )

    print(" [x] Sent 'Hello World!'")



channel.basic_consume(callback,
                      queue='queue_nexus_db',
                      no_ack=False)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
