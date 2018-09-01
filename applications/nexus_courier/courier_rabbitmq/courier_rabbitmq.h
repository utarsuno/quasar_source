#ifndef COURIER_RABBITMQ
#define COURIER_RABBITMQ

// C++
#include <thread>
// RabbitMQ
#include <amqpcpp.h>
#include <boost/asio/io_service.hpp>
#include <boost/asio/strand.hpp>
#include <boost/asio/deadline_timer.hpp>
#include <amqpcpp/libboostasio.h>

// Let C++ know that this class will be defined.
class CourierWebsocket;


class CourierRabbitMQ {
    public:
        CourierRabbitMQ(std::string connection_address, std::string queue_name);
        std::thread start_service();
        void set_reference_websockets(CourierWebsocket * websockets);

        void forward_message(char * message, size_t length);
    private:
        CourierWebsocket * websockets;
        std::string        connection_address;
        std::string        queue_name;

        //
        AMQP::TcpChannel * channel;

        void run_rabbitmq();
};


#endif
