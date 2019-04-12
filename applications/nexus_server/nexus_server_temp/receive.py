# coding=utf-8

import pika

import json

import time

print('SLEEPING!')
time.sleep(15)
print('SLEEP DONE')

print('MAKING A CONNECTION!')
connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbit1'))
print('CONNECTION MADE')
channel = connection.channel()

print('CHANNEL MADE!!')

channel.queue_declare(queue='test')

print('QUEUE DECLARED')

#channel.basic_publish(exchange='',
#                      routing_key='hello',
#                      body='Hello World!')


message = {'cmd': 0, 'data': {'rid': 1, 'name': 'mah_entity-test'}, 'u': 'test'}

message2 = {'cmd': 0, 'username': 'test', 'mid': 0}


print('SENDIONG MESSAGES!!!!!!!!!!!!!')
print('SENDIONG MESSAGES!!!!!!!!!!!!!')
print('SENDIONG MESSAGES!!!!!!!!!!!!!')
i = 0
while i < 10:

    print('SENDING A MESSAGE!!!')

    message2 = {'cmdTEST_TEST_TESTSET': i, 'username': 'test', 'mid': 0}


    channel.basic_publish(exchange='',
                      routing_key='test',
                      body=json.dumps(message2),
                      properties=pika.BasicProperties(
                         delivery_mode = 2, # make message persistent
                      )
                    )



    print(" [x] Sent 'Hello World!'")


    time.sleep(4)
    i += 1



connection.close()



