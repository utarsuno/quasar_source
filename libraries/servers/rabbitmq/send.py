# coding=utf-8

import pika

import json

import time


connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))



channel = connection.channel()

channel.queue_declare(queue='test')

#channel.basic_publish(exchange='',
#                      routing_key='hello',
#                      body='Hello World!')


message = {'cmdHELLO_WORLD_LOL': 0, 'data': {'rid': 1, 'name': 'mah_entity-test'}, 'u': 'test'}


i = 0
while i < 10:

    message2 = {'cmdN^$^N$^N$#^CRT': 0, 'username': 'test', 'mid': 0}


    channel.basic_publish(exchange='',
                      routing_key='test',
                      body=json.dumps(message2),
                      properties=pika.BasicProperties(
                         delivery_mode = 2, # make message persistent
                      )
                    )



    print(" [x] Sent 'Hello World!'")

    time.sleep(2)
    i += 1






connection.close()



