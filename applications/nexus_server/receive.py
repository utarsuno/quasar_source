# coding=utf-8

import pika

import json
import time
from scripts.docker.wait_for_rabbit_host import WaitForRabbitMQHost


wait = WaitForRabbitMQHost()
wait.wait_for_connection()


print('MAKING A CONNECTION!')
connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbit_host'))
print('CONNECTION MADE')
channel = connection.channel()

print('CHANNEL MADE!!')

#channel.queue_declare(queue='exchange_nexus_courier', durable=True, auto_delete=True)

print('QUEUE DECLARED')


def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)

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