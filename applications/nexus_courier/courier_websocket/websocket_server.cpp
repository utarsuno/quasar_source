#include "/quasar/generated_output/third_party_libraries/uWebSocketsv0_14_8/src/uWS.h"
#include "server_logic.h"

#include <test.h>

#include <stdio.h>
#include <iostream>
#include <thread>
#include <chrono>
#include <cstdint>

// "All event handlers are attached to a group and all sockets belong to exactly one group."
NexusServer nexus;

//
MyTcpHandler MY_TEST;

int mainOLD() {
    uWS::Hub h;

    uS::Timer * timer = new uS::Timer(h.getLoop());
    timer->start([](uS::Timer * timer) {
        //printf("ONE SECOND HAS PASSED!!\n");
        fflush(stdout);
    }, 1000, 1000);


    printf("ECHO SERVER STARTED!!!\n");

    h.onError([](int port) {
        printf("SERVER HAD AN ERROR!! WITH PORT {%d}\n", port);
        fflush(stdout);
        exit(-1);
    });

    h.onMessage([](uWS::WebSocket<uWS::SERVER> *ws, char *message, size_t length, uWS::OpCode opCode) {

        //printf("SERVER GOT A MESSAGE!\n");
        //printf("THE CLIENT IS {%d}\n", get_client_id_from_websocket(ws));
        //printf("The message is {%.*s}\n", length, message);
        fflush(stdout);
        //ws->send(message, length, opCode);
    });

    h.onConnection([](uWS::WebSocket<uWS::SERVER> *ws, uWS::HttpRequest req) {
        nexus.on_connection(ws);
    });

    h.onDisconnection([](uWS::WebSocket<uWS::SERVER> *ws, int code, char *message, size_t length) {
        nexus.on_disconnection(ws);
    });

    // Testing out ping.
    //h.getDefaultGroup<uWS::SERVER>().startAutoPing(10000);
    if (h.listen(3001)) {
        h.run();
    }
}

int run_rabbitmq() {

    // address of the server
    //AMQP::Address address("amqp://guest:guest@localhost/vhost");
    AMQP::Address address("amqp://guest:guest@rabbit/vhost");
    //AMQP::Address address("rabbit");

    // create a AMQP connection object
    AMQP::TcpConnection connection(&MY_TEST, address);

    // and create a channel
    AMQP::TcpChannel channel(&connection);

    // use the channel object to call the AMQP method you like
    channel.declareExchange("", AMQP::fanout);
    channel.declareQueue("test");
    channel.bindQueue("test", "test", "test");


    return 0;
}

int main() {

    printf("START THREAD!\n");
    //fflush(stdout);

    std::thread thread_websocket (mainOLD);
    std::thread thread_rabbitmq (run_rabbitmq);

    printf("JOIN THREADS!\n");
    //fflush(stdout);

    thread_websocket.join();
    thread_rabbitmq.join();

    printf("FINISH threads!\n");
    //fflush(stdout);

    return 66;
}

