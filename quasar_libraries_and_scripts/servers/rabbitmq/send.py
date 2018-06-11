# coding=utf-8

import pika

import json

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='entity_db_receive')

#channel.basic_publish(exchange='',
#                      routing_key='hello',
#                      body='Hello World!')


message = {'cmd': 0, 'data': {'rid': 1, 'name': 'mah_entity-test'}, 'u': 'test'}

message2 = {'cmd': 0, 'username': 'test', 'mid': 0}


channel.basic_publish(exchange='',
                  routing_key='entity_db_receive',
                  body=json.dumps(message2),
                  properties=pika.BasicProperties(
                     delivery_mode = 2, # make message persistent
                  )
                )



print(" [x] Sent 'Hello World!'")



connection.close()



