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
//MyTcpHandler MY_TEST;
//ConnHandler handler;


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

#include <boost/asio/io_service.hpp>
#include <boost/asio/strand.hpp>
#include <boost/asio/deadline_timer.hpp>

#include <amqpcpp/libboostasio.h>

/**
 *  Main program
 *  @return int
 */
int run_rabbitmq() {

    // access to the boost asio handler
    // note: we suggest use of 2 threads - normally one is fin (we are simply demonstrating thread safety).
    boost::asio::io_service service(2);

    // handler for libev
    AMQP::LibBoostAsioHandler handler(service);

    // make a connection
    AMQP::TcpConnection connection(&handler, AMQP::Address("amqp://guest:guest@rabbit_host/"));

    // we need a channel too
    AMQP::TcpChannel channel(&connection);

    /*
    // create a temporary queue
    channel.declareQueue("queue_nexus_courier", AMQP::autodelete + AMQP::durable).onSuccess([&connection](const std::string &name, uint32_t messagecount, uint32_t consumercount) {

        // report the name of the temporary queue
        std::cout << "declared queue " << name << std::endl;

        // now we can close the connection
        //connection.close();
    });
    */

    channel.consume("queue_nexus_courier", AMQP::noack)
        .onReceived
        (
            [](const AMQP::Message &msg, uint64_t tag, bool redelivered)
            {
                //std::cout << "Received: " << msg.body() << std::endl;
                printf("The message is {%.*s}\n", msg.bodySize(), msg.body());
            }
        )
        .onError([](const char * message) {
            printf("ERROR OCCURED!! {%s}\n", message);
        });

    // run the handler
    // a t the moment, one will need SIGINT to stop.  In time, should add signal handling through boost API.
    service.run();
}



int run_rabbitmqOLD() {

    // create an instance of your own connection handler
    MyConnectionHandler myHandler;

    // create a AMQP connection object
    AMQP::Connection connection(&myHandler, AMQP::Login("guest","guest"), "rabbit_host");

    // and create a channel
    AMQP::Channel channel(&connection);

    // use the channel object to call the AMQP method you like
    channel.declareExchange("test", AMQP::fanout);
    channel.declareQueue("test", AMQP::durable + AMQP::autodelete);
    channel.bindQueue("test", "test", "test");







    //auto *poll = EV_DEFAULT;


    // address of the server
    //AMQP::Address address("amqp://guest:guest@localhost/vhost");
    //AMQP::Address address("amqp://guest:guest@rabbit_host/vhost");
    //AMQP::Address address("rabbit");


    /*

    AMQP::TcpConnection connection(handler, AMQP::Address("amqp://rabbit_host/"));
    AMQP::TcpChannel channel(&connection);
    channel.onError([&handler](const char* message)
        {
            std::cout << "Channel error: " << message << std::endl;
            handler.Stop();
        });
    channel.declareQueue("test", AMQP::autodelete + AMQP::durable)
        .onSuccess
        (
            [&connection](const std::string &name,
                          uint32_t messagecount,
                          uint32_t consumercount)
            {
                std::cout << "Created queue: " << name << std::endl;
            }
        );
    channel.consume("test", AMQP::noack)
        .onReceived
        (
            [](const AMQP::Message &msg, uint64_t tag, bool redelivered)
            {
                std::cout << "Received: " << msg.message() << std::endl;
            }
        );
    handler.Start();
    std::cout << "Closing connection." << std::endl;
    connection.close();

    */



    /*
    AMQP::TcpConnection connection(handler, AMQP::Address("amqp://rabbit_host/"));
    AMQP::TcpChannel channel(&connection);

    // declare the queue
    channel.declareQueue("test", AMQP::durable + AMQP::autodelete, arguments).onSuccess(callback);

    // Define callbacks and start
    auto messageCb = [&channel](
            const AMQP::Message &message, uint64_t deliveryTag,
            bool redelivered)
    {
        std::cout << "message received" << std::endl;
        // acknowledge the message
        channel.ack(deliveryTag);
        processMessage(message.routingKey(), message.body());
    };

    // callback function that is called when the consume operation starts
    auto startCb = [](const std::string &consumertag) {

        std::cout << "consume operation started: " << consumertag << std::endl;
    };

    // callback function that is called when the consume operation failed
    auto errorCb = [](const char *message) {

        std::cout << "consume operation failed" << std::endl;
    };

    channel.consume("domoqueue")
        .onReceived(messageCb)
        .onSuccess(startCb)
        .onError(errorCb);

    // run the poll
    ev_run(poll, 0);
    */


    /*

    // create a AMQP connection object
    AMQP::TcpConnection connection(&handler, address);

    // and create a channel
    AMQP::TcpChannel channel(&connection);

    // use the channel object to call the AMQP method you like
    channel.declareExchange("", AMQP::topic);
    channel.declareQueue("test");
    channel.bindQueue("test", "test", "test");
    */

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

