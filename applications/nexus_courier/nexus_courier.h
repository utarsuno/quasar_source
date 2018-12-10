#ifndef NEXUS_COURIER
#define NEXUS_COURIER

// Universal
#define TRUE 1
#define FALSE 0
// C++
#include <thread>
#include <stdio.h>
#include <string>
#include <iostream>
#include <chrono>
#include <cstdint>
// RabbitMQ
#include <amqpcpp.h>
#include <boost/asio/io_service.hpp>
#include <boost/asio/strand.hpp>
#include <boost/asio/deadline_timer.hpp>
#include <amqpcpp/libboostasio.h>
// Websockets
#include "/quasar_source/generated_output/third_party_libraries/uWebSocketsv0_14_8/src/uWS.h"
// Custom
#include "client_instance.h"
#include "courier_rabbitmq.h"
#include "courier_websocket.h"



class NexusCourier {
public:
    NexusCourier();
    void start();
    void wait_for_completion();
private:
    CourierRabbitMQ  * rabbitmq;
    CourierWebsocket * websockets;
    std::thread        thread_rabbitmq;
    std::thread        thread_websockets;
};

#endif
